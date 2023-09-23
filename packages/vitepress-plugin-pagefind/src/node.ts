import fs from 'node:fs'
import { execSync, spawn, spawnSync } from 'node:child_process'
import path from 'node:path'
import os from 'node:os'
import process from 'node:process'
import type { SiteConfig } from 'vitepress'
import matter from 'gray-matter'
import glob from 'fast-glob'
import { formatDate } from './utils'
import type { PagefindOption } from './type'

export function getPagesData(
  srcDir: string,
  config: SiteConfig,
  pluginSiteConfig?: any
) {
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ['node_modules'] })

  return files
    .map((file) => {
      // page url
      const route
        = config.site.base
        + normalizePath(path.relative(config.srcDir, file))
          .replace(/(^|\/)index\.md$/, '$1')
          .replace(/\.md$/, config.cleanUrls ? '' : '.html')

      const fileContent = fs.readFileSync(file, 'utf-8')

      const { data: frontmatter, excerpt } = matter(fileContent, {
        excerpt: true
      })

      // frontmatter
      const meta: Record<string, string | undefined> = {
        description: excerpt,
        ...frontmatter
      }
      if (!meta.title) {
        meta.title = getDefaultTitle(fileContent)
      }

      if (!meta.date) {
        meta.date = getFileBirthTime(file)
      }
      else {
        const timeZone = pluginSiteConfig?.timeZone ?? 8
        meta.date = formatDate(
          new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`)
        )
      }
      return {
        route,
        meta
      }
    })
    .filter(v => v.meta.layout !== 'home')
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
  const title
    = clearMatterContent(content)
      .split('\n')
      ?.find((str) => {
        return str.startsWith('# ')
      })
      ?.slice(2)
      .replace(/[\s]/g, '') || ''
  return title
}

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

export function getFileBirthTime(url: string) {
  let date = new Date()

  try {
    // 参考 vitepress 中的 getGitTimestamp 实现
    // const infoStr = execSync(`git log -1 --pretty="%ci" ${url}`)
    //   .toString('utf-8')
    //   .trim()

    const infoStr = spawnSync('git', ['log', '-1', '--pretty="%ci"', url])
      .stdout?.toString()
      .replace(/["']/g, '')
      .trim()
    if (infoStr) {
      date = new Date(infoStr)
    }
  }
  catch (error) {
    return formatDate(date)
  }

  return formatDate(date)
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
    clearMatterContent(text)
      .match(/^# ([\s\S]+)/m)?.[1]
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
      ?.slice(1)
      ?.join('\n')
      ?.replace(/>(.*)/, '')
      ?.slice(0, count)
  )
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
