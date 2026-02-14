# ToMoola

A marketplace to connect **Indian folk artists** with **event organizers**. Clients discover artists by art form, request bookings, and pay offline (price negotiated directly). Artists manage profiles, availability, and bookings; admins approve artists and moderate content.

## Tech stack

| Layer      | Stack                          |
|-----------|---------------------------------|
| Monorepo  | Turborepo + pnpm workspaces     |
| Frontend  | Next.js 15 (App Router), React 19 |
| Backend   | NestJS 11                       |
| Database  | PostgreSQL 16 + Prisma ORM      |
| Language  | TypeScript (strict)             |

## Prerequisites

- **Node.js** ≥ 22 ([nvm](https://github.com/nvm-sh/nvm): `nvm use`)
- **pnpm** ≥ 10.15.0 (`corepack enable && corepack prepare pnpm@latest --activate`)
- **PostgreSQL** 16 (e.g. via [Docker](https://docs.docker.com/get-docker/))

## How to run

### 1. Start the database

Using Docker (recommended):

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` and Redis on `6379`. Default DB: `tomoola`, user `postgres`, password `password`.

### 2. Environment variables

Copy the example env and set at least `DATABASE_URL` and `JWT_SECRET`:

```bash
cp .env.example services/api/.env
# Edit services/api/.env — set DATABASE_URL (e.g. postgresql://postgres:password@localhost:5432/tomoola) and JWT_SECRET
```

### 3. One-time setup (install, DB, seed, build)

From the repo root:

```bash
pnpm quick-setup
```

This runs: install → Prisma generate → migrations → seed (art forms + admin user) → build.

### 4. Start the app

```bash
pnpm dev
```

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:4000 (e.g. http://localhost:4000/api/health)

---

## Other commands

| Command | Description |
|--------|-------------|
| `pnpm install` | Install dependencies only |
| `pnpm build` | Build frontend and backend |
| `pnpm --filter @tomoola/api db:migrate` | Run Prisma migrations (dev) |
| `pnpm --filter @tomoola/api db:studio` | Open Prisma Studio |
| `pnpm lint` | Lint all packages |

See **[AGENTS.md](./AGENTS.md)** for full structure and conventions. See **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** for production deployment (Vercel + Railway).
