# ToMoola — Development Guide

## Commands
- **Install deps:** `pnpm install` (from root)
- **Dev (all):** `pnpm dev` (starts Next.js on :3000 + NestJS on :4000)
- **Build frontend:** `pnpm --filter @tomoola/web build`
- **Build backend:** `pnpm --filter @tomoola/api build`
- **Build all:** `pnpm build`
- **Prisma generate:** `pnpm --filter @tomoola/db generate`
- **Prisma migrate:** `pnpm --filter @tomoola/api db:migrate`
- **Prisma studio:** `pnpm --filter @tomoola/api db:studio`

## Structure
```
tomoola/
├── services/
│   ├── web/          # Next.js 15 (App Router) — port 3000
│   └── api/          # NestJS 11 — port 4000
├── packages/
│   ├── db/           # Prisma schema + client
│   └── shared/       # Types, constants, DTOs
```

## Tech Stack
- **Monorepo:** Turborepo + pnpm workspaces
- **Frontend:** Next.js 15 (React 19, App Router)
- **Backend:** NestJS 11
- **Database:** PostgreSQL + Prisma ORM
- **Language:** TypeScript (strict mode)

## Conventions
- Use absolute imports: `@/*` maps to `./src/*` in both apps
- Shared types go in `packages/shared/src/types.ts`
- Constants go in `packages/shared/src/constants.ts`
- Database models defined in `packages/db/prisma/schema.prisma`
- API prefix: all endpoints start with `/api`
- No code comments unless complex logic requires context
