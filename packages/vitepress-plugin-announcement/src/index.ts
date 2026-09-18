import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PluginOption } from 'vite'
import { stringify } from 'javascript-stringify'
import type { AnnouncementOptions } from './type'
import { createSlotInjectPlugin } from '@sugarat/theme-shared'

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
    // 向 VitePress 默认主题 Layout.vue 注入组件（基于 @vue/compiler-sfc，兼容 VitePress 1.x/2.x）
    ...createSlotInjectPlugin('Announcement', ['layout-top'], componentOptions.clientOnly ? { wrapper: 'ClientOnly' } : {}),
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
