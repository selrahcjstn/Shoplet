# Shoplet API image (used by Render; see render.yaml at the repo root).
# Build context: the backend/ folder.

FROM node:24-slim

WORKDIR /app

# Dependencies first, so this layer is cached until package-lock.json changes.
# Dev dependencies are kept on purpose: the Prisma CLI runs the migrations at start-up.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
# Render sets PORT itself; 3000 is only the local default.
ENV PORT=3000
EXPOSE 3000

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

CMD ["docker-entrypoint.sh"]
