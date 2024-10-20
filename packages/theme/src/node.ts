import type { UserConfig } from 'vitepress'
import type { Theme } from './composables/config/index'
import {
  getMarkdownPlugins,
  patchMermaidPluginCfg,
  patchOptimizeDeps,
  registerMdPlugins,
} from './utils/node/mdPlugins'
import { checkConfig, patchVPConfig, patchVPThemeConfig } from './utils/node/theme'
import { getVitePlugins, registerVitePlugins } from './utils/node/vitePlugins'

/**
 * 获取主题的配置
 * @param cfg 主题配置
 */
export function getThemeConfig(cfg: Partial<Theme.BlogConfig> = {}) {
  // 配置校验
  checkConfig(cfg)

  // 默认不开启 markdown 图表，会明显影响构建速度
  cfg.mermaid = cfg.mermaid ?? false

  // 文章数据
  const pagesData: Theme.PageData[] = []
  const extraVPConfig: any = {
    vite: {}
  }

  // 获取要加载的vite插件
  const vitePlugins = getVitePlugins(cfg)
  // 注册Vite插件
  registerVitePlugins(extraVPConfig, vitePlugins)

  // 获取要加载的markdown插件
  const markdownPlugin = getMarkdownPlugins(cfg)
  // 注册markdown插件
  registerMdPlugins(extraVPConfig, markdownPlugin)

  // patch extraVPConfig
  if (cfg?.mermaid !== false) {
    patchMermaidPluginCfg(extraVPConfig)
  }
  patchOptimizeDeps(extraVPConfig)

  patchVPConfig(extraVPConfig, cfg)
  return {
    themeConfig: {
      blog: {
        pagesData, // 插件里补全
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
  return config
}

export function defineLocaleConfig(cfg: Omit<Theme.BlogConfig, 'locales' | 'pagesData'>) {
  return cfg
}

// 重新导包 tabsMarkdownPlugin 导出CJS格式支持
export { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export function footerHTML(footerData: Theme.FooterItem | Theme.FooterItem[]) {
  const data = [footerData || []].flat()
  return data.map((d) => {
    const { icon, text, link } = d

    return `<span class="footer-item">
    ${icon ? `<i>${icon}</i>` : ''}
    ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer">${text}</a>` : `<span>${text}</span>`}
</span>`
  }).join('')
}
