FROM node:alpine AS build

COPY . /site
WORKDIR /site

RUN npm install && npm run build

FROM nginx

COPY --from=build /site/build /usr/share/nginx/html
