/* eslint-disable global-require */
/* eslint-disable prefer-rest-params */
import { spawn, spawnSync } from 'node:child_process'
import path from 'node:path'

export function clearMatterContent(content: string) {
  let first___: unknown
  let second___: unknown

  const lines = content.split('\n').reduce<string[]>((pre, line) => {
    // 移除开头的空白行
    if (!line.trim() && pre.length === 0) {
      return pre
    }
    if (line.trim() === '---') {
      if (first___ === undefined) {
        first___ = pre.length
      }
      else if (second___ === undefined) {
        second___ = pre.length
      }
    }
    pre.push(line)
    return pre
  }, [])
  return (
    lines
      // 剔除---之间的内容
      .slice((second___ as number) || 0)
      .join('\n')
  )
}

export function getDefaultTitle(content: string) {
  const match = content.match(/^(#+)\s+(.+)/m)
  return match?.[2] || ''
}

export function getFileBirthTime(url: string) {
  let date = new Date()

  try {
    // 参考 vitepress 中的 getGitTimestamp 实现
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

export function getGitTimestamp(file: string) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['log', '-1', '--pretty="%ci"', file])
    let output = ''
    child.stdout.on('data', (d) => {
      output += String(d)
    })
    child.on('close', () => {
      resolve(+new Date(output))
    })
    child.on('error', reject)
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
