import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { getUser } from '@libs/gmail'

const gmailParser = async () => {
  try {
    const user = await getUser()
    return formatJSONResponse(200, user)
    //
  } catch (error) {
    console.error(error)
    return formatJSONResponse(500, error.toString())
  }
}

export const main = middyfy(gmailParser)
