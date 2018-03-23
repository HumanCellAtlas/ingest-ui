#!/usr/bin/env bash

# To deploy, run source deploy.sh <dev|integration|staging|prod>
# The auth0 config file ./client/src/app/auth/auth0-variables.ts must also be setup

# Build the client
ENV="$1"
DIST_ID_DEV="E1GC8ZIY6A9571"
DIST_ID_INTEGRATION="E3G3XIA004X2WL"
DIST_ID_STAGING="E2D5GGR57ZBWOQ"
DIST_ID_PROD="E2HGQ4ZP3FKC7"

if [ "$ENV" == 'prod' ]; then
    CLOUDFRONT_ID=${DIST_ID_PROD}
elif [ "$ENV" == 'staging' ]; then
    CLOUDFRONT_ID=${DIST_ID_STAGING}
elif [ "$ENV" == 'integration' ]; then
    CLOUDFRONT_ID=${DIST_ID_INTEGRATION}
else
    ENV='dev'
    CLOUDFRONT_ID=${DIST_ID_DEV}
fi

echo "Deploying $ENV..."

git pull

cd client
npm install
node ./replace.build.js ${ENV} && ng build --env=${ENV}

cd ..
npm install
serverless client deploy -v --env=${ENV}

# Configure CloudFront support in aws-cli
aws configure set preview.cloudfront true

echo "CLOUDFRONT_ID: ${CLOUDFRONT_ID}"
# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths '/*'
