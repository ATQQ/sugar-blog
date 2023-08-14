import type { PluginOption } from 'vite'
import type { SiteConfig } from 'vitepress'
import type { RSSOptions } from './type'
import { genFeed } from './node'

export function RssPlugin(rssOptions: RSSOptions): any {
  let resolveConfig: any
  const pluginOps: PluginOption = {
    name: 'vitepress-plugin-rss',
    enforce: 'pre',
    configResolved(config: any) {
      if (resolveConfig) {
        return
      }
      resolveConfig = config

      const VPConfig: SiteConfig = config.vitepress
      if (!VPConfig) {
        return
      }

      // 添加自定义 buildEnd方法
      const selfBuildEnd = VPConfig.buildEnd
      VPConfig.buildEnd = async (siteConfig: any) => {
        // 调用自己的
        await selfBuildEnd?.(siteConfig)
        await genFeed(siteConfig, rssOptions)
      }
    }
  }
  return pluginOps
}

export * from './type'
