import type { PluginOption } from 'vite'
import type { HeadConfig, SiteConfig } from 'vitepress'
import { stringify } from 'javascript-stringify'
import type { ArtalkPluginOptions } from './type'
import { getDirname } from './util'
import { createSlotInjectPlugin } from '@sugarat/theme-shared'

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
    // 向 VitePress 默认主题 Layout.vue 注入组件（基于 @vue/compiler-sfc，兼容 VitePress 1.x/2.x）
    ...createSlotInjectPlugin('ArtalkComment', slots, { wrapper: 'ClientOnly' }),
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
