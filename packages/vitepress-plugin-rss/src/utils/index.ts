import os from 'node:os'
import path from 'node:path'
import { spawn } from 'cross-spawn'

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

const windowsSlashRE = /\\/g
export const isWindows = os.platform() === 'win32'

export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/')
}

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}

export function getDefaultTitle(content: string) {
  const match = content.match(/^(#+)\s+(.+)/m)
  return match?.[2] || ''
}

const cache = new Map<string, Date>()

export function getFileBirthTime(url: string): Promise<Date | undefined> | Date {
  const cached = cache.get(url)
  if (cached)
    return cached

  return new Promise((resolve) => {
    // 使用异步回调
    const child = spawn('git', ['log', '-1', '--pretty="%ai"', url])
    let output = ''
    child.stdout.on('data', d => (output += String(d)))
    child.on('close', () => {
      const date = new Date(output)
      cache.set(url, date)
      resolve(date)
    })
    child.on('error', () => {
      resolve(undefined)
    })
  })
}

export function getTextSummary(text: string, count = 100) {
  return (
    text
      // 首个标题
      ?.replace(/^#+\s+.*/, '')
      // 除去标题
      ?.replace(/#/g, '')
      // 除去图片
      ?.replace(/!\[.*?\]\(.*?\)/g, '')
      // 除去链接
      ?.replace(/\[(.*?)\]\(.*?\)/g, '$1')
      // 除去加粗
      ?.replace(/\*\*(.*?)\*\*/g, '$1')
      ?.split('\n')
      ?.filter(v => !!v)
      ?.join('\n')
      ?.replace(/>(.*)/, '')
      ?.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      ?.trim()
      ?.slice(0, count)
  )
}
