#!/usr/bin/env bash
cd client
npm install
ng build --prod
cd ..
npm install
serverless client deploy -v