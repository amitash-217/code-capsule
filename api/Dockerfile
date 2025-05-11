FROM node:20-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json /app

COPY . /app

RUN npm install

ENTRYPOINT ["node", "app"]