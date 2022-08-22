import { google } from 'googleapis'
import axios from 'axios'

const oauth = new google.auth.OAuth2(
  process.env.GMAIL_API_CLIENT_ID,
  process.env.GMAIL_API_CLIENT_SECRET,
  process.env.GMAIL_API_REDIRECT_URL
)

oauth.setCredentials({ refresh_token: process.env.GMAIL_API_REFRESH_TOKEN })

const baseUrl = `https://gmail.googleapis.com/gmail/v1/users/${process.env.GMAIL_ACCOUNT}`

const callApi = async (path) => {
  const { token } = await oauth.getAccessToken()

  const response = await axios({
    method: 'get',
    url: `${baseUrl}${path}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  })
  return response.data
}

export const getUser = async () => {
  return callApi('/profile')
}

export const getEmailById = async (id) => {
  return callApi(`/messages/${id}`)
}

const getHtmlBody = (message) => Buffer.from(message.payload.body.data, 'base64').toString('utf-8')

export const getEmailsBody = async ({ from = process.env.TEST_GMAIL_FROM, maxResults = 10 } = {}) => {
  const messageList = await callApi(`/messages?maxResults=${maxResults}&q=from:${encodeURIComponent(from)}`)
  if (!messageList?.messages) return []

  const messages = await Promise.all(messageList.messages.map((message) => getEmailById(message.id)))

  return messages.map(getHtmlBody)
}
