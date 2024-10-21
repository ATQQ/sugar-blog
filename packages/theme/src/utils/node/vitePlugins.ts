import type { HeadConfig, SiteConfig } from 'vitepress'
import {
  pagefindPlugin
} from 'vitepress-plugin-pagefind'
import { RssPlugin } from 'vitepress-plugin-rss'
import type { PluginOption } from 'vite'
import { joinPath } from '@sugarat/theme-shared'
import { AnnouncementPlugin } from 'vitepress-plugin-announcement'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import type { Theme } from '../../composables/config/index'
import { _require } from './mdPlugins'
import { themeReloadPlugin } from './hot-reload-plugin'
import { getArticles } from './theme'

export function getVitePlugins(cfg: Partial<Theme.BlogConfig> = {}) {
  const plugins: any[] = []

  // 处理 cover image 的路径（暂只支持自动识别的文章首图）
  plugins.push(coverImgTransform())

  // 处理自定义主题色
  if (cfg.themeColor) {
    plugins.push(setThemeScript(cfg.themeColor))
  }
  // 自动重载首页
  plugins.push(themeReloadPlugin())

  // 主题 pageData生成
  plugins.push(providePageData(cfg))

  // 内置 pagefind
  if (cfg && cfg.search !== false) {
    const ops = cfg.search instanceof Object ? cfg.search : {}
    plugins.push(
      pagefindPlugin({
        ...ops,
      })
    )
  }

  // 内置支持 Markdown 流程图 Mermaid
  if (cfg?.mermaid !== false) {
    const { MermaidPlugin } = _require('vitepress-plugin-mermaid')
    plugins.push(inlineInjectMermaidClient())
    plugins.push(MermaidPlugin(cfg?.mermaid === true ? {} : (cfg?.mermaid ?? {})))
  }

  // 内置支持RSS
  if (cfg?.RSS) {
    ;[cfg?.RSS].flat().forEach(rssConfig => plugins.push(RssPlugin(rssConfig)))
  }

  // 内置支持 全局公告
  if (cfg?.popover) {
    plugins.push(AnnouncementPlugin(cfg.popover))
  }

  // 内置支持 group icon

  plugins.push(groupIconVitePlugin(cfg?.groupIcon))

  return plugins
}

export function registerVitePlugins(vpCfg: any, plugins: any[]) {
  vpCfg.vite = {
    plugins
  }
}

export function inlineInjectMermaidClient() {
  return {
    name: '@sugarat/theme-plugin-inline-inject-mermaid-client',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('src/index.ts') && code.startsWith('// @sugarat/theme index')) {
        return code
          .replace('// replace-mermaid-import-code', 'import Mermaid from \'vitepress-plugin-mermaid/Mermaid.vue\'')
          .replace('// replace-mermaid-mounted-code', 'if (!ctx.app.component(\'Mermaid\')) { ctx.app.component(\'Mermaid\', Mermaid as any) }')
      }
      return code
    },
  } as PluginOption
}

export function inlineBuildEndPlugin(buildEndFn: any[]) {
  let rewrite = false
  return {
    name: '@sugarar/theme-plugin-build-end',
    enforce: 'pre',
    configResolved(config: any) {
      // 避免重复定义
      if (rewrite) {
        return
      }
      const vitepressConfig: SiteConfig = config.vitepress
      if (!vitepressConfig) {
        return
      }
      rewrite = true
      // 添加 自定义 vitepress build 的钩子
      const selfBuildEnd = vitepressConfig.buildEnd
      vitepressConfig.buildEnd = (siteCfg) => {
        selfBuildEnd?.(siteCfg)
        buildEndFn
          .filter(fn => typeof fn === 'function')
          .forEach(fn => fn(siteCfg))
      }
    }
  }
}

// 支持frontmatter中的相对路径图片自动处理
export function coverImgTransform() {
  let blogConfig: Theme.BlogConfig
  let vitepressConfig: SiteConfig
  let assetsDir: string

  const relativeMetaName: (keyof Theme.PageMeta)[] = ['cover']
  const relativeMeta: Theme.PageMeta[] = []
  const relativeMetaMap: Record<string, Theme.PageMeta> = {}
  const viteAssetsMap: Record<string, string> = {}
  const relativePathMap: Record<string, string> = {}
  return {
    name: '@sugarat/theme-plugin-cover-transform',
    apply: 'build',
    // enforce: 'pre',
    configResolved(config: any) {
      vitepressConfig = config.vitepress
      assetsDir = vitepressConfig.assetsDir
      blogConfig = config.vitepress.site.themeConfig.blog

      const pagesData = [...blogConfig.pagesData]
      // 兼容国际化
      if (vitepressConfig.site.locales && Object.keys(vitepressConfig.site.locales).length > 1 && blogConfig?.locales) {
        Object.values(blogConfig?.locales).map(v => v.pagesData)
          .filter(v => !!v)
          .forEach(v => pagesData.push(...v))
      }
      // 提取所有相对路径的属性
      pagesData.forEach((v) => {
        relativeMetaName.forEach((k) => {
          const value = v.meta[k]
          if (value && typeof value === 'string' && value.startsWith('/')) {
            const absolutePath = `${vitepressConfig.srcDir}${value}`

            // 复用已经映射后的值
            if (relativeMetaMap[absolutePath]) {
              Object.assign(v.meta, { [k]: relativeMetaMap[absolutePath][k] })
              return
            }

            relativePathMap[value] = absolutePath
            relativePathMap[absolutePath] = value
            relativeMeta.push(v.meta)
            relativeMetaMap[absolutePath] = v.meta
          }
        })
      })
    },
    moduleParsed(info) {
      if (!relativePathMap[info.id]) {
        return
      }
      const asset = info.code?.match(/export default "(.*)"/)?.[1]
      if (!asset) {
        return
      }

      viteAssetsMap[info.id] = asset
      viteAssetsMap[asset] = info.id

      // 换成 ViteAssets，影响输出 HTML
      relativeMeta.forEach((meta) => {
        relativeMetaName.forEach((k) => {
          const value = meta[k]
          if (!value || !relativePathMap[value as string]) {
            return
          }
          const viteAsset = viteAssetsMap[relativePathMap[value as string]]
          if (viteAsset) {
            Object.assign(meta, { [k]: viteAsset })
          }
        })
      })
    },
    generateBundle(_: any, bundle: Record<string, any>) {
      // 换成 最终输出路径，影响 CSR 内容
      const assetsMap = Object.entries(bundle).filter(([key]) => {
        return key.startsWith(assetsDir)
      }).map(([_, value]) => {
        return value
      }).filter(v => v.type === 'asset')

      if (!assetsMap.length) {
        return
      }

      relativeMeta.forEach((meta) => {
        relativeMetaName.forEach((k) => {
          const value = meta[k]
          if (!value || !viteAssetsMap[value as string]) {
            return
          }
          const absolutePath = viteAssetsMap[value as string]
          const matchAsset = assetsMap.find(v => joinPath(`${vitepressConfig.srcDir}/`, v.originalFileName) === absolutePath)
          if (matchAsset) {
            Object.assign(meta, { [k]: joinPath('/', matchAsset.fileName) })
          }
        })
      })
    }
  } as PluginOption
}

export function providePageData(cfg: Partial<Theme.BlogConfig>) {
  return {
    name: '@sugarat/theme-plugin-provide-page-data',
    async config(config: any, env) {
      const vitepressConfig: SiteConfig = config.vitepress
      const pagesData = await getArticles(cfg, vitepressConfig)
      if (vitepressConfig.site.locales && Object.keys(vitepressConfig.site.locales).length > 1) {
        if (!vitepressConfig.site.themeConfig.blog.locales) {
          vitepressConfig.site.themeConfig.blog.locales = {}
        }
        // 兼容国际化
        const localeKeys = Object.keys(vitepressConfig.site.locales)
        localeKeys.forEach((localeKey) => {
          if (!vitepressConfig.site.themeConfig.blog.locales[localeKey]) {
            vitepressConfig.site.themeConfig.blog.locales[localeKey] = {}
          }

          vitepressConfig.site.themeConfig.blog.locales[localeKey].pagesData = pagesData.filter((v) => {
            const { route } = v
            const isRoot = localeKey === 'root'
            if (isRoot) {
              return !localeKeys.filter(v => v !== 'root').some(k => route.startsWith(`/${k}`))
            }
            return route.startsWith(`/${localeKey}`)
          })
        })
        if (env.mode === 'production') {
          return
        }
      }
      vitepressConfig.site.themeConfig.blog.pagesData = pagesData
    },
  } as PluginOption
}

export function setThemeScript(
  themeColor: Theme.ThemeColor
) {
  let resolveConfig: any
  const pluginOps: PluginOption = {
    name: '@sugarat/theme-plugin-theme-color-script',
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
      // 通过 head 添加额外的脚本注入
      const selfTransformHead = vitepressConfig.transformHead
      vitepressConfig.transformHead = async (ctx) => {
        const selfHead = (await Promise.resolve(selfTransformHead?.(ctx))) || []
        return selfHead.concat([
          ['script', { type: 'text/javascript' }, `;(function() {
            document.documentElement.setAttribute("theme", "${themeColor}");
          })()`]
        ] as HeadConfig[])
      }
    }
  }
  return pluginOps
}
