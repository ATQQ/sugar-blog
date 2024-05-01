/* eslint-disable prefer-rest-params */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import glob from 'fast-glob'
import matter from 'gray-matter'
import type { Theme } from '../../composables/config/index'
import { formatDate } from '../client'
import { getDefaultTitle, getFileBirthTime, getFirstImagURLFromMD, getTextSummary } from './index'

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
  let route = filepath.replace('.md', '')
  // 去除 srcDir 处理目录名
  // TODO：优化 路径处理，同VitePress 内部一致
  if (route.startsWith('./')) {
    route = route.replace(
      new RegExp(
        `^\\.\\/${path
          .join(srcDir, '/')
          .replace(new RegExp(`\\${path.sep}`, 'g'), '/')}`
      ),
      ''
    )
  }
  else {
    route = route.replace(
      new RegExp(
        `^${path
          .join(srcDir, '/')
          .replace(new RegExp(`\\${path.sep}`, 'g'), '/')}`
      ),
      ''
    )
  }
  return `/${route}`
}

const defaultTimeZoneOffset = new Date().getTimezoneOffset() / -60
export function getArticleMeta(filepath: string, route: string, timeZone = defaultTimeZoneOffset) {
  const fileContent = fs.readFileSync(filepath, 'utf-8')

  const { data: frontmatter, excerpt, content } = matter(fileContent, {
    excerpt: true,
  })

  const meta: Partial<Theme.PageMeta> = {
    ...frontmatter
  }

  if (!meta.title) {
    meta.title = getDefaultTitle(content)
  }
  if (!meta.date) {
    meta.date = formatDate(getFileBirthTime(filepath))
  }
  else {
    meta.date = formatDate(
      new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`)
    )
  }

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
export function getArticles(cfg?: Partial<Theme.BlogConfig>) {
  const srcDir = cfg?.srcDir || process.argv.slice(2)?.[1] || '.'
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ['node_modules'] })

  // 文章数据
  const pageData = files
    .map((filepath) => {
      const route = getPageRoute(filepath, srcDir)
      const meta = getArticleMeta(filepath, route, cfg?.timeZone)
      return {
        route,
        meta
      }
    })
    .filter(v => v.meta.layout !== 'home')
  return pageData as Theme.PageData[]
}

export function patchVPConfig(vpConfig: any, cfg?: Partial<Theme.BlogConfig>) {
  vpConfig.head = vpConfig.head || []
  // Artalk 资源地址
  if (cfg?.comment && 'type' in cfg.comment && cfg?.comment?.type === 'artalk') {
    const server = cfg.comment?.options?.server
    if (server) {
      vpConfig.head.push(['link', { href: `${server}/dist/Artalk.css`, rel: 'stylesheet' }])
      vpConfig.head.push(['script', { src: `${server}/dist/Artalk.js`, id: 'artalk-script' }])
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
  // TODO：保留
}
