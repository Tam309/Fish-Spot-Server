### DEVELOPMENT IMAGE ###
FROM node:18-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

### PRODUCTION IMAGE ###
FROM node:18-alpine AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]