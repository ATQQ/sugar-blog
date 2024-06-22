import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'cross-spawn'
import matter from 'gray-matter'
import pLimit from 'p-limit'

const timeLimit = pLimit(+(process.env.P_LIMT_MAX || os.cpus().length))

/**
 * 获取 markdown 内容中的标题
 */
export function getDefaultTitle(content: string) {
  const match = content.match(/^(#+)\s+(.+)/m)
  return match?.[2] || ''
}

const cache = new Map<string, Date | undefined>()
/**
 * 获取文件最后修改时间
 * 优先使用 git 命令获取，如果失败则使用 fs.stat 获取
 */
export async function getFileLastModifyTime(url: string) {
  const cached = cache.get(url)
  if (cached) {
    return cached
  }
  let date = await timeLimit(() => getFileLastModifyTimeByGit(url))
  if (!date) {
    date = await getFileLastModifyTimeByFs(url)
  }
  if (date) {
    cache.set(url, date)
  }
  return date
}

export function getFileLastModifyTimeByGit(url: string): Promise<Date | undefined> {
  return new Promise((resolve) => {
    const cwd = path.dirname(url)

    // 有额外的耗时，try-catch 处理
    // if (!fs.existsSync(cwd))
    //   return resolve(undefined)
    try {
      const fileName = path.basename(url)

      // 使用异步回调
      const child = spawn('git', ['log', '-1', '--pretty="%ai"', fileName], {
        cwd,
      })
      let output = ''
      child.stdout.on('data', d => (output += String(d)))
      child.on('close', async () => {
        let date: Date | undefined
        if (output.trim()) {
          date = new Date(output)
        }
        resolve(date)
      })
      child.on('error', async () => {
        resolve(undefined)
      })
    }
    catch {
      resolve(undefined)
    }
  })
}

export async function getFileBirthTimeByFs(url: string) {
  try {
    const fsStat = await fs.promises.stat(url)
    return fsStat.birthtime
  }
  catch {
    return undefined
  }
}

export async function getFileLastModifyTimeByFs(url: string) {
  try {
    const fsStat = await fs.promises.stat(url)
    return fsStat.mtime
  }
  catch {
    return undefined
  }
}

export const EXTERNAL_URL_RE = /^[a-z]+:/i

/**
 * Join two paths by resolving the slash collision.
 */
export function joinPath(base: string, path: string): string {
  return `${base}${path}`.replace(/\/+/g, '/')
}

export function withBase(base: string, path: string) {
  return EXTERNAL_URL_RE.test(path) || path.startsWith('.')
    ? path
    : joinPath(base, path)
}

export const grayMatter = matter

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

const windowsSlashRE = /\\/g
export const isWindows = os.platform() === 'win32'

export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/')
}

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}
