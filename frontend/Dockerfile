FROM node:22-alpine as build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine as static
COPY --from=build /app/frontend/dist /dist