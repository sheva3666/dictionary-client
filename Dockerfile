# Base image for React
FROM node:18 as build-stage

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve React with Nginx
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]