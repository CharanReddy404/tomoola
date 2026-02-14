FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
WORKDIR /app

# ------- deps -------
FROM base AS deps

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY services/api/package.json services/api/
COPY packages/db/package.json packages/db/
COPY packages/shared/package.json packages/shared/

RUN pnpm install --frozen-lockfile

# ------- build -------
FROM deps AS build

COPY packages/ packages/
COPY services/api/ services/api/
COPY turbo.json ./

RUN pnpm --filter @tomoola/db generate
RUN pnpm --filter @tomoola/api build

# ------- production -------
FROM base AS production

ENV NODE_ENV=production

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY services/api/package.json services/api/
COPY packages/db/package.json packages/db/
COPY packages/shared/package.json packages/shared/

RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/packages/ packages/
COPY --from=build /app/services/api/dist/ services/api/dist/
COPY --from=build /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma/ node_modules/.pnpm/@prisma+client*/node_modules/.prisma/

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

WORKDIR /app/services/api

CMD ["node", "dist/main"]
