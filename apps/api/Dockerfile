# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY ../../pnpm-lock.yaml ../../package.json ./
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
COPY ../../pnpm-workspace.yaml ./
COPY ../../packages ./packages
COPY ./package.json ./
RUN pnpm install --frozen-lockfile=false

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app /app
COPY . .
RUN pnpm db:generate && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/generated ./generated
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm i --prod --ignore-scripts
EXPOSE 3001
CMD ["node", "dist/main.js"]


