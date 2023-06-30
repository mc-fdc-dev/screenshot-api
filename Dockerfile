FROM node:18-slim AS build

WORKDIR /build

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:18-slim AS runtime

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY --from=build /build/node_modules ./node_modules
COPY ./dist .

CMD ["node", "index.js"]