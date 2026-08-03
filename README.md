# Plinth

A multi-tenant SaaS platform for managing clients, projects, and tasks, with a metrics dashboard.

React 19 · TypeScript · Node.js/Express 5 · MongoDB · Zod · Jest

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Multi-Tenancy & Security Model](#multi-tenancy--security-model)
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

Plinth is a full-stack portfolio project modeling a multi-tenant SaaS product: an agency managing multiple clients, each with projects, each with tasks. Key aspects of the implementation:

- **Tenant isolation** enforced at the database query level, covered by integration tests.
- **Schema-validated input** on every endpoint via Zod.
- **Lifecycle-aware data** — soft delete and restore, with cascade rules between projects and tasks.
- **A dashboard** built on parallelized MongoDB aggregations (summary stats, trends, at-risk projects, recent activity).
- **A typed contract** between frontend and backend.

## Tech Stack

**Frontend**
- React 19 + TypeScript, built with Vite
- React Router 7 for routing, with protected-route guards
- Zustand for lightweight global auth state
- Axios (`withCredentials`) for API communication + a global 401 interceptor
- Tailwind CSS 4 for styling
- Recharts for dashboard trend visualization
- Sonner for toast notifications
- lucide-react for icons

**Backend**
- Node.js + Express 5, TypeScript
- MongoDB + Mongoose 9 (ODM)
- **Zod** — request schema validation on every route (body/params/query)
- JWT authentication delivered via `httpOnly` cookies
- bcrypt for password hashing
- Helmet for secure HTTP headers
- express-rate-limit for global rate limiting

**Testing**
- Jest + ts-jest + Supertest, run against a real MongoDB instance
- Integration-level tests targeting tenant isolation and soft-delete lifecycle specifically (see [Testing](#testing))

**Deployment target:** the client ships a `vercel.json` SPA rewrite config for static hosting (e.g. Vercel); the API is a standard Node/Express service deployable to any Node host.

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
│   ├── user/           # user model
│   ├── client/          # client CRUD + relationship stats
│   ├── project/          # project CRUD + soft delete/restore
│   ├── task/               # task CRUD + soft delete/restore
│   └── dashboard/            # aggregated analytics
├── middleware/                # auth, validation, error handling, security, rate limiting
├── utils/                       # ApiError, JWT signing, ObjectId schema, pagination
├── types/                         # shared request/response types
├── tests/                           # Jest + Supertest integration suite
└── config/                            # environment loading
```

Every domain module follows the same five-layer pattern, and business logic never lives in a controller:

| Layer | Responsibility |
|---|---|
| **routes** | Wire up `protect` (auth) → `validate` (Zod schema) → controller |
| **controller** | Handle HTTP request/response shape only |
| **service** | All business logic and database queries, always tenant-scoped |
| **model** | Mongoose schema + TypeScript interface |
| **validation** | Zod schemas for `body`/`params`/`query`, enforced before the controller ever runs |

### Frontend — feature-folder React app

```text
client/src/
├── api/            # one file per domain, thin axios wrappers
├── pages/           # feature folders: auth, dashboard, clients, projects, tasks
├── layouts/           # AuthLayout, DashboardLayout
├── routes/             # router config + ProtectedRoute guard
├── store/               # zustand auth store
├── providers/            # SessionProvider (hydrates auth state on load)
└── types/                 # types mirrored from the API contract
```

The **Tasks** page is a three-column Kanban board (`Todo` / `In Progress` / `Done`) driven by each task's `status` field, with modals for create/edit/delete and a drawer for task detail.

## Core Features

- **Auth** — register/login with hashed passwords, JWT issued as an `httpOnly` cookie (never exposed to JS), `/auth/me` session check, logout clears the cookie. Registration enforces a strong-password policy (12+ characters, mixed case, digit) at the schema level.
- **Clients** — CRUD, search by name, filter by status, and a client detail view that returns the client's recent projects plus rolled-up stats (total/active projects, total/overdue tasks) via parallel queries.
- **Projects** — CRUD, filter by status, soft delete with an explicit restore endpoint; deleting a project **cascades** to its tasks (verified by an integration test).
- **Tasks** — CRUD, filter by priority or by project, Kanban board UI, soft delete with restore — independent of its parent project's lifecycle.
- **Dashboard** — a single `GET /api/dashboard` call returns, all computed in parallel:
  - summary counters (total/active projects, total/overdue tasks, tasks due today, weekly completion rate)
  - 7-day created vs. completed task trend (for the Recharts view)
  - **at-risk projects** — active projects ranked by overdue task count, via an aggregation pipeline (`$match` → `$group` → `$lookup`)
  - recent activity — last 5 completed and last 5 created tasks, each with populated project name
- **Pagination & filtering** — all list endpoints accept `page`/`limit`/`status`/`search`-style query params, backed by a shared `getPagination` utility and validated with Zod (`page`/`limit` coerced and bounded server-side).

## Multi-Tenancy & Security Model

Plinth uses **row-level tenant isolation**: every `Client`, `Project`, and `Task` document carries an `owner` field (the authenticated user's `_id`), duplicated on child documents as defense-in-depth — a `Task` stores its own `owner` rather than relying on a join through `Project`. Every query is scoped with `{ owner: req.user._id }` inside the service layer, so a user cannot read or mutate another tenant's data, even with a valid document ID for someone else's record. This is covered by integration tests — see [Testing](#testing).

Other security measures:

- **JWT in an `httpOnly` cookie** (not `localStorage`), with `secure`/`sameSite` flags adjusted for dev vs. production.
- **Zod validation on every endpoint** — malformed or unexpected fields are rejected with a 400 before they ever reach a controller (see [Validation Layer](#validation-layer)).
- **Helmet** for standard secure HTTP headers.
- **Global rate limiting** (100 requests / 15 minutes per IP).
- **Explicit field whitelisting on updates** — Zod's `.strict().partial()` schemas define exactly which fields an update accepts; nothing is ever spread from `req.body` directly into a Mongoose update.
- **No client-controlled ownership** — `owner` is always derived from `req.user`, never accepted from the request body (impossible to override — it isn't even part of the request schema).
- **Soft deletes** (`isDeleted: boolean`) instead of hard deletes, so `DELETE` requests are reversible.

## Validation Layer

Every route in every module — `auth`, `client`, `project`, `task` — is wrapped in a `validate(schema)` middleware that runs a Zod schema against `{ body, params, query }` before the controller executes:

```ts
router.post("/", protect, validate(createProjectSchema), createProject);
router.patch("/:id/restore", protect, validate(restoreProjectSchema), restoreProject);
```

Highlights of the schema design:

- **`.strict()` objects** reject unknown fields outright, closing off mass-assignment at the schema level rather than relying on manual field-copying in the service.
- **Shared `objectIdSchema`** validates Mongo ObjectIds by regex before they ever hit a query, turning malformed-ID bugs into clean 400s instead of Mongoose cast errors.
- **Coerced, bounded query params** — e.g. `page`/`limit` on list endpoints are coerced to numbers and clamped (`limit` max 100) directly in the schema.
- **Password policy enforced declaratively** — length and character-class rules for registration live in the Zod schema, not scattered `if` checks in the controller.
- **Update schemas are `createSchema.partial().strict()`** — guaranteeing an update can only ever touch fields the create schema already allows.

## Testing

The backend has a Jest + Supertest integration suite that runs against a real MongoDB instance, focused on tenant isolation and soft-delete behavior:

| Test file | What it proves |
|---|---|
| `auth.test.ts` | Registration and login work end-to-end, including cookie issuance |
| `client.isolation.test.ts` | A user cannot fetch another user's client by ID |
| `project.isolation.test.ts` | A user cannot fetch another user's project by ID |
| `task.tenancy.test.ts` | A user cannot fetch another user's task by ID |
| `client.softdelete.test.ts` | A soft-deleted client can be correctly restored |
| `project.softdelete.test.ts` | Deleting a project **cascades** to soft-delete its tasks |
| `task.softdelete.test.ts` | A task can be soft-deleted and restored independently of its project |

Each collection is wiped between tests (`afterEach`) to keep the suite deterministic, and the connection is torn down cleanly in `afterAll`.

```bash
cd server
npm test
```

## Data Models

| Model | Key fields |
|---|---|
| **User** | `name`, `email` (unique), `password` (hashed, `select: false`), `role` |
| **Client** | `name`, `email`, `phone`, `company`, `notes`, `status: active \| inactive`, `owner`, `isDeleted` |
| **Project** | `name`, `description`, `status: active \| completed \| paused`, `deadline`, `budget`, `client` (ref), `owner`, `isDeleted` |
| **Task** | `title`, `description`, `status: todo \| in-progress \| done`, `priority: low \| medium \| high`, `dueDate`, `project` (ref), `owner`, `isDeleted` |

All four collections index `owner` (and `isDeleted`, plus their relevant foreign keys) to keep tenant-scoped list queries fast as data grows.

## API Reference

Base URL: `/api`. All routes except `auth/register` and `auth/login` require a valid session cookie (`protect` middleware), and every route validates its input with a Zod schema before reaching the controller.

**Auth**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new user (enforces password policy) |
| POST | `/auth/login` | Authenticate, sets session cookie |
| POST | `/auth/logout` | Clear session cookie |
| GET | `/auth/me` | Get the current authenticated user |

**Clients**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/clients` | Create a client |
| GET | `/clients` | List clients (`page`, `limit`, `status`, `search`) |
| GET | `/clients/:id` | Get a client + recent projects + stats |
| PUT | `/clients/:id` | Update a client |
| DELETE | `/clients/:id` | Soft-delete a client |

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

**Dashboard**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Summary stats, 7-day trends, at-risk projects, recent activity |

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas)) — a second instance/database is recommended for running the test suite

### 1. Clone and install

```bash
git clone <your-repo-url>
cd plinth

# install backend deps
cd server && npm install

# install frontend deps
cd ../client && npm install
```

### 2. Configure environment variables

Create `server/.env` (see [Environment Variables](#environment-variables) below).

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
│   │   ├── api/            axios wrappers per domain
│   │   ├── pages/            auth, dashboard, clients, projects, tasks
│   │   ├── layouts/            AuthLayout, DashboardLayout
│   │   ├── routes/               router + ProtectedRoute
│   │   ├── store/                  zustand auth store
│   │   ├── providers/               SessionProvider
│   │   └── types/                    shared frontend types
│   └── vercel.json                     SPA rewrite config for static hosting
└── server/
    └── src/
        ├── modules/          auth, user, client, project, task, dashboard
        ├── middleware/         auth, validate, error handling, security, rate limiting
        ├── utils/                ApiError, JWT helper, ObjectId schema, pagination
        ├── types/                  shared backend types
        ├── tests/                    Jest + Supertest integration suite
        └── config/                     env loader
```

## Design Decisions

- **Zod over hand-written validators** — schema-first validation lives entirely in `*.validation.ts` files, colocated with the module it validates, and composes naturally with TypeScript via `z.infer`.
- **Soft delete over hard delete** — prioritizes recoverability and auditability over storage savings; appropriate for business records a user might delete by mistake.
- **Owner duplicated on child entities** — a `Task` stores `owner` directly rather than requiring a join through `Project` to check tenant ownership, trading a small amount of denormalization for simpler, faster, and more defensible authorization checks.
- **`.strict()` schemas over manual field whitelisting** — closes off mass-assignment as an attack vector at the validation layer, before a payload ever reaches a service function.
- **Correct HTTP semantics** — `DELETE` for removal, `PATCH` for the restore action, rather than overloading `PUT`.
- **Aggregation-heavy dashboard** — dashboard sub-sections run concurrently via `Promise.all`, and "at-risk projects" is computed server-side with a MongoDB aggregation pipeline instead of pulling raw documents into the app layer.
- **Integration tests over unit tests for tenant isolation and cascade behavior** — these are tested by hitting the API with Supertest against a real database rather than mocking the DB layer.

## Roadmap

- [x] Zod-based request validation layer
- [x] Jest + Supertest integration test suite (tenant isolation, soft-delete lifecycle)
- [ ] Redis caching for the dashboard endpoint
- [ ] Migrate from Mongoose to Prisma
- [ ] Workspace/team-based multi-user tenancy (beyond single-owner tenants)
- [ ] Dockerize both apps
- [ ] CI/CD pipeline (run the Jest suite on every PR) + deployment to AWS

## License

This project is available for portfolio and educational reference. Add a license of your choice (e.g. MIT) if you plan to open-source it.
