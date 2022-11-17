FROM node:lts-alpine3.14
RUN mkdir /app
COPY package*.json /app
WORKDIR /app
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]