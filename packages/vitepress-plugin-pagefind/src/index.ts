// @ts-nocheck
/* eslint-disable prefer-rest-params */
import { execSync } from 'child_process'
import path from 'path'
import { getPagesData } from './node'

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
  let flag = true
  let originLog = null
  return {
    name: 'vitepress-plugin-pagefind',
    enforce: 'pre',
    config: () => ({
      resolve: {
        alias: {
          './VPNavBarSearch.vue': 'vitepress-plugin-pagefind/Search.vue'
        }
      }
    }),

    // eslint-disable-next-line consistent-return
    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    // 文章数据
    load(this, id) {
      if (id !== resolvedVirtualModuleId) return
      // eslint-disable-next-line consistent-return
      return `
      import { ref } from 'vue'
      export const docs = ref(${JSON.stringify(docsData)})
      export const searchConfig = ${JSON.stringify(searchConfig)}
      `
    },
    // 调用pagefind
    buildEnd() {
      const { log } = console
      // hack
      if (flag) {
        flag = false
        originLog = log
        Object.defineProperty(console, 'log', {
          value() {
            // eslint-disable-next-line prefer-rest-params
            if (`${arguments[0]}`.includes('build complete')) {
              console.log = originLog
              setTimeout(() => {
                originLog()
                originLog('=== pagefind: https://pagefind.app/ ===')
                const command = `npx pagefind --source ${path.join(
                  process.argv.slice(2)?.[1] || '.',
                  '.vitepress/dist'
                )}`
                originLog(command)
                originLog()
                execSync(command, {
                  stdio: 'inherit'
                })
              }, 100)
            }
            // @ts-ignore
            return log.apply(this, arguments)
          }
        })
      }
    },
    // 添加检索的内容标识
    transform(code, id) {
      if (id.endsWith('theme-default/Layout.vue')) {
        return code.replace('<VPContent>', '<VPContent data-pagefind-body>')
      }
      return code
    }
  }
}
