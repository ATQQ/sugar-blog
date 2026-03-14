import type { PluginOption } from 'vite'
import type { HeadConfig, SiteConfig } from 'vitepress'
import { stringify } from 'javascript-stringify'
import type { ArtalkPluginOptions } from './type'
import { getDirname } from './util'

const componentName = 'ArtalkComment'
const componentFile = `${componentName}.vue`
const aliasComponentFile = `${getDirname()}/components/${componentFile}`

const virtualModuleId = 'virtual:artalk-plugin-options'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

// Inject into doc-after slot
const slots = ['doc-after']

export function artalkPlugin(options?: ArtalkPluginOptions): PluginOption {
  const componentOptions: ArtalkPluginOptions = {
    ...options
  } as ArtalkPluginOptions

  let resolveConfig: any
  let vitepressConfig: SiteConfig

  const pluginOps: PluginOption = {
    name: 'vitepress-plugin-artalk',
    enforce: 'pre',
    configResolved(config: any) {
      if (resolveConfig) {
        return
      }
      resolveConfig = config

      vitepressConfig = config.vitepress
      if (!vitepressConfig) {
        return
      }

      const selfTransformPageData = vitepressConfig.transformPageData
      vitepressConfig.transformPageData = async (pageData, ctx) => {
        pageData.frontmatter.head ??= []
        pageData.frontmatter.head.push(...getArtalkScriptHead(options))
        return selfTransformPageData?.(pageData, ctx)
      }
    },
    config: () => {
      return {
        resolve: {
          alias: {
            [`./${componentFile}`]: aliasComponentFile
          }
        }
      }
    },
    transform(code, id) {
      // Inject into standard VitePress Default Theme Layout
      if (id.endsWith('vitepress/dist/client/theme-default/Layout.vue')) {
        let transformResult = code

        for (const element of slots) {
          const slotPosition = `<slot name="${element}" />`
          // Append component after the slot
          transformResult = transformResult.replace(slotPosition, `${slotPosition}<ClientOnly><${componentName} /></ClientOnly>`)
        }

        const setupPosition = '<script setup lang="ts">'
        transformResult = transformResult.replace(setupPosition, `${setupPosition}\nimport ${componentName} from './${componentName}.vue'`)
        return transformResult
      }
    },
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(this, id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${stringify(componentOptions)}`
      }
    },
  }
  return pluginOps
}

function getArtalkScriptHead(options?: ArtalkPluginOptions): HeadConfig[] {
  if (!options?.server) {
    return []
  }
  const { server } = options
  return [
    ['link', { href: `${server}/dist/Artalk.css`, rel: 'stylesheet' }],
    ['script', { src: `${server}/dist/Artalk.js`, id: 'artalk-script' }]
  ]
}

export * from './type'
