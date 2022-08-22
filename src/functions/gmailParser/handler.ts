import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { getEmailsBody } from '@libs/gmail'

const gmailParser = async () => {
  try {
    const html = await getEmailsBody()
    return formatJSONResponse(200, html)
    //
  } catch (error) {
    console.error(error)
    return formatJSONResponse(500, error.toString())
  }
}

export const main = middyfy(gmailParser)
