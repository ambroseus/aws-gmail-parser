const fs = require('fs').promises
const path = require('path')
const process = require('process')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')
const cheerio = require('cheerio')

// authorizer & tokens

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist()
  if (client) {
    return client
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })
  if (client.credentials) {
    await saveCredentials(client)
  }
  return client
}

// parser

const TEST_GMAIL_FROM = 'ambroseus+aws-ses-sender@gmail.com'

async function parseEmails(auth) {
  const gmail = google.gmail({ version: 'v1', auth })
  const res = await gmail.users.messages.list({ userId: 'me', q: `from:${TEST_GMAIL_FROM}`, maxResults: 10 })
  const { messages } = res.data

  const emails = await Promise.all(
    messages.map((message) => gmail.users.messages.get({ userId: 'me', id: message.id }))
  )

  const emailBodies = emails.map((email) => Buffer.from(email.data.payload.body.data, 'base64').toString('utf-8'))
  console.log(`parseEmails > emailBodies`, emailBodies)
}

authorize().then(parseEmails).catch(console.error)

// [END gmail_quickstart]
