#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

echo "→ ToMoola quick-setup (install, DB, build)"
echo "  Ensure PostgreSQL is running (e.g. docker compose up -d)"
echo ""

echo "1/5 Installing dependencies..."
pnpm install

echo "2/5 Generating Prisma client..."
pnpm --filter @tomoola/api db:generate

echo "3/5 Running migrations..."
pnpm --filter @tomoola/api db:migrate

echo "4/5 Seeding database..."
set -a
[ -f services/api/.env ] && . services/api/.env
[ -f packages/db/.env ] && . packages/db/.env
set +a
if [ -n "$DATABASE_URL" ] && command -v psql >/dev/null 2>&1; then
  psql "$DATABASE_URL" -f packages/db/prisma/seed.sql --quiet 2>/dev/null && echo "   Seed OK" || true
elif docker exec tomoola-db psql -U postgres -d tomoola -f - < packages/db/prisma/seed.sql 2>/dev/null; then
  echo "   Seed OK (via Docker)"
else
  echo "   Seed skipped (run manually: psql \$DATABASE_URL -f packages/db/prisma/seed.sql)"
fi

echo "5/5 Building..."
pnpm build

echo ""
echo "Done. Run: pnpm dev (frontend :3000, backend :4000)"
