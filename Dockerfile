FROM node:latest As development

WORKDIR /usr/src/app

COPY invoice-validator/package*.json ./

RUN npm install
