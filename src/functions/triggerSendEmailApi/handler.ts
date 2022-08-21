import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import axios from 'axios'

const triggerSendEmailApi = async (event) => {
  try {
    const { productId } = event.pathParameters

    if (!productId) {
      return formatJSONResponse(400, 'No product id in request')
    }

    await axios({
      method: 'post',
      url: process.env.API_SEND_EMAIL,
      headers: {
        'content-type': 'application/json',
      },
      data: {
        subject: `Added product #${productId}`,
        message: `<table border='1'><tr><td>Product ID</td><td>${productId}</td></tr></table>`,
      },
    })

    return formatJSONResponse(200, `Notification about adding product #${productId} has sent`)
    //
  } catch (error) {
    console.error(error)
    return formatJSONResponse(500, error.toString())
  }
}

export const main = middyfy(triggerSendEmailApi)
