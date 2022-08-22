import { load } from 'cheerio'

export const parseHtml = (html) => {
  const $ = load(html)

  const data = []
  $('table td').each(function () {
    data.push($(this).text())
  })

  return { ProductID: data[1] }
}
