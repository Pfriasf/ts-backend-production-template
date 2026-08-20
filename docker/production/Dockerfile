FROM node:24-alpine AS build

WORKDIR /usr/src/backend

ENV HUSKY=0

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build && npm prune --omit=dev

FROM node:24-alpine AS runtime

WORKDIR /usr/src/backend

ENV NODE_ENV=production

COPY --from=build --chown=node:node /usr/src/backend/package*.json ./
COPY --from=build --chown=node:node /usr/src/backend/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/backend/dist ./dist

USER node

EXPOSE 3003

CMD ["node", "--enable-source-maps", "dist/src/server.js"]
