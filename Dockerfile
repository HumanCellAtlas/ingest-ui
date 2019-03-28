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
CMD npm run prebuild && ng serve --host 0.0.0.0 -c=env --disable-host-check
