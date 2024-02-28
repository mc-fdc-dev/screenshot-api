FROM oven/bun:1

WORKDIR /app

COPY package.json ./
RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "src/index.ts"]
