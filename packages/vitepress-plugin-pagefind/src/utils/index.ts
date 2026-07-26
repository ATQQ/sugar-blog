export function formatDate(date: Date | string, lang: string) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }

  return new Intl.DateTimeFormat(lang, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

export function formatShowDate(date: Date | string, lang: string) {
  const source = +new Date(date)
  const now = +new Date()
  const diff = source - now

  const oneSeconds = 1000
  const oneMinute = oneSeconds * 60
  const oneHour = oneMinute * 60
  const oneDay = oneHour * 24
  const oneWeek = oneDay * 7

  const formatter = new Intl.RelativeTimeFormat(lang, { style: 'long', numeric: 'auto' })

  if (Math.abs(diff) < oneMinute) {
    return formatter.format(Math.trunc(diff / oneSeconds), 'second')
  }
  if (Math.abs(diff) < oneHour) {
    return formatter.format(Math.trunc(diff / oneMinute), 'minute')
  }
  if (Math.abs(diff) < oneDay) {
    return formatter.format(Math.trunc(diff / oneHour), 'hour')
  }
  if (Math.abs(diff) < oneWeek) {
    return formatter.format(Math.trunc(diff / oneDay), 'day')
  }

  return formatDate(new Date(date), lang)
}
