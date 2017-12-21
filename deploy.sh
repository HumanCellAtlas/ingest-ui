#!/usr/bin/env bash
# Build the client
git pull
cd client
npm install
npm run build-prod
# Build and run the install script
cd ..
npm install
serverless client deploy -v
# Configure CloudFront support in aws-cli
aws configure set preview.cloudfront true
# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E2D5GGR57ZBWOQ --paths '/*'
