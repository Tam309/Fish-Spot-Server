# syntax=docker/dockerfile:1.6

### Stage 1 - Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build    # builds to dist/

### Stage 2 - Run (Lambda)
FROM public.ecr.aws/lambda/nodejs:20
WORKDIR /var/task
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist

# The handler points to dist/lambda.js and export 'handler'
CMD ["dist/lambda.handler"]
