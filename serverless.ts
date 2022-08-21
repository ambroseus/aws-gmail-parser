import type { AWS } from '@serverless/typescript'

import testEmailSender from '@functions/testEmailSender'
import triggerSendEmailApi from '@functions/triggerSendEmailApi'
import gmailParser from '@functions/gmailParser'

const serverlessConfiguration: AWS = {
  service: 'aws-gmail-parser-service',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'aws-practitioner',
    region: 'us-east-1',
    stage: '${opt:stage, "dev"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      TEST_GMAIL_FROM: '${env:TEST_GMAIL_FROM}',
      TEST_GMAIL_TO: '${env:TEST_GMAIL_TO}',
      API_SEND_EMAIL: '${env:API_SEND_EMAIL}',
      GMAIL_ACCOUNT: '${env:GMAIL_ACCOUNT}',
      GMAIL_API_CLIENT_ID: '${env:GMAIL_API_CLIENT_ID}',
      GMAIL_API_CLIENT_SECRET: '${env:GMAIL_API_CLIENT_SECRET}',
      GMAIL_API_REDIRECT_URL: '${env:GMAIL_API_REDIRECT_URL}',
      GMAIL_API_REFRESH_TOKEN: '${env:GMAIL_API_REFRESH_TOKEN}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['ses:*'],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: ['logs:*'],
        Resource: { 'Fn::Sub': 'arn:aws:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/*:*:*' },
      },
    ],
  },
  functions: {
    testEmailSender,
    triggerSendEmailApi,
    gmailParser,
  },
  useDotenv: true,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: false,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
}

module.exports = serverlessConfiguration
