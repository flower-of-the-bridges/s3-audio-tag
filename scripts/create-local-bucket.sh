#!/bin/bash

# Wait for LocalStack to be ready
while ! nc -z localhost 4566; do
  sleep 1
done

# Set AWS CLI credentials and region for LocalStack
aws configure set aws_access_key_id client_id --profile localstack
aws configure set aws_secret_access_key client_secret --profile localstack
aws configure set region us-east-1 --profile localstack

# Create a bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://your-bucket-name --profile localstack

# Set CORS policy for the bucket
aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors --profile localstack --bucket your-bucket-name --cors-configuration '{"CORSRules": [{"AllowedOrigins": ["*"],"AllowedMethods": ["GET","PUT","POST","DELETE","HEAD"],"AllowedHeaders":["*"],"ExposeHeaders":[]}]}'

echo "LocalStack setup complete"
