import path from 'path'
import fs from 'node:fs'
import type { MarkdownEnv, ResolvedRouteConfig, SiteConfig, SiteData } from 'vitepress'
import { normalizePath, slash } from './fs'

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
    env: MarkdownEnv
  }[] = []
  // CV https://github.com/ATQQ/vitepress/blob/36bde803c870c62461651e5148e092c893a1c36b/src/node/markdownToVue.ts#L44
  const srcDir = vpConfig.srcDir
  const vitepressDynamicRoutes = new Map(
    vpConfig?.dynamicRoutes?.routes.map(r => [
      r.fullPath,
      slash(path.join(srcDir, r.route))
    ]) || []
  )
  const vitepressRewrites = new Map(
    Object.entries(vpConfig?.rewrites.map || {}).map(([key, value]) => [
      slash(path.join(srcDir, key)),
      slash(path.join(srcDir, value!))
    ]) || []
  )

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

    let file = path.resolve(vpConfig.srcDir, page)
    const fileOrig = vitepressDynamicRoutes.get(file) || file
    file = vitepressRewrites.get(file) || file
    const relativePath = slash(path.relative(srcDir, file))
    const cleanUrls = !!vpConfig.cleanUrls
    const includes: string[] = []
    // processIncludes?
    const localeIndex = getLocaleForPath(vpConfig.site, relativePath)
    const env: MarkdownEnv = {
      path: file,
      relativePath,
      cleanUrls,
      includes,
      realPath: fileOrig,
      localeIndex
    }

    result.push({
      page,
      route,
      isRewrite,
      isDynamic,
      filepath,
      originRoute,
      rewriteRoute,
      dynamicRoute,
      rewritePath,
      env
    })
  }

  return result
}

export function renderDynamicMarkdown(routeFile: string, params: Record<string, any>, content?: string) {
  let baseContent = fs.readFileSync(routeFile, 'utf-8')

  if (content) {
    baseContent = baseContent.replace(/<!--\s*@content\s*-->/, content)
  }

  // 替换 {{$params}} 参数
  return baseContent.replace(/\{\{(.*?)\}\}/g, (all, $1) => {
    const key = $1?.trim?.() || ''
    if (key.startsWith('$params')) {
      const value = key.split('.').reduce((prev: Record<string, any>, curr: string) => {
        if (prev !== null && typeof prev === 'object') {
          return prev[curr]
        }
        return undefined
      }, { $params: params })
      return value
    }
    return all
  })
}

const HASH_RE = /#.*$/
const HASH_OR_QUERY_RE = /[?#].*$/
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/

function normalize(path: string): string {
  return decodeURI(path)
    .replace(HASH_OR_QUERY_RE, '')
    .replace(INDEX_OR_EXT_RE, '$1')
}

export const inBrowser = typeof document !== 'undefined'

export function isActive(
  currentPath: string,
  matchPath?: string,
  asRegex: boolean = false
): boolean {
  if (matchPath === undefined) {
    return false
  }

  currentPath = normalize(`/${currentPath}`)

  if (asRegex) {
    return new RegExp(matchPath).test(currentPath)
  }

  if (normalize(matchPath) !== currentPath) {
    return false
  }

  const hashMatch = matchPath.match(HASH_RE)

  if (hashMatch) {
    return (inBrowser ? location.hash : '') === hashMatch[0]
  }

  return true
}

export function isExternal(path: string): boolean {
  return /^(?:[a-z]+:|\/\/)/i.test(path)
}
export function getLocaleForPath(
  siteData: SiteData | undefined,
  relativePath: string
): string {
  return (
    Object.keys(siteData?.locales || {}).find(
      key =>
        key !== 'root'
          && !isExternal(key)
          && isActive(relativePath, `/${key}/`, true)
    ) || 'root'
  )
}
