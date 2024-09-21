import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PluginOption } from 'vite'
import { stringify } from 'javascript-stringify'
import type { AnnouncementOptions } from './type'

function isESM() {
  return typeof __filename === 'undefined' || typeof __dirname === 'undefined'
}
function getDirname() {
  return isESM() ? path.dirname(fileURLToPath(import.meta.url)) : __dirname
}

const componentName = 'Announcement'
const componentFile = `${componentName}.vue`
const aliasComponentFile = `${getDirname()}/components/${componentFile}`
const virtualModuleId = 'virtual:announcement-options'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

export function AnnouncementPlugin(options: AnnouncementOptions): any {
  const componentOptions: AnnouncementOptions = {
    clientOnly: false,
    duration: 0,
    mobileMinify: false,
    reopen: true,
    twinkle: false,
    ...options
  }
  const pluginOps: PluginOption = {
    name: 'vitepress-plugin-announcement',
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
      // 使用 官方 Layout.vue 直接插入组件
      if (id.endsWith('vitepress/dist/client/theme-default/Layout.vue')) {
        // 插入自定义组件
        const slotPosition = '<slot name="layout-top" />'
        let transformResult = code.replace(slotPosition, `${slotPosition}<Announcement/>`)

        if (componentOptions.clientOnly) {
          transformResult = transformResult.replace('<Announcement/>', '<ClientOnly><Announcement/></ClientOnly>')
        }

        // 导入自定义组件
        const setupPosition = '<script setup lang="ts">'
        transformResult = transformResult.replace(setupPosition, `${setupPosition}\nimport Announcement from './Announcement.vue'`)
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
        // 动态模块处理
        return `export default ${stringify(componentOptions)}`
      }
    },
  }
  return pluginOps
}

export * from './type'
