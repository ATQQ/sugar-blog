/* eslint-disable global-require */
/* eslint-disable prefer-rest-params */
import type { UserConfig } from 'vitepress'
import type { Theme } from './composables/config/index'
import {
  getMarkdownPlugins,
  registerMdPlugins,
  wrapperCfgWithMermaid,
  supportRunExtendsPlugin
} from './utils/node/mdPlugins'
import { getArticles, patchVPThemeConfig } from './utils/node/theme'
import { getVitePlugins, registerVitePlugins } from './utils/node/vitePlugins'

/**
 * 获取主题的配置
 * @param cfg 主题配置
 */
export function getThemeConfig(cfg?: Partial<Theme.BlogConfig>) {
  // 文章数据
  const pagesData = getArticles(cfg)
  const extraVPConfig: any = {}

  // 获取要加载的vite插件
  const vitePlugins = getVitePlugins(cfg)
  // 注册Vite插件
  registerVitePlugins(extraVPConfig, vitePlugins)

  // 获取要加载的markdown插件
  const markdownPlugin = getMarkdownPlugins(cfg)
  // 注册markdown插件
  registerMdPlugins(extraVPConfig, markdownPlugin)

  return {
    themeConfig: {
      blog: {
        pagesData,
        ...cfg
      },
      // 补充一些额外的配置用于继承
      ...patchVPThemeConfig(cfg)
    },
    ...extraVPConfig
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
