import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'cross-spawn'
import matter from 'gray-matter'
import { getCacheTimestamp, getGitTimestamp } from './getGitTimestamp'


/**
 * 获取 markdown 内容中的标题
 */
export function getDefaultTitle(content: string) {
  const match = content.match(/^(#+)\s+(.+)/m)
  return match?.[2] || ''
}

const cache = new Map<string, Date | undefined>()

// 文件摘要缓存
const fileSummaryCache = new Map<string, string>()

/**
 * 计算文件内容的MD5哈希值 - 优化版本
 */
export function getFileMD5(filePath: string): string {
  try {
    // 检查缓存
    const cacheKey = filePath
    const cached = fileSummaryCache.get(cacheKey)
    if (cached) {
      return cached
    }

    const fileBuffer = fs.readFileSync(filePath)
    const hashSum = crypto.createHash('md5')
    hashSum.update(fileBuffer)
    const hash = hashSum.digest('hex')
    fileSummaryCache.set(filePath, hash)
    return hash
  } catch (error) {
    // 如果文件读取失败，返回文件路径的哈希作为fallback
    const hashSum = crypto.createHash('md5')
    hashSum.update(filePath)
    return hashSum.digest('hex')
  }
}

/**
 * 快速生成文件摘要 - 仅基于文件统计信息
 */
export function getFileQuickSummary(filePath: string): string {
  try {
    const stats = fs.statSync(filePath)
    const hashSum = crypto.createHash('md5')
    hashSum.update(`${filePath}:${stats.size}:${stats.mtime.getTime()}:${stats.ino}`)
    return hashSum.digest('hex')
  } catch (error) {
    // fallback到路径哈希
    const hashSum = crypto.createHash('md5')
    hashSum.update(filePath)
    return hashSum.digest('hex')
  }
}

export async function fastMD5(filePath: string): Promise<string> {
  return getFileMD5(filePath)
}

/**
 * 生成缓存key：文件MD5 + basename
 * @param filePath 文件路径
 * @param useQuickSummary 是否使用快速摘要（默认false，使用完整摘要）
 */
function generateCacheKey(filePath: string, useQuickSummary: boolean = false): string {
  const md5 = getFileMD5(filePath)
  const basename = path.basename(filePath)
  return `${md5}_${basename}`
}

/**
 * 从缓存目录读取时间戳
 */
async function readTimestampFromCache(cacheDir: string, cacheKey: string): Promise<Date | null> {
  try {
    const cacheFilePath = path.join(cacheDir, `${cacheKey}.cache`)
    if (!fs.existsSync(cacheFilePath)) {
      return null
    }
    const timestamp = fs.readFileSync(cacheFilePath, 'utf-8').trim()
    return new Date(parseInt(timestamp))
  } catch (error) {
    return null
  }
}

/**
 * 将时间戳写入缓存目录
 */
async function writeTimestampToCache(cacheDir: string, cacheKey: string, date: Date): Promise<void> {
  try {
    // 确保缓存目录存在
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }
    const cacheFilePath = path.join(cacheDir, `${cacheKey}.cache`)
    fs.writeFileSync(cacheFilePath, date.getTime().toString())
  } catch (error) {
    // 缓存写入失败不影响主要功能
    console.warn('Failed to write cache:', error)
  }
}
/**
 * 获取文件最后修改时间
 * 优先使用 git 命令获取，如果失败则使用 fs.stat 获取
 * @param url 文件路径
 * @param cacheDir 缓存目录（可选）
 */
export async function getFileLastModifyTime(url: string, cacheDir?: string) {
  if (cacheDir) {
    cacheDir = path.join(cacheDir, 'fileLastModifyTime')
  }
  // 检查内存缓存
  const cached = cache.get(url)
  if (cached) {
    return cached
  }
  const cacheTimeStamp = getCacheTimestamp(url)
  if (cacheTimeStamp) {
    cache.set(url, new Date(cacheTimeStamp))
    return new Date(cacheTimeStamp)
  }

  // 如果提供了缓存目录，优先从文件缓存中读取
  if (cacheDir) {
    const cacheKey = generateCacheKey(url)
    const cachedDate = await readTimestampFromCache(cacheDir, cacheKey)

    if (cachedDate) {
      cache.set(url, cachedDate)
      return cachedDate
    }
  }

  let date
  let gitTimestamp = await getGitTimestamp(url)
  if (gitTimestamp) {
    date = new Date(gitTimestamp)
  }

  if (!date) {
    date = await getFileLastModifyTimeByFs(url)
  }

  if (date) {
    // 保存到内存缓存
    cache.set(url, date)

    // 如果提供了缓存目录，也保存到文件缓存
    if (cacheDir) {
      const cacheKey = generateCacheKey(url)
      await writeTimestampToCache(cacheDir, cacheKey, date)
    }
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
