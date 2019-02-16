#!/usr/bin/env bash

# To deploy, run source deploy.sh <dev|integration|staging|prod>
# The auth0 config file ./client/src/app/auth/auth0-variables.ts must also be setup

# Build the client
ENV="$1"
DIST_ID_TESTING="EKPCEEH1OGXGB"
DIST_ID_DEV="E1GC8ZIY6A9571"
DIST_ID_INTEGRATION="E3G3XIA004X2WL"
DIST_ID_STAGING="E2D5GGR57ZBWOQ"


if [ "$ENV" == 'prod' ]; then
    CLOUDFRONT_ID=${DIST_ID_STAGING}
elif [ "$ENV" == 'integration' ]; then
    CLOUDFRONT_ID=${DIST_ID_INTEGRATION}
elif [ "$ENV" == 'staging' ]; then
    CLOUDFRONT_ID=${DIST_ID_STAGING}
elif [ "$ENV" == 'testing' ]; then
    CLOUDFRONT_ID=${DIST_ID_TESTING}
else
    ENV='dev'
    CLOUDFRONT_ID=${DIST_ID_DEV}
fi

echo "Deploying $ENV..."

git pull

cd client
rm -rf node_modules
rm package-lock.json
npm cache verify
npm install
node ./replace.build.js ${ENV} && ng build --configuration ${ENV}

cd ..
rm -rf node_modules
rm package-lock.json
npm cache verify
npm install
serverless client deploy -v --env=${ENV}

# Configure CloudFront support in aws-cli
aws configure set preview.cloudfront true

echo "CLOUDFRONT_ID: ${CLOUDFRONT_ID}"
# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths '/*'
