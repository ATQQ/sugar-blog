import path from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { Buffer } from 'node:buffer'
import type { HeadConfig, SiteConfig } from 'vitepress'
import {
  pagefindPlugin
} from 'vitepress-plugin-pagefind'
import { RssPlugin } from 'vitepress-plugin-rss'
import type { PluginOption } from 'vite'
import { joinPath } from '@sugarat/theme-shared'
import type { Theme } from '../../composables/config/index'
import { _require } from './mdPlugins'
import { themeReloadPlugin } from './hot-reload-plugin'
import { getArticles } from './theme'

export function getVitePlugins(cfg: Partial<Theme.BlogConfig> = {}) {
  const plugins: any[] = []

  // 处理cover image的路径（暂只支持自动识别的文章首图）
  plugins.push(coverImgTransform())

  // 处理自定义主题色
  if (cfg.themeColor) {
    plugins.push(setThemeScript(cfg.themeColor))
  }
  // 自动重载首页
  plugins.push(themeReloadPlugin())

  // 主题pageData生成
  plugins.push(providePageData(cfg))

  // 内置简化版的pagefind
  if (cfg && cfg.search !== false) {
    const ops = cfg.search instanceof Object ? cfg.search : {}
    plugins.push(
      pagefindPlugin({
        ...ops,
      })
    )
  }

  // 内置支持Mermaid
  if (cfg?.mermaid !== false) {
    const { MermaidPlugin } = _require('vitepress-plugin-mermaid')
    plugins.push(inlineInjectMermaidClient())
    plugins.push(MermaidPlugin(cfg?.mermaid === true ? {} : (cfg?.mermaid ?? {})))
  }

  // 内置支持RSS
  if (cfg?.RSS) {
    ;[cfg?.RSS].flat().forEach(rssConfig => plugins.push(RssPlugin(rssConfig)))
  }
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

// TODO: 支持frontmatter中的相对路径图片自动处理
export function coverImgTransform() {
  let blogConfig: Theme.BlogConfig
  let vitepressConfig: SiteConfig
  let assetsDir: string
  return {
    name: '@sugarat/theme-plugin-cover-transform',
    apply: 'build',
    enforce: 'pre',
    configResolved(config: any) {
      vitepressConfig = config.vitepress
      assetsDir = vitepressConfig.assetsDir
      blogConfig = config.vitepress.site.themeConfig.blog
    },
    async generateBundle(_: any, bundle: Record<string, any>) {
      const assetsMap = Object.entries(bundle).filter(([key]) => {
        return key.startsWith(assetsDir)
      }).map(([_, value]) => {
        return value
      })
      for (const page of blogConfig.pagesData) {
        const { cover } = page.meta
        // 是否相对路径引用
        if (!cover?.startsWith?.('/')) {
          continue
        }
        try {
          // 寻找构建后的
          const realPath = path.join(vitepressConfig.root, cover)
          if (!existsSync(realPath)) {
            continue
          }
          const fileBuffer = readFileSync(realPath)
          const matchAsset = assetsMap.find(v => Buffer.compare(fileBuffer, v.source) === 0)
          if (matchAsset) {
            page.meta.cover = joinPath('/', matchAsset.fileName)
          }
        }
        catch (e: any) {
          vitepressConfig.logger.warn(e?.message)
        }
      }
    }
  }
}

export function providePageData(cfg: Partial<Theme.BlogConfig>) {
  return {
    name: '@sugarat/theme-plugin-provide-page-data',
    async config(config: any) {
      const pagesData = await getArticles(cfg, config.vitepress)
      config.vitepress.site.themeConfig.blog.pagesData = pagesData
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
