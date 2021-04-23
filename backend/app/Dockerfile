FROM node:12-alpine

RUN apk update && apk add bash
RUN npm i -g nodemon

WORKDIR /app
COPY ./package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .

CMD ["npm", "start"]
