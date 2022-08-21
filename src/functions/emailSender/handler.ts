import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'

const emailSender = async (event) => {
  console.info('importFileParser\n' + JSON.stringify(event, null, 2))
  try {
    return formatJSONResponse(200, '')
  } catch (error) {
    console.log('Error', error)
    return formatJSONResponse(500, 'Something went wrong')
  }
}

export const main = middyfy(emailSender)
