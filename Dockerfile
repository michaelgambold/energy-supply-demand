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

ENV NODE_ENV production

WORKDIR /app

# copy built files from builders
COPY --from=buildWeb ./web/dist ./web/dist
COPY --from=buildService ./service/dist ./service/dist

# get service prod dependencies for service
COPY ./service/package*.json ./service
RUN npm --prefix ./service ci

EXPOSE 3000

CMD ["node", "service/dist/main.js"]