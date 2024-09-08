import type { PluginOption } from 'vite'
import type { HeadConfig, SiteConfig } from 'vitepress'
import type { LA51PluginOptions } from './type'

export function La51Plugin(options: LA51PluginOptions): any {
  let resolveConfig: any
  let vitepressConfig: SiteConfig

  const { apply = 'build' } = options
  const pluginOps: PluginOption = {
    name: 'vitepress-plugin-51la',
    enforce: 'pre',
    ...apply === 'all' ? {} : { apply },
    configResolved(config: any) {
      if (resolveConfig) {
        return
      }
      resolveConfig = config

      vitepressConfig = config.vitepress
      if (!vitepressConfig) {
        return
      }

      // https://vitepress.dev/zh/reference/site-config#transformhead
      // 通过 head 添加额外的脚本注入，仅在 build 时生效
      // const selfTransformHead = vitepressConfig.transformHead
      // vitepressConfig.transformHead = async (ctx) => {
      //   const selfHead = (await Promise.resolve(selfTransformHead?.(ctx))) || []
      //   return selfHead.concat(get51LaScriptHead(options))
      // }

      const selfTransformPageData = vitepressConfig.transformPageData
      vitepressConfig.transformPageData = async (pageData, ctx) => {
        pageData.frontmatter.head ??= []
        pageData.frontmatter.head.push(...get51LaScriptHead(options))
        return selfTransformPageData?.(pageData, ctx)
      }
    }
  }
  return pluginOps
}

export function get51LaScriptHead(options: LA51PluginOptions): HeadConfig[] {
  const { id, ck, importMode = 'sync', autoTrack = false, hashMode = true, screenRecord = false, sdk = '//sdk.51.la/js-sdk-pro.min.js', prefix } = options
  if (!id || !ck) {
    return []
  }

  // 移除 undefined 的属性
  const config = JSON.parse(JSON.stringify({
    id,
    ck,
    ...{
      autoTrack: autoTrack || undefined,
      hashMode: hashMode || undefined,
      screenRecord: screenRecord || undefined,
      prefix
    }
  }))

  if (importMode === 'async') {
    return [
      [
        'script',
        {},
        `!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","${sdk.replace(/^.*\/\//, '')}"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}(${JSON.stringify(config)});`
      ]
    ]
  }

  if (importMode === 'old') {
    return [
      [
        'script',
        {
          charset: 'UTF-8',
          id: 'LA_COLLECT',
          src: `${sdk}?${new URLSearchParams(config).toString()}`
        },
      ]
    ]
  }

  return [
    [
      'script',
      {
        charset: 'UTF-8',
        id: 'LA_COLLECT',
        src: sdk
      }
    ],
    [
      'script',
      {},
      `typeof LA !== 'undefined' && LA.init(${JSON.stringify(config)})`
    ]
  ]
}

export * from './type'
