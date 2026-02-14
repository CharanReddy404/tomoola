#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set"
  exit 1
fi

npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma
