import { google } from 'googleapis'
import axios from 'axios'

const oauth = new google.auth.OAuth2(
  process.env.GMAIL_API_CLIENT_ID,
  process.env.GMAIL_API_CLIENT_SECRET,
  process.env.GMAIL_API_REDIRECT_URL
)

oauth.setCredentials({ refresh_token: process.env.GMAIL_API_REFRESH_TOKEN })

export const getUser = async () => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/${process.env.GMAIL_ACCOUNT}/profile`
  const { token } = await oauth.getAccessToken()

  const response = await axios({
    method: 'get',
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  })
  return response.data
}
