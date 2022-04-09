FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 32712
CMD [ "npm", "start" ]