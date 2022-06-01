FROM node:16-alpine as buildWeb

WORKDIR /web

COPY ./web ./
RUN npm ci
RUN npm run build

FROM node:16-alpine as buildService

WORKDIR /service

COPY ./service ./
RUN npm ci
RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=buildWeb ./web ./web
COPY --from=buildService ./service ./service

EXPOSE 3000

CMD ["node", "service/dist/main.js"]