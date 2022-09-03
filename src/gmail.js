const { google } = require('googleapis')

async function getMessages(auth, q, maxResults = 10) {
  const gmail = google.gmail({ version: 'v1', auth })
  const res = await gmail.users.messages.list({ userId: 'me', q, maxResults })
  return res.data.messages
}

async function getEmail(auth, id) {
  const gmail = google.gmail({ version: 'v1', auth })
  const res = await gmail.users.messages.get({ userId: 'me', id })
  return res.data.payload
}

module.exports = {
  getMessages,
  getEmail,
}
