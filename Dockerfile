FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY client/dist /usr/share/nginx/html