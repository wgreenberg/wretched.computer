FROM node:alpine AS build

COPY . /site
WORKDIR /site

RUN npm install && npm run build

FROM nginx

COPY --from=build /site/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx
COPY ./nginx/wretched-computer.conf /etc/nginx/conf.d/default.conf
