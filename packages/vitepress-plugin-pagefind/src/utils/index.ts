export function formatDate(d: any, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!(d instanceof Date)) {
    d = new Date(d)
  }
  const o: any = {
    'M+': d.getMonth() + 1, // 月份
    'd+': d.getDate(), // 日
    'h+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    'S': d.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${d.getFullYear()}`.substr(4 - RegExp.$1.length)
    )
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      )
  }
  return fmt
}

export function formatShowDate(date: Date | string, lang: string) {
  const source = +new Date(date)
  const now = +new Date()
  const diff = now - source
  const oneSeconds = 1000
  const oneMinute = oneSeconds * 60
  const oneHour = oneMinute * 60
  const oneDay = oneHour * 24
  const oneWeek = oneDay * 7

  const langMap = {
    'zh-cn': {
      justNow: '刚刚',
      secondsAgo: '秒前',
      minutesAgo: '分钟前',
      hoursAgo: '小时前',
      daysAgo: '天前',
      weeksAgo: '周前'
    },
    'en-us': {
      justNow: ' just now',
      secondsAgo: ' seconds ago',
      minutesAgo: ' minutes ago',
      hoursAgo: ' hours ago',
      daysAgo: ' days ago',
      weeksAgo: ' weeks ago'
    }
  }
  const mapValue = langMap[lang.toLowerCase() as 'zh-cn' | 'en-us'] || langMap['en-us']

  if (diff < 10) {
    return mapValue.justNow
  }
  if (diff < oneMinute) {
    return `${Math.floor(diff / oneSeconds)}${mapValue.secondsAgo}`
  }
  if (diff < oneHour) {
    return `${Math.floor(diff / oneMinute)}${mapValue.minutesAgo}`
  }
  if (diff < oneDay) {
    return `${Math.floor(diff / oneHour)}${mapValue.hoursAgo}`
  }
  if (diff < oneWeek) {
    return `${Math.floor(diff / oneDay)}${mapValue.daysAgo}`
  }

  return formatDate(new Date(date), 'yyyy-MM-dd')
}
