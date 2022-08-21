import { SES } from 'aws-sdk'

const ses = new SES()

export const awsSendEmail = async ({ from, to, subject, message }) =>
  ses
    .sendEmail({
      Destination: {
        ToAddresses: [to],
      },
      Source: from,
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: message,
          },
        },
      },
    })
    .promise()
