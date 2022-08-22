import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { getEmailsBody } from '@libs/gmail'
import { parseHtml } from '@libs/parse-html'

const gmailParser = async () => {
  try {
    const html = await getEmailsBody()

    const data = html.map(parseHtml)

    return formatJSONResponse(200, data)
    //
  } catch (error) {
    console.error(error)
    return formatJSONResponse(500, error.toString())
  }
}

export const main = middyfy(gmailParser)
