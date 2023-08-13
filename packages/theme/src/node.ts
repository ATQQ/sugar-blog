/* eslint-disable global-require */
/* eslint-disable prefer-rest-params */
import { execSync } from 'child_process'
import path from 'path'
import type { SiteConfig, UserConfig } from 'vitepress'
import type { Theme } from './composables/config/index'
import {
  getMarkdownPlugins,
  registerMdPlugins,
  wrapperCfgWithMermaid,
  supportRunExtendsPlugin
} from './utils/node/mdPlugins'
import { getArticles, patchDefaultThemeSideBar } from './utils/node/theme'

/**
 * 获取主题的配置
 * @param cfg 主题配置
 */
export function getThemeConfig(cfg?: Partial<Theme.BlogConfig>) {
  // 文章数据
  const pagesData = getArticles(cfg)
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
        pagesData,
        ...cfg
      },
      ...extraSidebar
    },
    ...extraConfig
  }
}

/**
 * defineConfig Helper
 */
export function defineConfig(config: UserConfig<Theme.Config>): any {
  const resultConfig = wrapperCfgWithMermaid(config)
  supportRunExtendsPlugin(resultConfig)
  return resultConfig
}

// 重新导包 tabsMarkdownPlugin 导出CJS格式支持
export { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
