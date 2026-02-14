#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

echo "→ ToMoola quick-setup (install, DB, build)"
echo "  Ensure PostgreSQL is running (e.g. docker compose up -d)"
echo ""

echo "1/6 Copying .env.example to services/api and packages/db..."
cp .env.example services/api/.env
cp .env.example packages/db/.env
echo "   services/api/.env and packages/db/.env created/updated"

echo "2/6 Installing dependencies..."
pnpm install

echo "3/6 Generating Prisma client..."
pnpm --filter @tomoola/api db:generate

echo "4/6 Running migrations..."
pnpm --filter @tomoola/api db:migrate

echo "5/6 Seeding database..."
DATABASE_URL=""
if [ -f services/api/.env ]; then
  DATABASE_URL=$(grep -E '^DATABASE_URL=' services/api/.env 2>/dev/null | sed 's/^DATABASE_URL=//' | tr -d '\r' | head -1)
fi
[ -z "$DATABASE_URL" ] && [ -f packages/db/.env ] && DATABASE_URL=$(grep -E '^DATABASE_URL=' packages/db/.env 2>/dev/null | sed 's/^DATABASE_URL=//' | tr -d '\r' | head -1)
if [ -n "$DATABASE_URL" ] && command -v psql >/dev/null 2>&1; then
  psql "$DATABASE_URL" -f packages/db/prisma/seed.sql --quiet 2>/dev/null && echo "   Seed OK" || true
elif docker exec tomoola-db psql -U postgres -d tomoola -f - < packages/db/prisma/seed.sql 2>/dev/null; then
  echo "   Seed OK (via Docker)"
else
  echo "   Seed skipped (run manually: psql \$DATABASE_URL -f packages/db/prisma/seed.sql)"
fi

echo "6/6 Building..."
pnpm build

echo ""
echo "Done. Run: pnpm dev (frontend :3000, backend :4000)"
