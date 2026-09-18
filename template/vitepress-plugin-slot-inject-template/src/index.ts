import type { PluginOption } from 'vite'
import { stringify } from 'javascript-stringify'
import { createSlotInjectPlugin } from '@sugarat/theme-shared'
import type { TemplatePluginOptions } from './type'
import { getDirname } from './util'

// TODO：导入的组件名，请按实际情况修改
const componentName = 'ParentDemo'

const componentFile = `${componentName}.vue`
const aliasComponentFile = `${getDirname()}/components/${componentFile}`

// TODO：虚拟模块名字，按实际情况修改
const virtualModuleId = 'virtual:slot-inject-template-options'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

// TODO：要插入的位置，按实际情况修改
// https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
const slots = ['layout-bottom']

export function templatePlugin(options?: TemplatePluginOptions): any {
  const componentOptions: TemplatePluginOptions = {
    // TODO：默认值，按实际情况修改
    title: '',
    ...options
  }
  const pluginOps: PluginOption = {
    // 向 VitePress 默认主题 Layout.vue 注入组件（基于 @vue/compiler-sfc，兼容 VitePress 1.x/2.x）
    ...createSlotInjectPlugin(componentName, slots),
    // TODO：插件名，按实际情况修改
    name: 'vitepress-plugin-slot-inject-template',
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
        // TODO：传入需要的配置
        return `export default ${stringify(componentOptions)}`
      }
    },
  }
  return pluginOps
}

export * from './type'
