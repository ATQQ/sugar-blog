import path from 'path'
import type { ResolvedRouteConfig, SiteConfig } from 'vitepress'
import { normalizePath } from './fs'

export function getVitePressPages(vpConfig: SiteConfig) {
  // 复用内置 pages 解析逻辑，同时兼容动态路由
  const { pages, dynamicRoutes, rewrites } = vpConfig
  const result: {
    page: string
    route: string
    isRewrite: boolean
    isDynamic: boolean
    filepath: string
    originRoute: string
    rewriteRoute: string
    dynamicRoute?: ResolvedRouteConfig
    rewritePath?: string
  }[] = []
  for (const page of pages) {
    const rewritePath = rewrites.map[page]
    const isRewrite = !!rewritePath
    const originRoute = `/${normalizePath(page)
        .replace(/\.md$/, '')}`
    const rewriteRoute = rewritePath
      ? `/${normalizePath(rewritePath)
        .replace(/\.md$/, '')}`
      : ''
    const dynamicRoute = dynamicRoutes?.routes?.find(r => r.path === page)
    const isDynamic = !!dynamicRoute

    const route = rewriteRoute || originRoute
    const filepath = isDynamic
      ? normalizePath(path.resolve(vpConfig.srcDir, dynamicRoute.route))
      : normalizePath(`${vpConfig.srcDir}/${page}`)

    result.push({
      page,
      route,
      isRewrite,
      isDynamic,
      filepath,
      originRoute,
      rewriteRoute,
      dynamicRoute,
      rewritePath
    })
  }

  return result
}
