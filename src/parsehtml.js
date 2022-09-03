const cheerio = require('cheerio')

function parseHtml(htmlBody) {
  const $ = cheerio.load(htmlBody)

  const data = []
  $('table td').each(function () {
    data.push($(this).text())
  })

  return { ProductID: data[1] }
}

module.exports = {
  parseHtml,
}
