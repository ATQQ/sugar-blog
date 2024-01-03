/* eslint-disable global-require */
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import type { UserConfig } from 'vitepress'
import type { Theme } from '../../composables/config/index'
import { aliasObjectToArray } from './index'

export function getMarkdownPlugins(cfg?: Partial<Theme.BlogConfig>) {
  const markdownPlugin: any[] = []
  // tabs支持,默认开启
  if (cfg?.tabs !== false) {
    markdownPlugin.push(tabsMarkdownPlugin)
  }

  // 添加mermaid markdown 插件
  if (cfg) {
    cfg.mermaid = cfg?.mermaid ?? true
    if (cfg?.mermaid !== false) {
      const { MermaidMarkdown } = require('vitepress-plugin-mermaid')
      markdownPlugin.push(MermaidMarkdown)
    }
  }

  if (cfg) {
    cfg.taskCheckbox = cfg?.taskCheckbox ?? true
    if (cfg.taskCheckbox !== false) {
      markdownPlugin.push(taskCheckboxPlugin(cfg.taskCheckbox))
    }
  }

  return markdownPlugin
}

export function taskCheckboxPlugin(ops: Theme.TaskCheckbox | boolean) {
  return (md: any) => {
    md.use(require('markdown-it-task-checkbox'), ops)
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

/**
 * 流程图支持，配置mermaid
 */
export function assignMermaid(config: any) {
  if (!config?.mermaid)
    return

  if (!config.vite)
    config.vite = {}
  if (!config.vite.plugins)
    config.vite.plugins = []
  const { MermaidPlugin } = require('vitepress-plugin-mermaid')
  config.vite.plugins.push(MermaidPlugin(config.mermaid))
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

export function wrapperCfgWithMermaid(config: UserConfig<Theme.Config>): any {
  // @ts-expect-error
  const extendThemeConfig = (config.extends?.themeConfig?.blog
    || {}) as Theme.BlogConfig

  // 开关支持Mermaid
  const resultConfig
    = extendThemeConfig.mermaid === false
      ? config
      : {
          ...config,
          mermaid:
            extendThemeConfig.mermaid === true ? {} : extendThemeConfig.mermaid
        }
  assignMermaid(resultConfig)
  return resultConfig
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
