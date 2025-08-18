FROM node:22-alpine AS base

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
