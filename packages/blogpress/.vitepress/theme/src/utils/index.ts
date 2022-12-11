export function formatDate(d: Date, fmt = 'yyyy-MM-dd hh:mm:ss') {
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
    S: d.getMilliseconds() // 毫秒
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

export function isCurrentWeek(date: Date, target?: Date) {
  const now = target || new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const oneDay = 1000 * 60 * 60 * 24
  const nowWeek = today.getDay()
  // 本周一的时间
  const startWeek = today.getTime() - (nowWeek === 0 ? 6 : nowWeek - 1) * oneDay
  return +date >= startWeek && +date <= startWeek + 7 * oneDay
}
