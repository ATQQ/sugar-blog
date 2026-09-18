import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PluginOption } from 'vite'
import { stringify } from 'javascript-stringify'
import { createSlotInjectPlugin } from '@sugarat/theme-shared'
import type { ImagePreviewOptions } from './type'

function isESM() {
  return typeof __filename === 'undefined' || typeof __dirname === 'undefined'
}
function getDirname() {
  return isESM() ? path.dirname(fileURLToPath(import.meta.url)) : __dirname
}

const componentName = 'ImagePreview'
const componentFile = `${componentName}.vue`
const aliasComponentFile = `${getDirname()}/components/${componentFile}`
const virtualModuleId = 'virtual:image-preview-options'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

export function ImagePreviewPlugin(options: ImagePreviewOptions = {}): any {
  const pluginOps: PluginOption = {
    // 向 VitePress 默认主题 Layout.vue 注入组件（基于 @vue/compiler-sfc，兼容 VitePress 1.x/2.x）
    ...createSlotInjectPlugin(componentName, [options.slots || ['doc-before', 'page-top']].flat(), {
      wrapper: 'ClientOnly'
    }),
    name: 'vitepress-plugin-image-preview',
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
        return `export default ${stringify(options)}`
      }
    },
  }
  return pluginOps
}

export * from './type'
