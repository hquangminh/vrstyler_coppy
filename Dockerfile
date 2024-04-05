FROM node:18.15.0-alpine3.16

WORKDIR /app

COPY package.json /app/

RUN yarn install

COPY . .

ARG DEPLOY_ENV

RUN yarn prod-build

CMD ["yarn", "prod-start"]