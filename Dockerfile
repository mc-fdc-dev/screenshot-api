FROM node:20-slim as base

WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml .

FROM base as build

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm tsc

FROM base as installer

RUN pnpm install --frozen-lockfile --prod

FROM node:20-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY --from=installer /app/node_modules ./node_modules
COPY --from=build /app/dist .

CMD ["node", "index.js"]
