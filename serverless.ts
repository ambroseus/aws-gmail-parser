import type { AWS } from '@serverless/typescript'

import emailSender from '@functions/emailSender'

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: 'aws-gmail-parser-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    stage: 'dev',
    profile: 'serverless',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: ['arn:aws:s3:::${env:BUCKET_NAME}'],
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: ['arn:aws:s3:::${env:BUCKET_NAME}/*'],
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [{ 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] }],
      },
    ],
  },

  functions: { emailSender },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
}

module.exports = serverlessConfiguration
