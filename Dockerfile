FROM node:20-slim AS build

WORKDIR /build

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm tsc

FROM node:20-slim AS runtime

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/dist .

CMD ["node", "index.js"]
