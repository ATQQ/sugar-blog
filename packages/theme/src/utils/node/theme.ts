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

// hack：RSS用
export const pageMap = new Map<string, string>()

export function getArticles(cfg?: Partial<Theme.BlogConfig>) {
  const srcDir = cfg?.srcDir || process.argv.slice(2)?.[1] || '.'
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ['node_modules'] })

  // 文章数据
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
      // hack：RSS使用
      pageMap.set(`/${route}`, v)

      const fileContent = fs.readFileSync(v, 'utf-8')
      // TODO：摘要生成优化
      // TODO: 用上内容content
      const { data: frontmatter, excerpt } = matter(fileContent, {
        excerpt: true
      })

      const meta: Partial<Theme.PageMeta> = {
        ...frontmatter
      }

      if (!meta.title) {
        // TODO：优化标题的采集
        meta.title = getDefaultTitle(fileContent)
      }
      if (!meta.date) {
        // getGitTimestamp(v).then((v) => {
        //   meta.date = formatDate(v)
        // })
        meta.date = getFileBirthTime(v)
      }
      else {
        const timeZone = cfg?.timeZone ?? 8
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
      const wordCount = 100
      meta.description
        = meta.description || getTextSummary(fileContent, wordCount)

      // 获取封面图
      meta.cover
        = meta.cover
        ?? (getFirstImagURLFromMD(fileContent, `/${route}`))

      // 是否发布 默认发布
      if (meta.publish === false) {
        meta.hidden = true
        meta.recommend = false
      }

      return {
        route: `/${route}`,
        meta
      }
    })
    .filter(v => v.meta.layout !== 'home')
  return data as Theme.PageData[]
}

export function patchVPConfig(vpConfig: any, cfg?: Partial<Theme.BlogConfig>) {
  // TODO: 待确定场景
}

export function patchVPThemeConfig(
  cfg?: Partial<Theme.BlogConfig>,
  vpThemeConfig: any = {}
) {
  // 用于自定义sidebar卡片slot
  vpThemeConfig.sidebar = patchDefaultThemeSideBar(cfg)?.sidebar

  return vpThemeConfig
}
