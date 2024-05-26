import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import type { PluginOption } from 'vite'
import type { SiteConfig } from 'vitepress'
import { stringify } from 'javascript-stringify'
import { getPagesData, pluginSiteConfig } from './node'
import type { PagefindOption, SearchConfig } from './type'

// const okMark = '\x1B[32m✓\x1B[0m'

function isESM() {
  return typeof __filename === 'undefined' || typeof __dirname === 'undefined'
}
function getDirname() {
  return isESM() ? path.dirname(fileURLToPath(import.meta.url)) : __dirname
}

const aliasSearchVueFile = `${getDirname()}/../src/Search.vue`

export function pagefindPlugin(
  searchConfig: SearchConfig & PagefindOption = {}
): any {
  const virtualModuleId = 'virtual:pagefind'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  let resolveConfig: any
  let runCommand: 'build' | 'serve'
  const pluginOps: PluginOption = {
    name: 'vitepress-plugin-pagefind',
    enforce: 'pre',
    config: (_, { command }) => {
      runCommand = command
      return {
        resolve: {
          alias: {
            './VPNavBarSearch.vue': aliasSearchVueFile
          }
        }
      }
    },
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
        const pluginHead
          = (await Promise.resolve(pluginSiteConfig?.transformHead?.(ctx))) || []
        return selfHead.concat(pluginHead)
      }
    },
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    // 文章数据
    async load(this, id) {
      if (id !== resolvedVirtualModuleId)
        return
      const srcDir
        = resolveConfig.vitepress.srcDir
          .replace(resolveConfig.vitepress.root, '')
          .replace(/^\//, '')
        || process.argv.slice(2)?.[1]
        || '.'

      let docsData: any[] = []
      if (runCommand === 'build') {
        docsData = await getPagesData(
          srcDir,
          resolveConfig.vitepress,
          searchConfig
        )
      }

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
