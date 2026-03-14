import type { PluginOption } from 'vite'
import { stringify } from 'javascript-stringify'
import type { GiscusPluginOptions } from './type'
import { getDirname } from './util'

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

export * from './type'
