import { Buffer } from 'node:buffer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import process from 'node:process'
import type { PluginOption } from 'vite'
import type { HeadConfig, SiteConfig } from 'vitepress'
import { stringify } from 'javascript-stringify'
import { getFileLastModifyTime, grayMatter, joinPath } from '@sugarat/theme-shared'
import { buildEnd, getPagefindHead } from './node'
import type { PagefindOption, SearchConfig } from './type'

function isESM() {
  return typeof __filename === 'undefined' || typeof __dirname === 'undefined'
}
function getDirname() {
  return isESM() ? path.dirname(fileURLToPath(import.meta.url)) : __dirname
}

const aliasSearchVueFile = `${getDirname()}/../src/Search.vue`

export function meta2string(frontmatter: Record<string, any>) {
  return `base64:${Buffer.from(encodeURIComponent(JSON.stringify(frontmatter))).toString('base64')}`
}

export function pagefindPlugin(
  searchConfig: SearchConfig & PagefindOption = {}
): any {
  const virtualModuleId = 'virtual:pagefind'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  let resolveConfig: any
  let vitepressConfig: SiteConfig
  let dynamicRoutes: SiteConfig['dynamicRoutes']
  const pluginOps: PluginOption = {
    name: 'vitepress-plugin-pagefind',
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
      if (searchConfig.manual) {
        return
      }
      if (resolveConfig) {
        return
      }
      resolveConfig = config

      vitepressConfig = config.vitepress
      dynamicRoutes = vitepressConfig.dynamicRoutes
      if (!vitepressConfig) {
        return
      }

      // 添加生成索引的方法
      const selfBuildEnd = vitepressConfig.buildEnd
      vitepressConfig.buildEnd = async (siteConfig: any) => {
        // 调用自己的
        await selfBuildEnd?.(siteConfig)
        await buildEnd(searchConfig, siteConfig)
        const okMark = '\x1B[32m✓\x1B[0m'
        console.log(`${okMark} generating pagefind Indexing...`)
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
    load(this, id) {
      if (id !== resolvedVirtualModuleId)
        return

      // 动态模块处理
      return `
      import { ref } from 'vue'
      export const searchConfig = ${stringify(searchConfig)}
      `
    },
    // 添加检索的内容标识
    async transform(code, id, options) {
      if (!id.includes('.md')) {
        return code
      }
      let { searchParams, pathname, protocol } = new URL(id, 'file:')
      pathname = decodeURIComponent(pathname)
      if (!pathname.endsWith('.md')) {
        return code
      }

      // 兼容 动态 路由
      const isWindows = process.platform === 'win32'
      const fullPath = isWindows ? `${protocol}${pathname}` : pathname
      const dynamicRoute = dynamicRoutes.routes.find(route => fullPath.toLowerCase() === route.fullPath.toLowerCase())
      const isDynamicRoute = !!dynamicRoute
      const filepath = isDynamicRoute ? joinPath(vitepressConfig.srcDir, `/${dynamicRoute.route}`) : pathname
      const isExist = fs.existsSync(filepath)
      if (!isExist) {
        this.warn(`${id}: not parse ${filepath} please contact the author for assistance`)
        return code
      }
      // 兼容 setup lang="ts"
      if (!searchParams.size || searchParams.has('lang.ts')) {
        const fileContent = await fs.promises.readFile(filepath, 'utf-8')
        const { data: frontmatter, content } = grayMatter(fileContent, {
          excerpt: true
        })

        // 不检索空内容页
        if (!content.trim()) {
          return code
        }

        // 指定标志的不检索
        if (frontmatter['pagefind-indexed'] === false) {
          return code
        }
        // 添加检索标志
        const attrs: Record<string, any> = {
          'data-pagefind-body': true
        }

        if (!searchConfig.manual) {
          // 添加 frontmatter 元数据
          frontmatter.date = +new Date(frontmatter.date || await getFileLastModifyTime(id))

          // 没有filter则不插入额外的 meta
          if (typeof searchConfig.filter === 'function') {
            attrs['data-pagefind-meta'] = meta2string(frontmatter)
          }
        }

        if (!code.includes(options?.ssr ? '_push(`' : '_createElementBlock("div", null')) {
          // 兼容 setup lang="ts"
          if (!code.includes(`${id}?vue&type=script&setup=true&lang.ts`)) {
            this.warn(`${options?.ssr ? 'SSR' : 'Client'} ${id} may not be a valid file, will not be indexed, please contact the author for assistance`)
          }
          return code
        }

        if (options?.ssr) {
          return code.replace('_push(`', `Object.assign(_attrs, ${stringify(attrs)});_push(\``)
        }
        return code.replace('_createElementBlock("div", null', `_createElementBlock("div", ${stringify(attrs)}`)
      }
      return code
    }
  }
  return pluginOps
}

export * from './type'

export { chineseSearchOptimize } from './node'
export { formatShowDate } from './utils/index'
