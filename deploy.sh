#!/usr/bin/env bash
# Build the client
ENV="$1"
DIST_ID_DEV="E1GC8ZIY6A9571"
DIST_ID_STAGING="E2D5GGR57ZBWOQ"

if [ "$ENV" == 'prod' ]; then
    CLOUDFRONT_ID=${DIST_ID_STAGING}
elif [ "$ENV" == 'staging' ]; then
    CLOUDFRONT_ID=${DIST_ID_STAGING}
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
