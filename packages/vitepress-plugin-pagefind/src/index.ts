import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Buffer } from 'node:buffer'
import type { PluginOption } from 'vite'
import type { HeadConfig, SiteConfig } from 'vitepress'
import { stringify } from 'javascript-stringify'
import matter from 'gray-matter'
import { buildEnd, getFileBirthTime, getPagefindHead } from './node'
import type { PagefindOption, SearchConfig } from './type'

function isESM() {
  return typeof __filename === 'undefined' || typeof __dirname === 'undefined'
}
function getDirname() {
  return isESM() ? path.dirname(fileURLToPath(import.meta.url)) : __dirname
}

const aliasSearchVueFile = `${getDirname()}/../src/Search.vue`

function meta2string(frontmatter: Record<string, any>) {
  return `base64:${Buffer.from(encodeURIComponent(JSON.stringify(frontmatter))).toString('base64')}`
}

export function pagefindPlugin(
  searchConfig: SearchConfig & PagefindOption = {}
): any {
  const virtualModuleId = 'virtual:pagefind'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  let resolveConfig: any
  const pluginOps: PluginOption = {
    name: 'vitepress-plugin-pagefind',
    enforce: 'pre',
    config: () => {
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

      // 添加生成索引的方法
      const selfBuildEnd = vitepressConfig.buildEnd
      vitepressConfig.buildEnd = async (siteConfig: any) => {
        // 调用自己的
        await selfBuildEnd?.(siteConfig)
        await buildEnd(searchConfig)
      }

      // 通过 head 添加额外的脚本注入
      const selfTransformHead = vitepressConfig.transformHead
      vitepressConfig.transformHead = async (ctx) => {
        const selfHead = (await Promise.resolve(selfTransformHead?.(ctx))) || []
        return selfHead.concat(getPagefindHead(ctx.siteData.base) as HeadConfig[])
      }
    },
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    // 文章数据
    load(this, id) {
      if (id !== resolvedVirtualModuleId)
        return

      return `
      import { ref } from 'vue'
      export const searchConfig = ${stringify(searchConfig)}
      `
    },
    // 添加检索的内容标识
    async transform(code, id) {
      // 只检索文章内容
      if (id.endsWith('theme-default/Layout.vue')) {
        return code.replace('<VPContent>', '<VPContent data-pagefind-body>')
      }
      if (id.endsWith('.md')) {
        const { data: frontmatter } = matter(code, {
          excerpt: true
        })
        if (searchConfig?.showDate && !frontmatter.date) {
          frontmatter.date = await getFileBirthTime(id)
        }
        return `${code}\n\n<div style="display:none" data-pagefind-meta="${meta2string(frontmatter)}"></div>`
      }
      return code
    }
  }
  return pluginOps
}

export * from './type'

export { chineseSearchOptimize } from './node'
