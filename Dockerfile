FROM node:15.1.0-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build && rm -R node_modules && rm -R src

RUN yarn install --production

CMD [ "node", "./build/index.js" ]