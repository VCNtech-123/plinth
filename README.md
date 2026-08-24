# Plinth

A multi-tenant SaaS platform for managing clients, projects, and tasks across team workspaces, with role-based access control and a metrics dashboard.

React 19 · TypeScript · Node.js/Express 5 · MongoDB · Zod · Jest

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Workspaces & Access Control](#workspaces--access-control)
- [Validation Layer](#validation-layer)
- [Testing](#testing)
- [Data Models](#data-models)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Plinth is a full-stack portfolio project modeling a multi-tenant SaaS product: a workspace with team members manages Clients → Projects → Tasks, with comments and a metrics dashboard. It started as a single-owner CRUD app and was later migrated to workspace-based multi-user tenancy — every record is scoped to a workspace, not a single user, and access within a workspace is governed by role.

- **Workspace-scoped tenant isolation**, enforced at the database query level and covered by integration tests.
- **Role-based access control** (owner/admin/member/viewer) on every mutating endpoint.
- **Schema-validated input** on every route via Zod.
- **Lifecycle-aware data** — soft delete and restore, with cascade rules between projects and tasks.
- **A dashboard** built on parallelized MongoDB aggregations (summary stats, trends, at-risk projects, recent activity).
- **A typed contract** between frontend and backend, with dedicated request/response types on both sides.

## Tech Stack

**Frontend**
- React 19 + TypeScript, built with Vite
- React Router 7, with protected-route guards
- Zustand for auth and workspace state
- Axios (`withCredentials`) with a global 401 interceptor
- Tailwind CSS 4 with a token-based light/dark theme
- `@hello-pangea/dnd` for the drag-and-drop task board
- Recharts for dashboard trend visualization
- Sonner for toast notifications, lucide-react for icons

**Backend**
- Node.js + Express 5, TypeScript
- MongoDB + Mongoose 9 (ODM)
- Zod for request validation on every route
- JWT authentication delivered via an `httpOnly` cookie
- bcrypt for password hashing
- Helmet for secure HTTP headers
- express-rate-limit for global rate limiting

**Testing**
- Jest + ts-jest + Supertest, run against a real MongoDB instance
- Integration tests organized by domain, covering tenant isolation and soft-delete lifecycle

**Deployment target:** the client ships a `vercel.json` SPA rewrite config for static hosting; the API is a standard Node/Express service deployable to any Node host.

## Architecture

Plinth is a monorepo with two independently deployable apps:

```text
plinth/
├── client/     React SPA (Vite)
└── server/     Express REST API
```

### Backend — layered, modular-by-domain

```text
server/src/
├── modules/
│   ├── auth/         # register, login, logout, session
│   ├── user/          # user model + service
│   ├── client/         # client CRUD, workspace-scoped
│   ├── project/         # project CRUD + soft delete/restore
│   ├── task/              # task CRUD + soft delete/restore + assignee
│   ├── comment/             # task comments + soft delete/restore
│   ├── workspace/             # workspaces, membership, invites, roles
│   └── dashboard/                # aggregated analytics
├── middleware/                     # auth, workspace attach, authorize, validate, security, rate limiting
├── utils/                            # ApiError, JWT signing, ObjectId schema, pagination
├── types/                              # shared request/response types
├── tests/                                # Jest + Supertest suite, grouped by domain
└── config/                                 # environment loading
```

Every domain module follows the same layering, and business logic never lives in a controller:

| Layer | Responsibility |
|---|---|
| **routes** | Wire up `protect` → `attachWorkspace` → `validate` → `authorize` (where relevant) → controller |
| **controller** | Handle HTTP request/response shape only |
| **service** | All business logic and database queries, always workspace-scoped |
| **model** | Mongoose schema + TypeScript interface |
| **validation** | Zod schemas for `body`/`params`/`query`, enforced before the controller runs |

### Frontend — feature-folder React app

```text
client/src/
├── api/            # one file per domain, thin axios wrappers
├── pages/           # auth, dashboard, clients, projects, tasks, workspaces
│   └── <feature>/     components/, modals/, hooks/
├── layouts/           # AuthLayout, DashboardLayout
├── routes/             # router config + ProtectedRoute guard
├── store/               # zustand: auth, workspace
├── providers/            # SessionProvider (hydrates auth + workspace state on load)
└── types/                 # types mirrored from the API contract
```

The **Tasks** page is a drag-and-drop Kanban board (`Todo` / `In Progress` / `Done`) built with `@hello-pangea/dnd`, with a task drawer that includes assignee selection and a comment thread.

## Core Features

- **Auth** — register/login with a password policy (12+ characters, upper/lower/digit) enforced at the schema level, confirm-password check on registration, JWT issued as an `httpOnly` cookie, `/auth/me` session check, logout clears the cookie.
- **Workspaces** — every user gets a default workspace on registration; users can create additional workspaces, switch between them, rename a workspace, and leave one.
- **Members & invites** — invite a user by email into a workspace with a role, accept or decline an invite, list current members, change a member's role, remove a member.
- **Clients** — CRUD, search by name, filter by status, and a client detail view returning recent projects plus rolled-up stats.
- **Projects** — CRUD, filter by status, soft delete with restore; deleting a project cascades to soft-delete its tasks.
- **Tasks** — CRUD, drag-and-drop Kanban board, assignee, soft delete with restore, independent of the parent project's lifecycle.
- **Comments** — threaded comments on a task, with soft delete/restore.
- **Dashboard** — a single `GET /api/dashboard` call returns, computed in parallel and scoped to the current workspace: summary counters, a 7-day created-vs-completed task trend, at-risk projects (ranked by overdue task count via an aggregation pipeline), and recent activity.
- **Pagination & filtering** — list endpoints accept `page`/`limit`/`status`/`search`-style query params, validated and bounded server-side.

## Workspaces & Access Control

A user's identity (`req.user`, from the JWT cookie) is separate from their current workspace context (`req.workspace` / `req.membership`), which is resolved by the `attachWorkspace` middleware from `User.currentWorkspace`.

- **Switching workspaces** (`PATCH /workspaces/me/switch`) looks up an active `WorkspaceMember` for the requested workspace and the current user; if none exists, the switch is rejected. On success it updates `User.currentWorkspace`, so every subsequent request is scoped to the new workspace without any extra client-side state.
- **Roles**: `owner`, `admin`, `member`, `viewer`. Enforced per-route with an `authorize(...roles)` middleware, e.g. deleting a project requires `owner`, inviting a member requires `owner` or `admin`, reading data requires only an active membership.
- **Data isolation**: `Client`, `Project`, `Task`, and `Comment` all carry a `workspace` field, and every service-layer query is scoped by `workspace: req.workspace._id`. A user can't read or mutate a record in a workspace they don't belong to, regardless of the document ID.

## Validation Layer

Every route across every module is wrapped in a `validate(schema)` middleware that runs a Zod schema against `{ body, params, query }` before the controller executes:

```ts
router.post("/", protect, validate(createProjectSchema), createProject);
router.delete("/me/members/:id", validate(removeMemberSchema), authorize("owner"), removeMember);
```

- **`.strict()` objects** reject unknown fields, closing off mass-assignment at the schema level.
- **Shared `objectIdSchema`** validates Mongo ObjectIds by regex before they reach a query.
- **Coerced, bounded query params** — `page`/`limit` on list endpoints are coerced to numbers and clamped server-side.
- **Update schemas** are `createSchema.partial().strict()`, so an update can only ever touch fields the create schema already allows.
- **Cross-field validation** — e.g. the registration schema's `.refine()` check that `password === confirmPassword`.

## Testing

The backend has a Jest + Supertest integration suite that runs against a real MongoDB instance, organized by domain under `server/src/tests/`:

| Area | Coverage |
|---|---|
| `auth/` | Registration (including password confirmation), login |
| `client/` | Tenant isolation, soft delete/restore |
| `project/` | Tenant isolation, soft delete/restore |
| `task/` | Tenant isolation, soft delete/restore |
| `comment/` | Tenant isolation, soft delete/restore |
| `workspace/` | Registration flow (default workspace creation) |

Shared setup lives in `tests/utils/` (per-domain helpers for creating an authenticated user, client, project, and task). Each collection is cleared between tests to keep the suite deterministic.

```bash
cd server
npm test
```

## Data Models

| Model | Key fields |
|---|---|
| **User** | `name`, `email` (unique), `password` (hashed, `select: false`), `role`, `currentWorkspace` |
| **Workspace** | `name`, `createdBy` |
| **WorkspaceMember** | `workspace` (ref), `user` (ref), `role: owner \| admin \| member \| viewer`, `status: pending \| active` |
| **Client** | `name`, `email`, `phone`, `company`, `notes`, `status: active \| inactive`, `workspace`, `isDeleted` |
| **Project** | `name`, `description`, `status: active \| completed \| paused`, `deadline`, `budget`, `client` (ref), `workspace`, `isDeleted` |
| **Task** | `title`, `description`, `status: todo \| in-progress \| done`, `priority: low \| medium \| high`, `dueDate`, `assignee`, `project` (ref), `workspace`, `isDeleted` |
| **Comment** | `content`, `task` (ref), `author` (ref), `workspace`, `isDeleted` |

## API Reference

Base URL: `/api`. Every route except `auth/register` and `auth/login` requires a valid session cookie, and every route validates its input with a Zod schema before reaching the controller.

**Auth**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a user and a default workspace |
| POST | `/auth/login` | Authenticate, sets session cookie |
| POST | `/auth/logout` | Clear session cookie |
| GET | `/auth/me` | Get the current authenticated user |

**Workspaces**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/workspaces` | List workspaces the user belongs to |
| POST | `/workspaces` | Create a new workspace |
| PATCH | `/workspaces/me/switch` | Switch the user's current workspace |
| GET | `/workspaces/me` | Get the current workspace + role |
| PATCH | `/workspaces/me` | Rename the current workspace (owner/admin) |
| POST | `/workspaces/me/leave` | Leave the current workspace |
| GET | `/workspaces/me/members` | List members of the current workspace |
| POST | `/workspaces/me/members` | Invite a member by email (owner/admin) |
| DELETE | `/workspaces/me/members/:id` | Remove a member (owner) |
| PATCH | `/workspaces/me/members/:id/role` | Change a member's role (owner) |
| GET | `/workspaces/me/invites` | List the current user's pending invites |
| PATCH | `/workspaces/me/invites/:id/accept` | Accept an invite |
| PATCH | `/workspaces/me/invites/:id/decline` | Decline an invite |

**Clients**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/clients` | Create a client |
| GET | `/clients` | List clients (`page`, `limit`, `status`, `search`) |
| GET | `/clients/:id` | Get a client + recent projects + stats |
| PUT | `/clients/:id` | Update a client |
| DELETE | `/clients/:id` | Soft-delete a client |
| PATCH | `/clients/:id/restore` | Restore a soft-deleted client |

**Projects**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/projects` | Create a project |
| GET | `/projects` | List projects (`page`, `limit`, `status`) |
| GET | `/projects/:id` | Get a project |
| PUT | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Soft-delete a project (cascades to its tasks) |
| PATCH | `/projects/:id/restore` | Restore a soft-deleted project |

**Tasks**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create a task |
| GET | `/tasks` | List tasks (`page`, `limit`, `priority`, `project`) |
| GET | `/tasks/:id` | Get a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Soft-delete a task |
| PATCH | `/tasks/:id/restore` | Restore a soft-deleted task |

**Comments**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks/:taskId/comments` | Add a comment to a task |
| GET | `/tasks/:taskId/comments` | List a task's comments |
| DELETE | `/comments/:id` | Soft-delete a comment |
| PATCH | `/comments/:id/restore` | Restore a soft-deleted comment |

**Dashboard**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Summary stats, 7-day trends, at-risk projects, recent activity — scoped to the current workspace |

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas)) — a second database is recommended for running the test suite

### 1. Clone and install

```bash
git clone <your-repo-url>
cd plinth

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Create `server/.env` (see [Environment Variables](#environment-variables)).

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the apps

```bash
# terminal 1 — API
cd server
npm run dev        # runs on PORT from .env (defaults to 5000)

# terminal 2 — frontend
cd client
npm run dev         # Vite dev server, defaults to http://localhost:5173
```

### 4. Run the tests

```bash
cd server
npm test            # Jest + Supertest, against MONGO_URI
```

### 5. Build for production

```bash
cd server && npm run build && npm start
cd client && npm run build   # outputs client/dist, ready for static hosting
```

## Environment Variables

**`server/.env`**

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign session JWTs |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `1h`) |
| `CLIENT_URL` | Frontend origin, used for CORS |
| `NODE_ENV` | `development`, `production`, or `test` — controls cookie `secure`/`sameSite` behavior and is set automatically by `npm test` |

**`client/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API (e.g. `http://localhost:5000/api`) |

## Project Structure

```text
plinth/
├── client/
│   ├── src/
│   │   ├── api/            axios wrappers per domain (auth, client, project, task, comment, workspace, dashboard)
│   │   ├── pages/            auth, dashboard, clients, projects, tasks, workspaces
│   │   ├── layouts/            AuthLayout, DashboardLayout
│   │   ├── routes/               router + ProtectedRoute
│   │   ├── store/                  zustand: auth, workspace
│   │   ├── providers/               SessionProvider
│   │   └── types/                    shared frontend types
│   └── vercel.json                     SPA rewrite config for static hosting
└── server/
    └── src/
        ├── modules/          auth, user, client, project, task, comment, workspace, dashboard
        ├── middleware/         auth, attachWorkspace, authorize, validate, error handling, security, rate limiting
        ├── utils/                ApiError, JWT helper, ObjectId schema, pagination
        ├── types/                  shared backend types
        ├── tests/                    Jest + Supertest suite, grouped by domain
        └── config/                     env loader
```

## Design Decisions

- **Workspace-scoped tenancy over single-owner tenancy** — every record belongs to a workspace, not a user, so the same client/project/task model supports both solo use and multi-person teams without a schema change.
- **Current workspace resolved server-side, not client-supplied** — `User.currentWorkspace` is set on switch and read by `attachWorkspace` on every request, rather than trusting a workspace ID sent by the client on each call. Switching workspaces validates active membership before updating it.
- **Role checks as middleware, not scattered `if` statements** — `authorize(...roles)` is composed into the route definition, so the permission required for an action is visible at the route declaration rather than buried in a service function.
- **Zod over hand-written validators** — schema-first validation lives in `*.validation.ts` files, colocated with the module it validates, and composes with TypeScript via `z.infer`.
- **Soft delete over hard delete** — prioritizes recoverability and auditability; appropriate for business records a user might delete by mistake.
- **`.strict()` schemas over manual field whitelisting** — closes off mass-assignment at the validation layer, before a payload reaches a service function.
- **Correct HTTP semantics** — `DELETE` for removal, `PATCH` for restore/role-change/switch actions, rather than overloading `PUT`.
- **Aggregation-heavy dashboard** — sub-sections run concurrently via `Promise.all`, and "at-risk projects" is computed server-side with a MongoDB aggregation pipeline instead of pulling raw documents into the app layer.
- **Integration tests over unit tests for tenancy and cascade behavior** — these are tested by hitting the API with Supertest against a real database rather than mocking the DB layer.

## Roadmap

- [x] Zod-based request validation layer
- [x] Jest + Supertest integration test suite
- [x] Migrate from single-owner to workspace-based multi-user tenancy
- [x] Member invites, roles, and workspace switching
- [x] Comments on tasks
- [ ] Dedicated cross-workspace isolation tests (current suite covers per-user isolation; a workspace-vs-workspace case with multiple members is not yet explicit)
- [ ] Docker for both apps
- [ ] CI/CD pipeline (run the Jest suite on every PR) + deployment
- [ ] Redis caching for the dashboard endpoint
- [ ] Migrate from Mongoose to Prisma

## License

This project is available for portfolio and educational reference. Add a license of your choice (e.g. MIT) if you plan to open-source it.
