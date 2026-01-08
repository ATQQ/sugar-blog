import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PluginOption } from 'vite'
import { stringify } from 'javascript-stringify'
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
    transform(code, id) {
      // 筛选出 Layout.vue
      if (id.endsWith('vitepress/dist/client/theme-default/Layout.vue')) {
        let transformResult = code

        // 插入组件
        const slots = [options.slots || ['doc-before', 'page-top']].flat()
        for (const slot of slots) {
          const slotPosition = `<slot name="${slot}" />`
          transformResult = transformResult.replace(slotPosition, `${slotPosition}\n<ClientOnly><${componentName} /></ClientOnly>`)
        }

        // 导入组件
        const setupPosition = '<script setup lang="ts">'
        transformResult = transformResult.replace(setupPosition, `${setupPosition}\nimport ${componentName} from './${componentFile}'`)
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
        return `export default ${stringify(options)}`
      }
    },
  }
  return pluginOps
}

export * from './type'
