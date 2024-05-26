import fs from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import os from 'node:os'
import process from 'node:process'
import { spawn } from 'cross-spawn'
import type { SiteConfig } from 'vitepress'
import matter from 'gray-matter'
import glob from 'fast-glob'
import { formatDate } from './utils'
import type { PagefindOption, SearchConfig } from './type'

export async function getPagesData(
  srcDir: string,
  config: SiteConfig,
  searchConfig: SearchConfig
) {
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ['node_modules'] })
  const fileContentPromises = files.reduce((prev, f) => {
    prev[f] = {
      content: fs.promises.readFile(f, 'utf-8'),
      date: (searchConfig.showDate ?? true) ? getFileBirthTime(f) : undefined
    }
    return prev
  }, {} as Record<string, { content: Promise<string>; date: Promise<Date | undefined> | undefined | Date }>)
  const pageData = []
  for (const file of files) {
    // page url
    const route = config.site.base + normalizePath(path.relative(config.srcDir, file))
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, config.cleanUrls ? '' : '.html')

    const fileContent = await fileContentPromises[file].content

    const { data: frontmatter, content } = matter(fileContent, {
      excerpt: true
    })

    // frontmatter
    const meta: Record<string, string | undefined> = {
      ...frontmatter
    }
    if (meta.layout === 'home') {
      continue
    }
    if (!meta.title) {
      meta.title = getDefaultTitle(content)
    }

    const date = await (meta.date || fileContentPromises[file].date)
    if (date) {
      meta.date = formatDate(date, 'yyyy-MM-dd')
    }
    pageData.push({
      route,
      meta
    })
  }
  return pageData
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

// 需要忽略检索的内容
const ignoreSelectors: string[] = [
  // 侧边栏内容
  'div.aside',
  // 标题锚点
  'a.header-anchor'
]

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

export const pluginSiteConfig: Partial<SiteConfig> = {
  /**
   * TODO：支持更多pagefind配置项
   * vitepress buildEnd钩子调用
   */
  buildEnd(ctx) {
    const pagefindOps: PagefindOption = (ctx as any).PagefindOption
    const ignore = [
      ...new Set(ignoreSelectors.concat(pagefindOps?.excludeSelector || []))
    ]
    const { log } = console
    log()
    log('=== pagefind: https://pagefind.app/ ===')
    const siteDir = path.join(
      process.argv.slice(2)?.[1] || '.',
      '.vitepress/dist'
    )
    let command = `npx pagefind --site ${siteDir}`

    if (ignore.length) {
      command += ` --exclude-selectors "${ignore.join(', ')}"`
    }

    if (typeof pagefindOps.forceLanguage === 'string') {
      command += ` --force-language ${pagefindOps.forceLanguage}`
    }
    // 用户自定义指令
    if (pagefindOps.indexingCommand) {
      command = pagefindOps.indexingCommand
    }
    log(command)
    log()
    execSync(command, {
      stdio: 'inherit'
    })
  },
  transformHead(ctx) {
    return [
      [
        'script',
        {},
        `import('${withBase(ctx.siteData.base || '', '/pagefind/pagefind.js')}')
    .then((module) => {
      window.__pagefind__ = module
      module.init()
    })
    .catch(() => {
      // console.log('not load /pagefind/pagefind.js')
    })`
      ]
    ]
  }
}

export function chineseSearchOptimize(input: string) {
  return input
    .replace(/[\u4E00-\u9FA5]/g, ' $& ')
    .replace(/\s+/g, ' ')
    .trim()
}
