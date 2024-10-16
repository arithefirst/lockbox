FROM oven/bun:latest AS builder
WORKDIR /app
COPY . .
RUN bun install

RUN bun run build
FROM oven/bun:latest
COPY --from=builder /app/build .
RUN find
EXPOSE 3000
CMD ["bun", "run", "start"]
