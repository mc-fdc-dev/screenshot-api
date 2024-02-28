FROM oven/bun:1

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

CMD ["bun", "run", "src/index.ts"]
