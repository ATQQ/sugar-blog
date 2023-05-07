import type { PluginOption } from 'vite'
import type { SiteConfig } from 'vitepress'
import { stringify } from 'javascript-stringify'
import { pluginSiteConfig, getPagesData } from './node'
import type { SearchConfig, PagefindOption } from './type'

export function pagefindPlugin(
  searchConfig: SearchConfig & PagefindOption = {}
): any {
  const virtualModuleId = 'virtual:pagefind'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  let resolveConfig: any
  const pluginOps: PluginOption = {
    name: 'vitepress-plugin-pagefind',
    enforce: 'pre',
    config: () => ({
      resolve: {
        alias: {
          './VPNavBarSearch.vue': 'vitepress-plugin-pagefind/Search.vue'
        }
      }
    }),
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
        siteConfig = Object.assign(siteConfig || {}, {
          PagefindOption: searchConfig
        })
        pluginSiteConfig?.buildEnd?.(siteConfig)
      }

      const selfTransformHead = vitepressConfig.transformHead
      vitepressConfig.transformHead = async (ctx) => {
        const selfHead = (await Promise.resolve(selfTransformHead?.(ctx))) || []
        const pluginHead =
          (await Promise.resolve(pluginSiteConfig?.transformHead?.(ctx))) || []
        return selfHead.concat(pluginHead)
      }
    },
    async resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    // 文章数据
    load(this, id) {
      if (id !== resolvedVirtualModuleId) return
      const docsData = getPagesData(
        resolveConfig.vitepress.srcDir
          .replace(resolveConfig.vitepress.root, '')
          .replace(/^\//, '')
      )
      return `
      import { ref } from 'vue'
      export const docs = ref(${JSON.stringify(docsData)})
      export const searchConfig = ${stringify(searchConfig)}
      `
    },
    // 添加检索的内容标识
    transform(code, id) {
      // 只检索文章内容
      if (id.endsWith('theme-default/Layout.vue')) {
        return code.replace('<VPContent>', '<VPContent data-pagefind-body>')
      }
      return code
    }
  }
  return pluginOps
}

export * from './type'

export { chineseSearchOptimize } from './node'
