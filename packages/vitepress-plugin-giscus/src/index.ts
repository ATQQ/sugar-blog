import type { PluginOption } from 'vite'
import { stringify } from 'javascript-stringify'
import type { GiscusPluginOptions } from './type'
import { getDirname } from './util'
import { createSlotInjectPlugin } from '@sugarat/theme-shared'

const componentName = 'GiscusComment'
const componentFile = `${componentName}.vue`
const aliasComponentFile = `${getDirname()}/components/${componentFile}`

const virtualModuleId = 'virtual:giscus-plugin-options'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

// Inject into doc-after slot
const slots = ['doc-after']

export function giscusPlugin(options?: GiscusPluginOptions): PluginOption {
  const componentOptions: GiscusPluginOptions = {
    ...options
  } as GiscusPluginOptions

  const pluginOps: PluginOption = {
    // 向 VitePress 默认主题 Layout.vue 注入组件（基于 @vue/compiler-sfc，兼容 VitePress 1.x/2.x）
    ...createSlotInjectPlugin('GiscusComment', slots, { wrapper: 'ClientOnly' }),
    name: 'vitepress-plugin-giscus',
    enforce: 'pre',
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

export * from './type'
