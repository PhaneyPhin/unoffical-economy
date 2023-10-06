FROM node:latest As development

WORKDIR /usr/src/app

COPY caminv-sv-validator/package*.json ./

RUN npm install
