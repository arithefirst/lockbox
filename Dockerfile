# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Application
FROM node:22-alpine

COPY package.json .
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/

EXPOSE 3000
CMD ["node", "build"]