import glob from 'fast-glob'
import matter from 'gray-matter'
import fs from 'fs'
import { execSync, spawn, spawnSync } from 'child_process'
import path from 'path'
import type { SiteConfig } from 'vitepress'
import { formatDate } from './utils'
import type { PagefindOption } from './type'

export function getPagesData(_srcDir?: string) {
  const srcDir = _srcDir || process.argv.slice(2)?.[1] || '.'
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ['node_modules'] })

  const data = files
    .map((v) => {
      let route = v
        // 处理文件后缀名
        .replace('.md', '')

      // 去除 srcDir 处理目录名
      if (route.startsWith('./')) {
        route = route.replace(
          new RegExp(
            `^\\.\\/${path
              .join(srcDir, '/')
              .replace(new RegExp(`\\${path.sep}`, 'g'), '/')}`
          ),
          ''
        )
      } else {
        route = route.replace(
          new RegExp(
            `^${path
              .join(srcDir, '/')
              .replace(new RegExp(`\\${path.sep}`, 'g'), '/')}`
          ),
          ''
        )
      }

      const fileContent = fs.readFileSync(v, 'utf-8')

      // TODO: 支持JSON
      const meta = {
        ...matter(fileContent).data
      }
      if (!meta.title) {
        meta.title = getDefaultTitle(fileContent)
      }
      if (!meta.date) {
        // getGitTimestamp(v).then((v) => {
        //   meta.date = formatDate(v)
        // })
        meta.date = getFileBirthTime(v)
      } else {
        // TODO: 开放配置，设置时区
        meta.date = formatDate(
          new Date(`${new Date(meta.date).toUTCString()}+8`)
        )
      }

      // 处理tags和categories,兼容历史文章
      meta.tag = (meta.tag || []).concat([
        ...new Set([...(meta.categories || []), ...(meta.tags || [])])
      ])

      // 获取摘要信息
      const wordCount = 100
      meta.description =
        meta.description || getTextSummary(fileContent, wordCount)

      // 获取封面图
      meta.cover =
        meta.cover ||
        fileContent.match(/[!]\[.*?\]\((https:\/\/.+)\)/)?.[1] ||
        ''
      return {
        route: `/${route}`,
        meta
      }
    })
    .filter((v) => v.meta.layout !== 'home')

  return data
}

export function getDefaultTitle(content: string) {
  const title =
    clearMatterContent(content)
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
      } else if (second___ === undefined) {
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
  } catch (error) {
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

function getTextSummary(text: string, count = 100) {
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
      ?.filter((v) => !!v)
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
    let command = `npx pagefind --source ${path.join(
      process.argv.slice(2)?.[1] || '.',
      '.vitepress/dist'
    )}`

    if (ignore.length) {
      command += ` --exclude-selectors "${ignore.join(', ')}"`
    }

    if (typeof pagefindOps.forceLanguage === 'string') {
      command += ` --force-language ${pagefindOps.forceLanguage}`
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
        `import('${withBase(
          ctx.siteData.base || '',
          '/_pagefind/pagefind.js'
        )}')
    .then((module) => {
      window.__pagefind__ = module
    })
    .catch(() => {
      console.log('not load /_pagefind/pagefind.js')
    })`
      ]
    ]
  }
}

export function chineseSearchOptimize(input: string) {
  return input
    .replace(/[\u4e00-\u9fa5]/g, ' $& ')
    .replace(/\s+/g, ' ')
    .trim()
}
