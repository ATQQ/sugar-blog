import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

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

export function getFileBirthTime(url: string) {
  let date = new Date()

  try {
    const infoStr = spawnSync('git', ['log', '-1', '--pretty="%ci"', url])
      .stdout?.toString()
      .replace(/["']/g, '')
      .trim()
    if (infoStr) {
      date = new Date(infoStr)
    }
  }
  catch (error) {
    return date
  }

  return date
}
