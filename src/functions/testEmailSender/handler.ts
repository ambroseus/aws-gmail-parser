import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { awsSendEmail } from '@libs/aws'

const testEmailSender = async (event) => {
  try {
    const { subject, message } = event.body

    await awsSendEmail({
      from: process.env.TEST_GMAIL_FROM,
      to: process.env.TEST_GMAIL_TO,
      subject,
      message,
    })

    return formatJSONResponse(200, 'OK')
  } catch (error) {
    console.error(error)
    return formatJSONResponse(500, error)
  }
}

export const main = middyfy(testEmailSender)
