# ToMoola

A marketplace to connect **Indian folk artists** with **event organizers**. Clients discover artists by art form, request bookings, and pay offline (price negotiated directly). Artists manage profiles, availability, and bookings; admins approve artists and moderate content.

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <your-repo-url>
cd tomoola
pnpm install

# 2. Start services (PostgreSQL + Redis)
docker compose up -d

# 3. Setup environment
pnpm quick-setup

# 4. Start development servers
pnpm dev
```

Visit:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **API Health:** http://localhost:4000/api/health

## 📚 Documentation

All documentation is in the **[docs/](./docs/)** folder:

- **[Setup Guide](./docs/SETUP.md)** - Detailed setup instructions after bug fixes
- **[Development Guide](./docs/DEVELOPMENT.md)** - Code conventions and architecture
- **[Bug Fixes](./docs/BUG_FIXES.md)** - Recent fixes and improvements
- **[Technical Audit](./docs/TECHNICAL_AUDIT.md)** - Complete codebase analysis
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment (Vercel + Railway)

## 🛠️ Tech Stack

| Layer      | Stack                          |
|-----------|---------------------------------|
| Monorepo  | Turborepo + pnpm workspaces     |
| Frontend  | Next.js 15 (App Router), React 19 |
| Backend   | NestJS 11                       |
| Database  | PostgreSQL 16 + Prisma ORM      |
| Cache     | Redis 7                         |
| Language  | TypeScript (strict)             |

## ⚙️ Prerequisites

- **Node.js** ≥ 22 ([nvm](https://github.com/nvm-sh/nvm): `nvm use`)
- **pnpm** ≥ 10.15.0 (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker** (for PostgreSQL & Redis) or install locally

## 📖 Detailed Setup

### 1. Start Services (PostgreSQL + Redis)

Using Docker (recommended):

```bash
docker compose up -d
```

This starts:
- PostgreSQL on `localhost:5432` (DB: `tomoola`, user: `postgres`, password: `password`)
- Redis on `localhost:6379` (required for OTP storage)

### 2. One-Time Setup

From the repo root:

```bash
pnpm quick-setup
```

This script:
1. Copies `.env.example` → `services/api/.env`
2. Installs all dependencies
3. Generates Prisma client
4. Runs database migrations
5. Seeds database (9 art forms + admin user)
6. Builds all packages

### 3. Configure Environment Variables

Edit `services/api/.env` and set:

```bash
# Required
JWT_SECRET=<generate-with-openssl-rand-base64-32>
DATABASE_URL=postgresql://postgres:password@localhost:5432/tomoola
REDIS_URL=redis://localhost:6379

# Optional
FRONTEND_URL=http://localhost:3000
PORT=4000
```

### 4. Start Development Servers

```bash
pnpm dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Health Check:** http://localhost:4000/api/health

---

## 🔧 Common Commands

| Command | Description |
|--------|-------------|
| `pnpm install` | Install dependencies only |
| `pnpm dev` | Start frontend + backend in dev mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm quick-setup` | One-time setup script |
| `pnpm --filter @tomoola/api db:migrate` | Run Prisma migrations (dev) |
| `pnpm --filter @tomoola/api db:studio` | Open Prisma Studio UI |
| `pnpm --filter @tomoola/web dev` | Start frontend only |
| `pnpm --filter @tomoola/api dev` | Start backend only |

## 🏗️ Project Structure

```
tomoola/
├── services/
│   ├── web/          # Next.js 15 frontend (Port 3000)
│   └── api/          # NestJS 11 backend (Port 4000)
├── packages/
│   ├── db/           # Prisma schema & client
│   └── shared/       # Shared types & constants
├── docs/             # 📚 All documentation
├── scripts/          # Setup & deployment scripts
└── docker-compose.yml
```

## ✨ Features

- 🎭 **9 Indian Folk Art Forms** (Dollu Kunitha, Yakshagana, Huli Vesha, etc.)
- 🔐 **Phone OTP Authentication** with JWT
- 📅 **Booking Management** with status tracking
- 📊 **Admin Dashboard** for artist approvals
- 🖼️ **Media Portfolio** with Cloudflare R2 support
- ⭐ **Review System** with moderation
- 📱 **WhatsApp Notifications** (optional)
- 🔒 **Rate Limiting** & security best practices

## 🚢 Production Deployment

See **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** for complete deployment guide:
- Frontend: Vercel
- Backend: Railway
- Database: Railway PostgreSQL
- Redis: Railway/Upstash

## 🐛 Recent Improvements

All critical bugs from the technical audit have been fixed:
- ✅ Redis-based OTP storage (production-ready)
- ✅ Rate limiting on auth endpoints
- ✅ Cryptographically secure OTP generation
- ✅ Pagination on all list endpoints
- ✅ Full TypeScript type safety (no `any` types)
- ✅ Comprehensive error handling

See **[docs/BUG_FIXES.md](./docs/BUG_FIXES.md)** for details.

## 📄 License

MIT

## 🤝 Contributing

See **[docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)** for code conventions and architecture.
