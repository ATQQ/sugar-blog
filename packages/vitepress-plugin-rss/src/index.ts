import type { PluginOption } from 'vite'
import type { SiteConfig } from 'vitepress'
import type { RSSOptions } from './type'
import { genFeed } from './node'

const svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 448 512"><title>RSS</title><path d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM112 416c-26.51 0-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48s-21.49 48-48 48zm157.533 0h-34.335c-6.011 0-11.051-4.636-11.442-10.634c-5.214-80.05-69.243-143.92-149.123-149.123c-5.997-.39-10.633-5.431-10.633-11.441v-34.335c0-6.535 5.468-11.777 11.994-11.425c110.546 5.974 198.997 94.536 204.964 204.964c.352 6.526-4.89 11.994-11.425 11.994zm103.027 0h-34.334c-6.161 0-11.175-4.882-11.427-11.038c-5.598-136.535-115.204-246.161-251.76-251.76C68.882 152.949 64 147.935 64 141.774V107.44c0-6.454 5.338-11.664 11.787-11.432c167.83 6.025 302.21 141.191 308.205 308.205c.232 6.449-4.978 11.787-11.432 11.787z" fill="currentColor"></path></svg>'
const okMark = '\x1B[32m✓\x1B[0m'

function SocialIcon(rssOptions: RSSOptions, base = '/') {
  const icon
          = typeof rssOptions.icon === 'string'
            ? rssOptions.icon
            : svgIcon
  return {
    icon: {
      svg: icon
    },
    link:
      rssOptions.url
      || `${rssOptions.baseUrl}${
        base + (rssOptions.filename || 'feed.rss')
      }`,
    ariaLabel: rssOptions?.ariaLabel || 'RSS'
  }
}

export function RssPlugin(rssOptions: RSSOptions): any {
  let resolveConfig: any
  const pluginOps: PluginOption = {
    name: 'vitepress-plugin-rss',
    enforce: 'pre',
    configResolved(config: any) {
      // 避免多次执行
      if (resolveConfig) {
        return
      }
      resolveConfig = config

      const VPConfig: SiteConfig = config.vitepress
      if (!VPConfig) {
        return
      }

      const localesConfig: RSSOptions[] = []
      // 添加RSS icon
      if (rssOptions.icon ?? true) {
        VPConfig.site.themeConfig.socialLinks = [
          SocialIcon(rssOptions, VPConfig.site.base),
          ...VPConfig.site.themeConfig.socialLinks
        ]
        // i18n
        if (rssOptions?.locales && VPConfig.site?.locales) {
          Object.keys(VPConfig.site?.locales).forEach((locale) => {
            const rssCfg = rssOptions?.locales?.[locale]
            if (rssCfg && (rssCfg?.icon ?? true)) {
              const _tcfg = VPConfig.site.locales[locale]?.themeConfig
              if (!_tcfg) {
                VPConfig.site.locales[locale].themeConfig = {}
              }
              VPConfig.site.locales[locale].themeConfig.socialLinks = [
                SocialIcon(rssCfg, VPConfig.site.base),
                ...(_tcfg?.socialLinks || [])
              ]
              if (!rssCfg.filter) {
                rssCfg.filter = (value) => {
                  return !!value.url.startsWith(`/${locale}`)
                }
              }
              localesConfig.push(rssCfg)
            }
          })
        }
      }

      const selfBuildEnd = VPConfig.buildEnd
      // 自定义 buildEnd 方法，添加 rss 生成支持
      VPConfig.buildEnd = async (siteConfig: any) => {
        // 调用自己的
        await selfBuildEnd?.(siteConfig)
        console.time(`${okMark} generating RSS`)
        // 生成 rss 文件
        for (const _rssOptions of localesConfig) {
          await genFeed(siteConfig, _rssOptions)
        }

        // i18n 兼容，过滤掉其它语言的文章
        if (!rssOptions.filter && localesConfig.length > 0) {
          rssOptions.filter = (value, idx, arr) => {
            return !localesConfig.some(cfg => !!cfg?.filter?.(value, idx, arr))
          }
        }
        await genFeed(siteConfig, rssOptions)
        console.timeEnd(`${okMark} generating RSS`)

        if (rssOptions.log ?? true) {
          console.log()
        }
      }
    }
  }
  return pluginOps
}

export { genFeed, svgIcon }
export * from './type'
