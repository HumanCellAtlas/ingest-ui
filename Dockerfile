FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN cd client && npm install && node ./replace.build.js prod && ng build --env=prod
COPY client/dist /usr/share/nginx/html