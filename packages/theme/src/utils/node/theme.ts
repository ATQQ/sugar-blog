import fs from 'node:fs'
import path from 'node:path'
import { getDefaultTitle, getFileLastModifyTime, getTextSummary, getVitePressPages, grayMatter, normalizePath, renderDynamicMarkdown } from '@sugarat/theme-shared'
import type { SiteConfig } from 'vitepress'
import type { Theme } from '../../composables/config/index'
import { formatDate } from '../client'
import { getFirstImagURLFromMD } from './index'

export function patchDefaultThemeSideBar(cfg?: Partial<Theme.BlogConfig>) {
  return cfg?.blog !== false && cfg?.recommend !== false
    ? {
        sidebar: [
          {
            text: '',
            items: []
          }
        ]
      }
    : undefined
}

export function getPageRoute(filepath: string, srcDir: string) {
  const route = normalizePath(path.relative(srcDir, filepath))
    .replace(/\.md$/, '')
  return `/${route}`
}

const defaultTimeZoneOffset = new Date().getTimezoneOffset() / -60
export async function getArticleMeta(filepath: string, route: string, timeZone = defaultTimeZoneOffset, baseContent?: string) {
  const fileContent = baseContent || await fs.promises.readFile(filepath, 'utf-8')

  const { data: frontmatter, excerpt, content } = grayMatter(fileContent, {
    excerpt: true,
  })

  const meta: Partial<Theme.PageMeta> = {
    ...frontmatter
  }

  if (!meta.title) {
    meta.title = getDefaultTitle(content)
  }
  const utcValue = timeZone >= 0 ? `+${timeZone}` : `${timeZone}`
  const date = await (
    (meta.date
      && new Date(`${new Date(meta.date).toUTCString()}${utcValue}`))
    || getFileLastModifyTime(filepath)
  )
  // 无法获取时兜底当前时间
  meta.date = formatDate(date || new Date())

  // 处理tags和categories,兼容历史文章
  meta.categories
    = typeof meta.categories === 'string'
      ? [meta.categories]
      : meta.categories
  meta.tags = typeof meta.tags === 'string' ? [meta.tags] : meta.tags
  meta.tag = [meta.tag || []]
    .flat()
    .concat([
      ...new Set([...(meta.categories || []), ...(meta.tags || [])])
    ])

  // 获取摘要信息
  // TODO：摘要生成优化
  meta.description
    = meta.description || getTextSummary(content, 100) || excerpt

  // 获取封面图
  // TODO: 耦合信息优化
  meta.cover
    = meta.cover
    ?? (getFirstImagURLFromMD(fileContent, route))

  // 是否发布 默认发布
  if (meta.publish === false) {
    meta.hidden = true
    meta.recommend = false
  }
  return meta as Theme.PageMeta
}

export async function getArticles(cfg: Partial<Theme.BlogConfig>, vpConfig: SiteConfig) {
  const pages = getVitePressPages(vpConfig)
  const metaResults = pages.reduce((prev, value) => {
    const { page, route, originRoute, filepath, isDynamic, dynamicRoute } = value

    const metaPromise = (isDynamic && dynamicRoute)
      ? getArticleMeta(filepath, originRoute, cfg?.timeZone, renderDynamicMarkdown(filepath, dynamicRoute.params, dynamicRoute.content))
      : getArticleMeta(filepath, originRoute, cfg?.timeZone)

    // 提前获取，有缓存取缓存
    prev[page] = {
      route,
      metaPromise
    }
    return prev
  }, {} as Record<string, {
    route: string
    metaPromise: Promise<Theme.PageMeta>
  }>)

  const pageData: Theme.PageData[] = []

  for (const page of pages) {
    const { route, metaPromise } = metaResults[page.page]
    const meta = await metaPromise
    if (meta.layout === 'home') {
      continue
    }
    pageData.push({
      route,
      meta
    })
  }
  return pageData
}

export function patchVPConfig(vpConfig: any, cfg?: Partial<Theme.BlogConfig>) {
  vpConfig.head = vpConfig.head || []
  // Artalk 资源地址
  if (cfg?.comment && 'type' in cfg.comment && cfg?.comment?.type === 'artalk') {
    const server = cfg.comment?.options?.server
    if (server) {
      vpConfig.head.push(['link', { href: `${server} /dist/Artalk.css`, rel: 'stylesheet' }])
      vpConfig.head.push(['script', { src: `${server} /dist/Artalk.js`, id: 'artalk-script' }])
    }
  }
}

export function patchVPThemeConfig(
  cfg?: Partial<Theme.BlogConfig>,
  vpThemeConfig: any = {}
) {
  // 用于自定义sidebar卡片slot
  vpThemeConfig.sidebar = patchDefaultThemeSideBar(cfg)?.sidebar

  return vpThemeConfig
}

export function checkConfig(cfg?: Partial<Theme.BlogConfig>) {
  // 保留
}
