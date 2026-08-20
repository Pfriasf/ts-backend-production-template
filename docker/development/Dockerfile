FROM node:24-alpine

WORKDIR /usr/src/backend

ENV HUSKY=0

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3003

CMD ["npm", "run", "dev"]
