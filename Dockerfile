### builder ###
FROM node:9.6.1 as builder

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ./client/package.json /usr/src/app/package.json
RUN npm install

COPY ./client /usr/src/app

RUN npm run build


### production ###
FROM nginx:1.13.9-alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]