# Plinth

A multi-tenant SaaS platform for managing clients, projects, and tasks across team workspaces, with role based access control and a metrics dashboard.

React 19, TypeScript, Node.js/Express 5, MongoDB, Redis, Zod, Jest, Docker

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Workspaces and Access Control](#workspaces-and-access-control)
- [Validation Layer](#validation-layer)
- [Caching](#caching)
- [Testing](#testing)
- [Data Models](#data-models)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [CI/CD](#cicd)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Plinth is a full stack portfolio project modeling a multi-tenant SaaS product. A workspace with team members manages Clients, Projects, and Tasks, with comments and a metrics dashboard. It started as a single-owner CRUD app and was later migrated to workspace based multi-user tenancy. Every record is scoped to a workspace instead of a single user, and access within a workspace is governed by role.

- Workspace scoped tenant isolation, enforced at the database query level and covered by integration tests.
- Role based access control (owner, admin, member, viewer) on every mutating endpoint.
- Schema validated input on every route via Zod.
- Lifecycle aware data. Soft delete and restore, with cascade rules between projects and tasks.
- A dashboard built on parallelized MongoDB aggregations and cached in Redis.
- A typed contract between frontend and backend, with dedicated request and response types on both sides.
- A Dockerized dev and prod setup with a CI pipeline that runs the test suite and builds both apps.

## Tech Stack

**Frontend**
- React 19 with TypeScript, built with Vite
- React Router 7, with protected route guards
- Zustand for auth and workspace state
- Axios with `withCredentials` and a global 401 interceptor
- Tailwind CSS 4 with a token based light and dark theme
- `@hello-pangea/dnd` for the drag and drop task board
- Recharts for dashboard trend visualization
- Sonner for toast notifications, lucide-react for icons

**Backend**
- Node.js with Express 5, TypeScript
- MongoDB with Mongoose 9
- Redis for dashboard response caching
- Zod for request validation on every route
- JWT authentication delivered via an httpOnly cookie
- bcrypt for password hashing
- Helmet for secure HTTP headers
- express-rate-limit for global rate limiting

**Testing**
- Jest with ts-jest and Supertest, run against a real MongoDB instance
- Integration tests organized by domain, covering tenant isolation and soft delete lifecycle

**Infrastructure**
- Dockerfiles for both `client` and `server`
- `docker-compose.yml` for a full stack run (MongoDB, Redis, backend, frontend)
- GitHub Actions workflow that installs dependencies, builds, and runs the backend test suite on every push and pull request

## Architecture

Plinth is a monorepo with two independently deployable apps.

```text
plinth/
├── client/     React SPA (Vite)
└── server/     Express REST API
```

### Backend, layered and modular by domain

```text
server/src/
├── modules/
│   ├── auth/         register, login, logout, session
│   ├── user/          user model and service
│   ├── client/          client CRUD, workspace scoped
│   ├── project/          project CRUD with soft delete and restore
│   ├── task/               task CRUD with soft delete, restore, and assignee
│   ├── comment/              task comments with soft delete and restore
│   ├── workspace/              workspaces, membership, invites, roles
│   └── dashboard/                aggregated analytics, cached in Redis
├── middleware/                     auth, workspace attach, authorize, validate, security, rate limiting
├── utils/                            ApiError, JWT signing, ObjectId schema, pagination, redis client, cache helpers
├── types/                              shared request and response types
├── tests/                                Jest and Supertest suite, grouped by domain
└── config/                                 environment loading
```

Every domain module follows the same layering, and business logic never lives in a controller.

| Layer | Responsibility |
|---|---|
| routes | Wire up `protect`, then `attachWorkspace`, then `validate`, then `authorize` where relevant, then the controller |
| controller | Handle the HTTP request and response shape only |
| service | All business logic and database queries, always workspace scoped |
| model | Mongoose schema and TypeScript interface |
| validation | Zod schemas for body, params, and query, enforced before the controller runs |

### Frontend, feature folder React app

```text
client/src/
├── api/            one file per domain, thin axios wrappers
├── pages/           auth, dashboard, clients, projects, tasks, workspaces
│   └── <feature>/     components, modals, hooks
├── layouts/           AuthLayout, DashboardLayout
├── routes/             router config and ProtectedRoute guard
├── store/               zustand: auth, workspace
├── providers/            SessionProvider, hydrates auth and workspace state on load
└── types/                 types mirrored from the API contract
```

The Tasks page is a drag and drop Kanban board built with `@hello-pangea/dnd`, with a task drawer that includes assignee selection and a comment thread.

## Core Features

- **Auth.** Register and login with a password policy enforced at the schema level (12 or more characters, upper and lower case, a digit), a confirm password check on registration, a JWT issued as an httpOnly cookie, a `/auth/me` session check, and logout that clears the cookie.
- **Workspaces.** Every user gets a default workspace on registration. Users can create additional workspaces, switch between them, rename a workspace, and leave one.
- **Members and invites.** Invite a user by email into a workspace with a role, accept or decline an invite, list current members, change a member's role, remove a member.
- **Clients.** CRUD, search by name, filter by status, and a client detail view returning recent projects plus rolled up stats.
- **Projects.** CRUD, filter by status, soft delete with restore. Deleting a project cascades to soft delete its tasks.
- **Tasks.** CRUD, drag and drop Kanban board, assignee, soft delete with restore, independent of the parent project's lifecycle.
- **Comments.** Threaded comments on a task, with soft delete and restore.
- **Dashboard.** A single `GET /api/dashboard` call returns, computed in parallel and scoped to the current workspace, summary counters, a seven day created versus completed task trend, at risk projects ranked by overdue task count via an aggregation pipeline, and recent activity. Results are cached in Redis per workspace.
- **Pagination and filtering.** List endpoints accept `page`, `limit`, `status`, and `search` style query params, validated and bounded server side.

## Workspaces and Access Control

A user's identity (`req.user`, from the JWT cookie) is separate from their current workspace context (`req.workspace` and `req.membership`), resolved by the `attachWorkspace` middleware from `User.currentWorkspace`.

- **Switching workspaces**, `PATCH /workspaces/me/switch`, looks up an active `WorkspaceMember` for the requested workspace and the current user. If none exists, the switch is rejected. On success it updates `User.currentWorkspace`, so every request after that is scoped to the new workspace without extra client side state.
- **Roles** are `owner`, `admin`, `member`, and `viewer`. Enforced per route with an `authorize(...roles)` middleware. Deleting a project requires `owner`. Inviting a member requires `owner` or `admin`. Reading data requires only an active membership.
- **Data isolation.** `Client`, `Project`, `Task`, and `Comment` all carry a `workspace` field, and every service level query is scoped by `workspace: req.workspace._id`. A user cannot read or mutate a record in a workspace they do not belong to, regardless of the document ID.

## Validation Layer

Every route across every module runs through a `validate(schema)` middleware, which runs a Zod schema against `{ body, params, query }` before the controller executes.

```ts
router.post("/", protect, validate(createProjectSchema), createProject);
router.delete("/me/members/:id", validate(removeMemberSchema), authorize("owner"), removeMember);
```

- Object schemas use `.strict()`, which rejects unknown fields and closes off mass assignment at the schema level.
- A shared `objectIdSchema` validates Mongo ObjectIds by regex before they reach a query.
- Query params like `page` and `limit` are coerced to numbers and clamped server side.
- Update schemas are `createSchema.partial().strict()`, so an update can only touch fields the create schema already allows.
- Cross field validation is used where needed, for example the registration schema checks `password === confirmPassword`.

## Caching

The dashboard endpoint is the only cached route, since it is the most expensive to compute (four aggregation queries run in parallel per request) and the least sensitive to being a few minutes stale.

- `getDashboardService` checks Redis for `dashboard:<workspaceId>` before running the aggregations. On a hit, it returns the cached JSON directly.
- On a miss, it runs the aggregations, stores the result in Redis with a TTL (`REDIS_TTL`, 300 seconds by default), and returns the fresh data.
- Cache invalidation is explicit rather than TTL only. Creating, updating, deleting, or restoring a Client, Project, or Task calls `invalidateClientCache`, `invalidateProjectCache`, or `invalidateTaskCache`, which all clear the same `dashboard:<workspaceId>` key. This keeps the dashboard consistent with recent changes instead of only expiring after the TTL window.
- Redis failures do not break the request. Cache reads and writes are wrapped in try/catch, so if Redis is unreachable the service falls back to computing the dashboard directly.

## Testing

The backend has a Jest and Supertest integration suite that runs against a real MongoDB instance, organized by domain under `server/src/tests/`.

| Area | Coverage |
|---|---|
| auth | Registration, including password confirmation, and login |
| client | Tenant isolation, soft delete and restore |
| project | Tenant isolation, soft delete and restore |
| task | Tenant isolation, soft delete and restore |
| comment | Tenant isolation, soft delete and restore |
| workspace | Registration flow, including default workspace creation |

Shared setup lives in `tests/utils/`, with per domain helpers for creating an authenticated user, client, project, and task. Each collection is cleared between tests to keep the suite deterministic.

```bash
cd server
npm test
```

## Data Models

| Model | Key fields |
|---|---|
| User | `name`, `email` (unique), `password` (hashed, `select: false`), `role`, `currentWorkspace` |
| Workspace | `name`, `createdBy` |
| WorkspaceMember | `workspace` (ref), `user` (ref), `role: owner, admin, member, viewer`, `status: pending, active` |
| Client | `name`, `email`, `phone`, `company`, `notes`, `status: active, inactive`, `workspace`, `isDeleted` |
| Project | `name`, `description`, `status: active, completed, paused`, `deadline`, `budget`, `client` (ref), `workspace`, `isDeleted` |
| Task | `title`, `description`, `status: todo, in-progress, done`, `priority: low, medium, high`, `dueDate`, `assignee`, `project` (ref), `workspace`, `isDeleted` |
| Comment | `content`, `task` (ref), `author` (ref), `workspace`, `isDeleted` |

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
| GET | `/workspaces/me` | Get the current workspace and role |
| PATCH | `/workspaces/me` | Rename the current workspace, owner or admin |
| POST | `/workspaces/me/leave` | Leave the current workspace |
| GET | `/workspaces/me/members` | List members of the current workspace |
| POST | `/workspaces/me/members` | Invite a member by email, owner or admin |
| DELETE | `/workspaces/me/members/:id` | Remove a member, owner only |
| PATCH | `/workspaces/me/members/:id/role` | Change a member's role, owner only |
| GET | `/workspaces/me/invites` | List the current user's pending invites |
| PATCH | `/workspaces/me/invites/:id/accept` | Accept an invite |
| PATCH | `/workspaces/me/invites/:id/decline` | Decline an invite |

**Clients**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/clients` | Create a client |
| GET | `/clients` | List clients (`page`, `limit`, `status`, `search`) |
| GET | `/clients/:id` | Get a client, its recent projects, and stats |
| PUT | `/clients/:id` | Update a client |
| DELETE | `/clients/:id` | Soft delete a client |
| PATCH | `/clients/:id/restore` | Restore a soft deleted client |

**Projects**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/projects` | Create a project |
| GET | `/projects` | List projects (`page`, `limit`, `status`) |
| GET | `/projects/:id` | Get a project |
| PUT | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Soft delete a project, cascades to its tasks |
| PATCH | `/projects/:id/restore` | Restore a soft deleted project |

**Tasks**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create a task |
| GET | `/tasks` | List tasks (`page`, `limit`, `priority`, `project`) |
| GET | `/tasks/:id` | Get a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Soft delete a task |
| PATCH | `/tasks/:id/restore` | Restore a soft deleted task |

**Comments**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks/:taskId/comments` | Add a comment to a task |
| GET | `/tasks/:taskId/comments` | List a task's comments |
| DELETE | `/comments/:id` | Soft delete a comment |
| PATCH | `/comments/:id/restore` | Restore a soft deleted comment |

**Dashboard**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Summary stats, seven day trends, at risk projects, and recent activity, scoped to the current workspace and cached in Redis |

## Getting Started

You can run Plinth either directly with Node, or with Docker Compose. Docker is the faster path since it starts MongoDB and Redis for you. See [Running with Docker](#running-with-docker) below.

### Prerequisites, for running without Docker
- Node.js 18 or later
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Redis instance (local, or via Docker: `docker run -p 6379:6379 redis:7-alpine`)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd plinth

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Copy the example files and fill in your own values.

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

See [Environment Variables](#environment-variables) for what each one does.

### 3. Run the apps

```bash
# terminal 1, the API
cd server
npm run dev        # runs on PORT from .env, defaults to 5000

# terminal 2, the frontend
cd client
npm run dev         # Vite dev server, defaults to http://localhost:5173
```

### 4. Run the tests

```bash
cd server
npm test            # Jest and Supertest, against MONGO_URI
```

### 5. Build for production

```bash
cd server && npm run build && npm start
cd client && npm run build   # outputs client/dist, ready for static hosting
```

## Running with Docker

`docker-compose.yml` runs the full stack: MongoDB, Redis, the backend API, and the frontend, each in its own container on a shared network.

```bash
docker compose up --build
```

This starts:
- `mongodb`, MongoDB 7, with a health check
- `redis`, Redis 7, with a health check
- `backend`, built from `server/Dockerfile`, waits for MongoDB and Redis to be healthy before starting
- `frontend`, built from `client/Dockerfile`

For local development with hot reload instead of built production images, use the dev compose file:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Each app also has its own `Dockerfile` and `.dockerignore`, so either service can be built and run on its own if you only need one of them.

## CI/CD

`.github/workflows/ci-cd.yml` runs on every push to `main` or `develop`, and on every pull request into `main`. It has two jobs:

- **test-backend**: spins up a MongoDB service container, installs backend dependencies, builds the TypeScript, runs the Jest suite against the service container, and uploads the coverage output as a build artifact.
- **test-frontend**: installs frontend dependencies and runs the Vite build, then uploads `client/dist` as a build artifact.

Neither job deploys anywhere yet. This is a build and test gate, not a deployment pipeline. Wiring an actual deploy step (for example to Render, Fly.io, or a container registry) is on the roadmap below.

## Environment Variables

**`server/.env`**, see `server/.env.example`

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on, default `5000` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign session JWTs |
| `JWT_EXPIRES_IN` | JWT expiry, for example `7d` |
| `CLIENT_URL` | Frontend origin, used for CORS |
| `NODE_ENV` | `development`, `production`, or `test`. Controls cookie `secure` and `sameSite` behavior, and is set automatically by `npm test` |
| `REDIS_HOST` | Redis host, `redis` in Docker, `localhost` otherwise |
| `REDIS_PORT` | Redis port, default `6379` |
| `REDIS_PASSWORD` | Redis password, optional, blank for local development |
| `REDIS_TTL` | Dashboard cache TTL in seconds, default `300` |

**`client/.env`**, see `client/.env.example`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API, for example `http://localhost:5000` |

## Project Structure

```text
plinth/
├── .github/
│   └── workflows/         ci-cd.yml, test and build on push and pull request
├── client/
│   ├── src/
│   │   ├── api/            axios wrappers per domain
│   │   ├── pages/            auth, dashboard, clients, projects, tasks, workspaces
│   │   ├── layouts/            AuthLayout, DashboardLayout
│   │   ├── routes/               router and ProtectedRoute
│   │   ├── store/                  zustand: auth, workspace
│   │   ├── providers/               SessionProvider
│   │   └── types/                    shared frontend types
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── vercel.json                     SPA rewrite config for static hosting
├── server/
│   ├── src/
│   │   ├── modules/          auth, user, client, project, task, comment, workspace, dashboard
│   │   ├── middleware/         auth, attachWorkspace, authorize, validate, security, rate limiting
│   │   ├── utils/                ApiError, JWT helper, ObjectId schema, pagination, redis, cache
│   │   ├── types/                  shared backend types
│   │   ├── tests/                    Jest and Supertest suite, grouped by domain
│   │   └── config/                     env loader
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env.example
├── docker-compose.yml
└── docker-compose.dev.yml
```

## Design Decisions

- **Workspace scoped tenancy over single owner tenancy.** Every record belongs to a workspace, not a user, so the same client, project, and task model supports both solo use and multi person teams without a schema change.
- **Current workspace resolved server side, not client supplied.** `User.currentWorkspace` is set on switch and read by `attachWorkspace` on every request, rather than trusting a workspace ID sent by the client on each call. Switching workspaces validates active membership before updating it.
- **Role checks as middleware, not scattered if statements.** `authorize(...roles)` is composed into the route definition, so the permission required for an action is visible at the route declaration rather than buried in a service function.
- **Zod over hand written validators.** Schema first validation lives in `*.validation.ts` files, colocated with the module it validates, and composes with TypeScript through `z.infer`.
- **Soft delete over hard delete.** This prioritizes recoverability and auditability, appropriate for business records a user might delete by mistake.
- **`.strict()` schemas over manual field whitelisting.** This closes off mass assignment at the validation layer, before a payload reaches a service function.
- **Correct HTTP semantics.** `DELETE` for removal, `PATCH` for restore, role change, and switch actions, rather than overloading `PUT`.
- **Aggregation heavy dashboard, cached rather than recomputed on every request.** Sub sections run concurrently through `Promise.all`, at risk projects is computed with a MongoDB aggregation pipeline instead of pulling raw documents into the app layer, and the combined result is cached in Redis and invalidated explicitly on writes.
- **Integration tests over unit tests for tenancy and cascade behavior.** These are tested by hitting the API with Supertest against a real database rather than mocking the database layer.
- **CI as a quality gate before a deploy pipeline.** The current workflow proves the app builds and the tests pass on every change, which is a prerequisite for a deploy step, not a replacement for one.


## License

This project is available for portfolio and educational reference. Add a license of your choice, for example MIT, if you plan to open source it.
