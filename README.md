# WorkPilot

**A multi-tenant SaaS platform for freelancers and small agencies to manage clients, projects, and tasks — with a real-time dashboard, Kanban task board, and strict tenant data isolation.**

Full-stack: **React 19 + TypeScript** frontend, **Node.js/Express 5 + MongoDB** backend, both written in strict TypeScript.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Multi-Tenancy & Security Model](#multi-tenancy--security-model)
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

WorkPilot is a portfolio project built to demonstrate production-oriented, full-stack SaaS architecture rather than a simple CRUD demo. It models a real business domain — a freelancer or small agency managing multiple clients, each with projects, each with tasks — and treats that domain with the rigor a real SaaS product would need:

- **Tenant isolation** enforced at the database query level, not just in the UI.
- **Lifecycle-aware data** (soft delete + restore) instead of destructive deletes.
- **A genuinely useful dashboard** built on parallelized MongoDB aggregations (summary stats, 7-day trends, at-risk projects, recent activity) rather than a single static count.
- **A typed contract** between frontend and backend, with no `any` in business logic.

## Tech Stack

**Frontend**
- React 19 + TypeScript, built with Vite
- React Router 7 for routing, with protected-route guards
- Zustand for lightweight global auth state
- Axios (with `withCredentials`) for API communication + a global 401 interceptor
- Tailwind CSS 4 for styling
- Recharts for dashboard trend visualization
- Sonner for toast notifications

**Backend**
- Node.js + Express 5, TypeScript
- MongoDB + Mongoose 9 (ODM)
- JWT authentication delivered via `httpOnly` cookies
- bcrypt for password hashing
- Helmet for secure HTTP headers
- express-rate-limit for global rate limiting

**Deployment target:** the client ships a `vercel.json` SPA rewrite config for static hosting (e.g. Vercel); the API is a standard Node/Express service deployable to any Node host.

## Architecture

WorkPilot is a monorepo with two independently deployable apps:

```text
workpilot/
├── client/     React SPA (Vite)
└── server/     Express REST API
```

### Backend — layered, modular-by-domain

```text
server/src/
├── modules/
│   ├── auth/        # register, login, logout, session
│   ├── user/         # user model
│   ├── client/        # client CRUD + relationship stats
│   ├── project/       # project CRUD + soft delete/restore
│   ├── task/          # task CRUD + soft delete/restore
│   └── dashboard/      # aggregated analytics
├── middleware/         # auth, error handling, security, rate limiting
├── utils/               # ApiError, JWT signing, pagination helper
├── types/                # shared request/response types
└── config/                # environment loading
```

Each domain module follows the same layering, and business logic never lives in a controller:

| Layer | Responsibility |
|---|---|
| **routes** | Define endpoints and wire up middleware |
| **controller** | Handle HTTP request/response shape only |
| **service** | All business logic and database queries |
| **model** | Mongoose schema + TypeScript interface |
| **validation** | Request-shape guards, throw `ApiError` early |

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

The **Tasks** page is implemented as a three-column Kanban board (`Todo` / `In Progress` / `Done`) driven entirely by each task's `status` field, with modals for create/edit/delete and a drawer for task detail.

## Core Features

- **Auth** — register/login with hashed passwords, JWT issued as an `httpOnly` cookie (not exposed to JS), `/auth/me` session check, logout clears the cookie.
- **Clients** — CRUD, search by name, filter by status, and a client detail view that returns the client's recent projects plus rolled-up stats (total/active projects, total/overdue tasks) via parallel queries.
- **Projects** — CRUD, filter by status, soft delete with an explicit restore endpoint; deleting a project cascades to its tasks.
- **Tasks** — CRUD, filter by priority or by project, Kanban board UI, soft delete with restore.
- **Dashboard** — a single `GET /api/dashboard` call returns, all computed in parallel:
  - summary counters (total/active projects, total/overdue tasks, tasks due today, weekly completion rate)
  - 7-day created vs. completed task trend (for the Recharts line/bar view)
  - **at-risk projects** — active projects ranked by overdue task count, via an aggregation pipeline with `$group` + `$lookup`
  - recent activity — last 5 completed and last 5 created tasks, each with populated project name
- **Pagination & filtering** — all list endpoints accept `page`/`limit`/`status`/`search`-style query params, backed by a shared `getPagination` utility.

## Multi-Tenancy & Security Model

WorkPilot uses **row-level tenant isolation**: every `Client`, `Project`, and `Task` document carries an `owner` field (the authenticated user's `_id`), and it is duplicated on child documents (e.g. a `Task` stores its own `owner`, not just its parent `Project`'s) as defense-in-depth. Every query — reads, writes, and deletes — is scoped with `{ owner: req.user._id }` inside the service layer, so a user can never read or mutate another tenant's data, even if they guess a valid document ID.

Other security measures:

- **JWT in an `httpOnly` cookie** (not `localStorage`) to reduce XSS token theft risk, with `secure`/`sameSite` flags adjusted for dev vs. production.
- **Helmet** for standard secure HTTP headers.
- **Global rate limiting** (100 requests / 15 minutes per IP) via `express-rate-limit`.
- **Explicit field whitelisting on updates** — update payloads are never spread directly into a Mongoose `findOneAndUpdate`; each allowed field is copied individually to prevent mass-assignment.
- **No client-controlled ownership** — `owner` is always derived from `req.user`, never accepted from the request body.
- **Soft deletes** (`isDeleted: boolean`) instead of hard deletes, so `DELETE` requests are reversible and list queries simply filter `isDeleted: false`. Restoring a project does not automatically restore its tasks — that's a deliberate choice to avoid silently resurrecting unrelated data.

## Data Models

| Model | Key fields |
|---|---|
| **User** | `name`, `email` (unique), `password` (hashed, `select: false`), `role` |
| **Client** | `name`, `email`, `phone`, `company`, `notes`, `status: active \| inactive`, `owner`, `isDeleted` |
| **Project** | `name`, `description`, `status: active \| completed \| paused`, `deadline`, `budget`, `client` (ref), `owner`, `isDeleted` |
| **Task** | `title`, `description`, `status: todo \| in-progress \| done`, `priority: low \| medium \| high`, `dueDate`, `project` (ref), `owner`, `isDeleted` |

All four collections index `owner` (and `isDeleted`, plus their relevant foreign keys) to keep tenant-scoped list queries fast as data grows.

## API Reference

Base URL: `/api`. All routes below except `auth/register` and `auth/login` require a valid session cookie (`protect` middleware).

**Auth**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new user |
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
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone and install

```bash
git clone <your-repo-url>
cd workpilot

# install backend deps
cd server && npm install

# install frontend deps
cd ../client && npm install
```

### 2. Configure environment variables

Create `server/.env` (see [Environment Variables](#environment-variables) below).

Create `client/.env` with:
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

### 4. Build for production

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
| `NODE_ENV` | `development` or `production` — controls cookie `secure`/`sameSite` behavior |

**`client/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API (e.g. `http://localhost:5000/api`) |

## Project Structure

```text
workpilot/
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
        ├── middleware/         auth, error handling, security, rate limiting
        ├── utils/                ApiError, JWT helper, pagination
        ├── types/                  shared backend types
        └── config/                   env loader
```

## Design Decisions

- **Soft delete over hard delete** — prioritizes recoverability and auditability over storage savings; appropriate for business records a user might delete by mistake.
- **Owner duplicated on child entities** — a `Task` stores `owner` directly rather than requiring a join through `Project` to check tenant ownership, trading a small amount of denormalization for simpler, faster, and more defensible authorization checks.
- **Explicit field whitelisting on updates** — chosen over spreading `req.body` into Mongoose updates, to close off mass-assignment as an attack vector.
- **Correct HTTP semantics** — `DELETE` for removal, `PATCH` for the restore action, rather than overloading `PUT`.
- **Aggregation-heavy dashboard** — rather than computing dashboard metrics client-side or with sequential queries, all dashboard sub-sections run concurrently via `Promise.all`, and the "at-risk projects" view is computed server-side with a MongoDB aggregation pipeline (`$match` → `$group` → `$lookup`) instead of pulling raw documents into the app layer.

## Roadmap

- [ ] Zod-based request validation layer (replacing hand-written validators)
- [ ] Redis caching for the dashboard endpoint
- [ ] Jest test suite (unit + integration)
- [ ] Migrate from Mongoose to Prisma
- [ ] Workspace/team-based multi-user tenancy (beyond single-owner tenants)
- [ ] Dockerize both apps
- [ ] CI/CD pipeline + deployment to AWS

## License

This project is available for portfolio and educational reference. Add a license of your choice (e.g. MIT) if you plan to open-source it.
