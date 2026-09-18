import type { PluginOption } from 'vite'
import { stringify } from 'javascript-stringify'
import { createSlotInjectPlugin } from '@sugarat/theme-shared'
import type { BackToTopPluginOptions } from './type'
import { getDirname } from './util'

const componentName = 'BackToTop'
const componentFile = `${componentName}.vue`
const aliasComponentFile = `${getDirname()}/components/${componentFile}`

const virtualModuleId = 'virtual:back2top-plugin-options'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

// Inject into doc-after slot
const slots = ['doc-after']

export function back2topPlugin(options?: BackToTopPluginOptions): PluginOption {
  const componentOptions: BackToTopPluginOptions = {
    ...options
  }

  const pluginOps: PluginOption = {
    // 向 VitePress 默认主题 Layout.vue 注入组件（基于 @vue/compiler-sfc，兼容 VitePress 1.x/2.x）
    ...createSlotInjectPlugin(componentName, slots, {
      wrapper: 'ClientOnly'
    }),
    name: 'vitepress-plugin-back2top',
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
