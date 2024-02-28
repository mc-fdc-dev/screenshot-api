FROM node:20-slim as base

WORKDIR /app

COPY package.json pnpm-lock.yaml ,

FROM base as build

RUN corepack enable

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm tsc

FROM base as installer

RUN pnpm install --frozen-lockfile

FROM node:20-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/dist .

CMD ["node", "index.js"]