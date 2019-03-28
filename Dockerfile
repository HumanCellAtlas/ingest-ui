# base image
FROM node:11-alpine

# set working directory
RUN mkdir /app
WORKDIR /app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY ./client/package.json /app/package.json
RUN npm install

# add app
COPY ./client /app

# start app
CMD npm run prebuild && ng serve --host 0.0.0.0 -c=env


##########################
#### build environment ###
##########################
#
## base image
#FROM node:11.9.0 as builder
#
## install chrome for protractor tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable
#
## set working directory
#RUN mkdir /usr/src/app
#WORKDIR /usr/src/app
#
## add `/usr/src/app/node_modules/.bin` to $PATH
#ENV PATH /usr/src/app/node_modules/.bin:$PATH
#
## install and cache app dependencies
#COPY ./client/package.json /usr/src/app/package.json
#RUN npm install
#
## add app
#COPY ./client /usr/src/app
#
## generate build
#RUN npm run build
#
#
###################
#### production ###
###################
#
## base image
#FROM nginx:1.13.9-alpine
#
## copy artifact build from the 'build environment'
#COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
#
## expose port 80
#EXPOSE 80
#
## run nginx
#CMD ["nginx", "-g", "daemon off;"]
#
