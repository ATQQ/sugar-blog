/* eslint-disable global-require */
import { createRequire } from 'module'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import type { UserConfig } from 'vitepress'
import timeline from 'vitepress-markdown-timeline'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import type { Theme } from '../../composables/config/index'
import { aliasObjectToArray } from './index'

export function _require(module: any) {
  return (typeof import.meta?.url !== 'undefined' ? createRequire(import.meta.url) : require)(module)
}

export function getMarkdownPlugins(cfg?: Partial<Theme.BlogConfig>) {
  const markdownPlugin: any[] = []
  // tabs支持,默认开启
  if (cfg?.tabs !== false) {
    markdownPlugin.push(tabsMarkdownPlugin)
  }

  // 添加mermaid markdown 插件
  if (cfg?.mermaid !== false) {
    const { MermaidMarkdown } = _require('vitepress-plugin-mermaid')
    markdownPlugin.push(MermaidMarkdown)
  }

  if (cfg?.taskCheckbox !== false) {
    markdownPlugin.push(taskCheckboxPlugin(typeof cfg?.taskCheckbox === 'boolean' ? {} : cfg?.taskCheckbox))
  }

  if (cfg?.timeline !== false) {
    markdownPlugin.push(timeline)
  }

  markdownPlugin.push(groupIconMdPlugin)

  return markdownPlugin
}

export function taskCheckboxPlugin(ops?: Theme.TaskCheckbox) {
  return (md: any) => {
    md.use(_require('markdown-it-task-checkbox'), ops)
  }
}

export function registerMdPlugins(vpCfg: any, plugins: any[]) {
  if (plugins.length) {
    vpCfg.markdown = {
      config(...rest: any[]) {
        plugins.forEach((plugin) => {
          plugin?.(...rest)
        })
      }
    }
  }
}

export function patchMermaidPluginCfg(config: any) {
  if (!config.vite.resolve)
    config.vite.resolve = {}
  if (!config.vite.resolve.alias)
    config.vite.resolve.alias = {}

  config.vite.resolve.alias = [
    ...aliasObjectToArray({
      ...config.vite.resolve.alias,
      'cytoscape/dist/cytoscape.umd.js': 'cytoscape/dist/cytoscape.esm.js',
      'mermaid': 'mermaid/dist/mermaid.esm.mjs'
    }),
    { find: /^dayjs\/(.*).js/, replacement: 'dayjs/esm/$1' }
  ]
}

export function patchOptimizeDeps(config: any) {
  if (!config.vite.optimizeDeps) {
    config.vite.optimizeDeps = {}
  }
  config.vite.optimizeDeps.exclude = ['vitepress-plugin-tabs', '@sugarat/theme']
  config.vite.optimizeDeps.include = ['element-plus']
}

export function supportRunExtendsPlugin(config: UserConfig<Theme.Config>) {
  // 处理markdown插件
  if (!config.markdown)
    config.markdown = {}
  // 支持运行继承的markdown插件
  // @ts-expect-error
  if (config.extends?.markdown?.config) {
    const markdownExtendsConfigOriginal
      // @ts-expect-error
      = config.extends?.markdown?.config
    const selfMarkdownConfig = config.markdown?.config

    config.markdown.config = (...rest: any[]) => {
      // @ts-expect-error
      selfMarkdownConfig?.(...rest)
      markdownExtendsConfigOriginal?.(...rest)
    }
  }
}
