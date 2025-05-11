FROM node:20

ENV PROJECT_DIR=/opt/code-capsule

WORKDIR $PROJECT_DIR/

RUN apt-get update && apt-get install -y build-essential python3 make

COPY package*.json $PROJECT_DIR/

COPY . $PROJECT_DIR/

RUN npm install

RUN npm run build

ENTRYPOINT ["npm", "run", "start"]
