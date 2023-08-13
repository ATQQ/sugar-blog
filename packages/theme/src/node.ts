/* eslint-disable global-require */
/* eslint-disable prefer-rest-params */
import glob from 'fast-glob'
import matter from 'gray-matter'
import fs from 'fs'
import { execSync } from 'child_process'
import path from 'path'
import type { SiteConfig, UserConfig } from 'vitepress'
import { formatDate } from './utils/client/index'
import type { Theme } from './composables/config/index'
import { getTextSummary, getDefaultTitle, getFileBirthTime } from './utils/node'
import {
  getMarkdownPlugins,
  registerMdPlugins,
  wrapperCfgWithMermaid,
  supportRunExtendsPlugin
} from './utils/node/mdPlugins'
import { patchDefaultThemeSideBar } from './utils/node/theme'

/**
 *
 * @param cfg 获取主题的配置
 * @returns
 */
export function getThemeConfig(cfg?: Partial<Theme.BlogConfig>) {
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

      const meta: Partial<Theme.PageMeta> = {
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
        const timeZone = cfg?.timeZone ?? 8
        meta.date = formatDate(
          new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`)
        )
      }

      // 处理tags和categories,兼容历史文章
      meta.categories =
        typeof meta.categories === 'string'
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
      meta.description =
        meta.description || getTextSummary(fileContent, wordCount)

      // 获取封面图
      meta.cover =
        meta.cover ??
        (fileContent.match(/[!]\[.*?\]\((https:\/\/.+)\)/)?.[1] || '')

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
    .filter((v) => v.meta.layout !== 'home')

  const extraConfig: any = {}

  if (
    cfg?.search === 'pagefind' ||
    (cfg?.search instanceof Object && cfg.search.mode === 'pagefind')
  ) {
    let resolveConfig: any
    extraConfig.vite = {
      plugins: [
        {
          name: '@sugarar/theme-plugin-pagefind',
          enforce: 'pre',
          configResolved(config: any) {
            if (resolveConfig) {
              return
            }
            resolveConfig = config

            const vitepressConfig: SiteConfig = config.vitepress
            if (!vitepressConfig) {
              return
            }

            // 添加 自定义 vitepress 的钩子
            const selfBuildEnd = vitepressConfig.buildEnd
            vitepressConfig.buildEnd = (siteConfig: any) => {
              // 调用自己的
              selfBuildEnd?.(siteConfig)
              // 调用pagefind
              const ignore: string[] = [
                // 侧边栏内容
                'div.aside',
                // 标题锚点
                'a.header-anchor'
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

              log(command)
              log()
              execSync(command, {
                stdio: 'inherit'
              })
            }
          },
          // 添加检索的内容标识
          transform(code: string, id: string) {
            if (id.endsWith('theme-default/Layout.vue')) {
              return code.replace(
                '<VPContent>',
                '<VPContent data-pagefind-body>'
              )
            }
            return code
          }
        }
      ]
    }
  }

  // 获取要加载的markdown插件
  const markdownPlugin = getMarkdownPlugins(cfg)
  // 注册markdown插件
  registerMdPlugins(extraConfig, markdownPlugin)

  // 用于自定义sidebar卡片slot
  const extraSidebar = patchDefaultThemeSideBar(cfg)

  return {
    themeConfig: {
      blog: {
        pagesData: data as Theme.PageData[],
        ...cfg
      },
      ...extraSidebar
    },
    ...extraConfig
  }
}

/**
 * 代替默认的 defineConfig
 */
export function defineConfig(config: UserConfig<Theme.Config>): any {
  const resultConfig = wrapperCfgWithMermaid(config)
  supportRunExtendsPlugin(resultConfig)
  return resultConfig
}

// 重新导包 tabsMarkdownPlugin 导出CJS格式支持
export { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
