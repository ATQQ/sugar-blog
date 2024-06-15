import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'

export function getDefaultTitle(content: string) {
  const match = content.match(/^(#+)\s+(.+)/m)
  return match?.[2] || ''
}

const cache = new Map<string, Date | undefined>()
export function getFileBirthTime(url: string): Promise<Date | undefined> | Date {
  const cached = cache.get(url)
  if (cached) {
    return cached
  }

  return new Promise((resolve) => {
    // 使用异步回调
    const child = spawn('git', ['log', '-1', '--pretty="%ai"', url])
    let output = ''
    child.stdout.on('data', d => (output += String(d)))
    child.on('close', async () => {
      let date: Date | undefined
      if (output.trim()) {
        date = new Date(output)
      }
      else {
        date = await getFileBirthTimeByFs(url)
      }
      cache.set(url, date)
      resolve(date)
    })
    child.on('error', async () => {
      const fsDate = await getFileBirthTimeByFs(url)
      resolve(fsDate)
    })
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

export function aliasObjectToArray(obj: Record<string, string>) {
  return Object.entries(obj).map(([find, replacement]) => ({
    find,
    replacement
  }))
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

function isBase64ImageURL(url: string) {
  // Base64 图片链接的格式为 data:image/[image format];base64,[Base64 编码的数据]
  const regex = /^data:image\/[a-z]+;base64,/
  return regex.test(url)
}

const imageRegex = /!\[.*?\]\((.*?)\s*(".*?")?\)/

/**
 * 从文档内容中提取封面
 * @param content 文档内容
 */
export function getFirstImagURLFromMD(content: string, route: string) {
  const url = content.match(imageRegex)?.[1]
  const isHTTPSource = url && url.startsWith('http')
  if (!url) {
    return ''
  }

  if (isHTTPSource || isBase64ImageURL(url)) {
    return url
  }

  // TODO: 其它协议，待补充

  const paths = joinPath('/', route).split('/')
  paths.splice(paths.length - 1, 1)
  const relativePath = url.startsWith('/') ? url : path.join(paths.join('/') || '', url)

  return joinPath('/', relativePath)
}

export function debounce(func: any, delay = 1000) {
  let timeoutId: any
  return (...rest: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...rest)
    }, delay)
  }
}

export function isEqual(obj1: any, obj2: any, excludeKeys: string[] = []) {
  const keys1 = Object.keys(obj1).filter(key => !excludeKeys.includes(key))
  const keys2 = Object.keys(obj2).filter(key => !excludeKeys.includes(key))

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false
    }
    const val1 = obj1[key]
    const val2 = obj2[key]
    const areObjects = isObject(val1) && isObject(val2)
    if (
      (areObjects && !isEqual(val1, val2, excludeKeys))
      || (!areObjects && val1 !== val2)
    ) {
      return false
    }
  }

  return true
}

export function isObject(obj: any) {
  return obj != null && typeof obj === 'object'
}
