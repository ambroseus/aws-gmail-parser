const { authorize } = require('./src/authorizer')
const { getMessages, getEmail } = require('./src/gmail')
const { parseHtml } = require('./src/parsehtml')

async function parseEmails(auth) {
  const messages = await getMessages(auth, 'from:ambroseus+aws-ses-sender@gmail.com')

  for (const message of messages) {
    const email = await getEmail(auth, message.id)

    console.log(`parseEmails > message`, message)

    if (email.body.data) {
      const htmlBody = Buffer.from(email.body.data, 'base64').toString('utf-8')
      console.log(`parseEmails > htmlBody`, htmlBody)

      const data = parseHtml(htmlBody)
      console.log(`parseEmails > data`, data)
    }
  }
}

authorize().then(parseEmails).catch(console.error)
