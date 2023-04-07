import type { PluginOption } from 'vite'
import { buildEnd, getPagesData } from './node'

const docsData = getPagesData()

export interface SearchConfig {
  /**
   * @default
   * 'Search'
   */
  btnPlaceholder?: string
  /**
   * @default
   * 'Search Docs'
   */
  placeholder?: string
  /**
   * @default
   * 'No results found.'
   */
  emptyText?: string
  /**
   * @default
   * 'Total: {{searchResult}} search results.'
   */
  heading?: string
}

export function pagefindPlugin(searchConfig: SearchConfig = {}): any {
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

      // 添加 vitepress 的钩子
      const selfBuildEnd = config.vitepress.buildEnd
      config.vitepress.buildEnd = (siteConfig: any) => {
        // 调用自己的
        selfBuildEnd?.(siteConfig)
        buildEnd(siteConfig)
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
      return `
      import { ref } from 'vue'
      export const docs = ref(${JSON.stringify(docsData)})
      export const searchConfig = ${JSON.stringify(searchConfig)}
      `
    },
    // 添加检索的内容标识
    transform(code, id) {
      if (id.endsWith('theme-default/Layout.vue')) {
        return code.replace('<VPContent>', '<VPContent data-pagefind-body>')
      }
      return code
    }
  }
  return pluginOps
}
