import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import type { SiteConfig } from 'vitepress'
import { Feed } from 'feed'
import type { Author, Category, Enclosure, Item } from 'feed'
import {
  debugTime,
  formatDate,
  getDefaultTitle,
  getFileLastModifyTime,
  getTextSummary,
  getVitePressPages,
  grayMatter,
  joinPath,
  normalizePath,
  normalizeUrl,
  renderDynamicMarkdown
} from '@sugarat/theme-shared'

// @ts-expect-error
import container from 'markdown-it-container'
import type { PostInfo, RSSOptions } from './type'
import { injectStyle, removeZeroWidthSpace, svgToBase64, svgToUrl } from './transform'

const imageRegex = /!\[.*?\]\((.*?)\s*(".*?")?\)/

// 使用文件缓存，避免内存占用
const htmlCache = new Map<string, string | undefined>()

// 将空数组标准化为 undefined，方便下游可选字段处理
function emptyArrayToUndefined<T>(arr?: T[]): T[] | undefined {
  return arr?.length ? arr : undefined
}

function normalizeEnclosure(frontmatter: Record<string, any>): Enclosure | undefined {
  const enclosureObj = frontmatter?.enclosure
  // 字符串
  if (typeof enclosureObj === 'string') {
    return {
      url: enclosureObj,
    }
  }
  // 对象
  if (enclosureObj?.url) {
    return {
      url: enclosureObj.url,
      length: enclosureObj?.length || 0,
      type: enclosureObj?.type,
      title: enclosureObj?.title,
      duration: enclosureObj?.duration
    }
  }
  // 拆分字段形式
  if (frontmatter?.enclosure_url) {
    return {
      url: frontmatter.enclosure_url,
      length: frontmatter?.enclosure_length || 0,
      type: frontmatter?.enclosure_type,
      title: frontmatter?.enclosure_title,
      duration: frontmatter?.enclosure_duration
    }
  }
  return undefined
}

// 文件系统缓存相关函数
function stringifyForHash(val: any): string {
  return JSON.stringify(val, (k, v) => {
    if (typeof v === 'function')
      return v.toString()
    if (v instanceof RegExp)
      return v.toString()
    return v
  })
}

function getCacheKey(config: SiteConfig, rssOptions: RSSOptions, filepath: string, content: string, url?: string): string {
  const basename = url ? path.basename(url) : path.basename(filepath)
  const markdownStr = stringifyForHash(config?.markdown || {})
  const rssOpsStr = stringifyForHash(rssOptions || {})
  const payload = `${basename}|${markdownStr}|${rssOpsStr}`
  const hash = crypto.createHash('md5').update(`${content}|${payload}`).digest('hex')
  return `${basename}_${hash}.html`
}

async function getCacheDir(config: SiteConfig): Promise<string> {
  const cacheDir = path.join(config.cacheDir || path.join(config.root, '.vitepress/cache'), 'rss')
  await fs.promises.mkdir(cacheDir, { recursive: true })
  return cacheDir
}

async function getCachedHtml(config: SiteConfig, rssOptions: RSSOptions, filepath: string, content: string, url?: string): Promise<string | null> {
  try {
    const cacheDir = await getCacheDir(config)
    const cacheKey = getCacheKey(config, rssOptions, filepath, content, url)
    const cachePath = path.join(cacheDir, cacheKey)

    // 检查缓存文件是否存在，直接对比文件名
    if (fs.existsSync(cachePath)) {
      const cachedHtml = await fs.promises.readFile(cachePath, 'utf-8')
      return cachedHtml
    }
  }
  catch (error) {
    // 缓存读取失败，继续正常流程
  }
  return null
}

async function setCachedHtml(config: SiteConfig, rssOptions: RSSOptions, filepath: string, content: string, html: string, url?: string): Promise<void> {
  try {
    const cacheDir = await getCacheDir(config)
    const cacheKey = getCacheKey(config, rssOptions, filepath, content, url)
    const cachePath = path.join(cacheDir, cacheKey)

    await fs.promises.writeFile(cachePath, html, 'utf-8')
  }
  catch (error) {
    // 缓存写入失败，不影响正常流程
  }
}

async function getMdRender(config: SiteConfig, rssOptions: RSSOptions) {
  const { createMarkdownRenderer, disposeMdItInstance } = await import('vitepress')
  // 重载配置
  const mdOptions = {
    ...config.markdown,
    // 默认行号（RSS 样式会渲染异常）
    lineNumbers: false,
    ...rssOptions.markdownOptions
  }
  // 释放之前的实例
  disposeMdItInstance()
  const md = await createMarkdownRenderer(
    config.srcDir,
    mdOptions,
    config.site.base,
    config.logger
  )

  // code-group 问题
  // https://github.com/oxc-project/oxc-project.github.io/blob/main/.vitepress/config/rss.ts
  // Wrap code groups with <table>s
  // Reference: https://github.com/vuejs/vitepress/blob/179ee6/src/node/markdown/plugins/preWrapper.ts#L8
  md.use((md) => {
    const fence = md.renderer.rules.fence!
    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args
      const token = tokens[idx]

      const title = token.info.match(/\[(.*)\]/)?.[1]
      // Code blocks in a code group have titles
      return title == null
        ? fence(...args)
        : '<tr>' + `<td>${title}</td>` + `<td>${fence(...args)}</td>` + '</tr>'
    }
  })
  // Override https://github.com/vuejs/vitepress/blob/179ee6/src/node/markdown/plugins/containers.ts#L26
  md.use(container, 'code-group', {
    render(tokens: any[], idx: number) {
      return tokens[idx].nesting === 1 ? '<table><tbody>' : '</tbody></table>\n'
    },
  })
  return md
}

let cachePageData: ReturnType<typeof getVitePressPages>
export async function getPostsData(
  config: SiteConfig,
  rssOptions: RSSOptions,
  assetsMap: any[] = []
) {
  const endParseConfig = debugTime('endParseConfig')
  const { ignoreHome = true, ignorePublish = false, renderHTML = true, assetsBaseUrl = rssOptions.baseUrl } = rssOptions
  // 能缓存复用的缓存
  if (!cachePageData) {
    cachePageData = getVitePressPages(config)
  }
  endParseConfig()

  let posts: PostInfo[] = []
  const fileContentPromises = cachePageData.reduce((prev, f) => {
    const { isDynamic, dynamicRoute, filepath } = f
    const contentPromise = (isDynamic && dynamicRoute)
      ? Promise.resolve(renderDynamicMarkdown(filepath, dynamicRoute?.params, dynamicRoute?.content))
      : fs.promises.readFile(filepath, 'utf-8')

    prev[f.page] = {
      contentPromise,
      datePromise: getFileLastModifyTime(f.filepath, config.cacheDir)
    }
    return prev
  }, {} as Record<string, { contentPromise: Promise<string>; datePromise: Promise<Date | undefined> | undefined | Date }>)

  const endParsePageData = debugTime('endParsePageData')
  for (const page of cachePageData) {
    const { contentPromise, datePromise } = fileContentPromises[page.page]
    let fileContent = await contentPromise

    const { data: frontmatter, excerpt, content } = grayMatter(fileContent, {
      excerpt: true
    })

    if (!frontmatter.title) {
      frontmatter.title = getDefaultTitle(content)
    }
    // fix: title set number case cdata.replace error
    frontmatter.title = `${frontmatter.title}`

    const date = await (frontmatter.date || datePromise)
    frontmatter.date = formatDate(date)

    frontmatter.published = frontmatter.published && formatDate(frontmatter.published)

    // 获取摘要信息
    frontmatter.description
      // eslint-disable-next-line no-await-in-loop
      = (await rssOptions?.renderExpect?.(content, { ...frontmatter }))
      ?? (frontmatter.description || excerpt || getTextSummary(content, 100))

    // 获取封面图
    frontmatter.cover
      = (frontmatter.cover
        ?? (fileContent.match(imageRegex)?.[1])) || ''

    const relativeImages = getRelativeImagesFromFileContent(content, page.filepath.replace(config.srcDir, ''))
    if (relativeImages.length > 0) {
      // render 替换 assets
      relativeImages.forEach((v) => {
        const [originValue, relativePath] = v
        const absolutePath = joinPath(config.srcDir, `/${relativePath}`)
        const asset = assetsMap.find((item) => {
          const assetPath = joinPath(config.srcDir, `/${item.originalFileName}`)
          return assetPath === absolutePath
        })
        if (asset) {
          const imageUrl = normalizeUrl(`${assetsBaseUrl}${joinPath('/', asset.fileName)}`)
          v.push(imageUrl)
          fileContent = fileContent.replaceAll(originValue, imageUrl)
        }
      })
    }
    if (frontmatter.cover) {
      const exist = relativeImages.find(v => v[0] === frontmatter.cover)
      if (exist) {
        frontmatter.cover = exist[2]
      }
    }
    const targetPage = normalizePath(
      page.rewritePath ? page.rewritePath : page.page
    )
    const url
      = joinPath(config.site.base, targetPage)
        .replace(/(^|\/)index\.md$/, '$1')
        .replace(/\.md$/, config.cleanUrls ? '' : '.html')

    posts.push({
      filepath: page.filepath,
      env: page.env,
      fileContent,
      description: frontmatter.description,
      date: frontmatter.date,
      title: frontmatter.title,
      url,
      frontmatter
    })
  }
  endParsePageData()

  posts = posts.filter((p) => {
    // 忽略 layout:home
    if (p.frontmatter.layout === 'home' && ignoreHome) {
      return false
    }
    // 跳过未发布的文章
    if (p.frontmatter.publish === false && !ignorePublish)
      return false

    return true
  })
  if (rssOptions?.filter) {
    posts = posts.filter(rssOptions.filter)
  }

  // 按日期排序
  posts.sort((a, b) => {
    const dateA = a.frontmatter.published || a.date
    const dateB = b.frontmatter.published || b.date
    return +new Date(dateB) - +new Date(dateA)
  })

  // 限制数量
  if (undefined !== rssOptions?.limit && rssOptions?.limit > 0) {
    posts.splice(rssOptions.limit)
  }

  // render html
  const endRenderHTML = debugTime('endRenderHTML')
  const md = await getMdRender(config, rssOptions)

  await Promise.all(posts.map(async (post) => {
    const { fileContent, filepath, env, url } = post
    if (!htmlCache.has(url)) {
      let html = ''

      // 先尝试从文件系统缓存中获取
      const cachedHtml = rssOptions.cache !== false ? await getCachedHtml(config, rssOptions, filepath, fileContent, url) : null
      if (cachedHtml) {
        html = cachedHtml
      }
      else {
        // 缓存未命中，重新渲染
        if (renderHTML === true) {
          html = md.render(fileContent, env)
        }
        else if (typeof renderHTML === 'function') {
          html = await renderHTML(fileContent, config, rssOptions)
        }

        // 移除零宽字符
        // https://github.com/ATQQ/sugar-blog/issues/276
        html = removeZeroWidthSpace(html)

        // 插入自定义样式
        // 部分markdown渲染样式由 VitePress 内置
        if (rssOptions?.markdownOptions?.style) {
          html = injectStyle(html, rssOptions.markdownOptions.style)
        }

        // 支持对对渲染结果进行转换
        if (rssOptions?.transform) {
          html = await rssOptions.transform(html, config)
        }

        // 将渲染结果保存到文件系统缓存
        if (html) {
          await setCachedHtml(config, rssOptions, filepath, fileContent, html, url)
        }
      }

      // 将SVG转为图片
      if (rssOptions?.markdownOptions?.svg2img) {
        let target = rssOptions.markdownOptions.svg2img
        target = target === true ? 'base64' : target
        if (target === 'base64') {
          html = svgToBase64(html)
        }
        else if (target === 'png') {
          const assetsBaseUrl = rssOptions?.assetsBaseUrl || rssOptions.baseUrl
          const outDir = joinPath(config.outDir, `/${config.assetsDir}`)
          html = await svgToUrl(html, outDir, assetsBaseUrl)
        }
      }

      // 缓存一下，避免生成多个时重复 render
      if (html) {
        htmlCache.set(url, html)
      }
    }
  }))
  endRenderHTML()

  return posts
}

// 内容md5一样则复用缓存
export async function genFeed(config: SiteConfig, rssOptions: RSSOptions, assetsMap: any[]) {
  if (!rssOptions)
    return

  const { baseUrl, filename } = rssOptions

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { renderHTML, ...restOps } = rssOptions
  const feed = new Feed({
    id: rssOptions.baseUrl,
    link: rssOptions.baseUrl,
    ...restOps,
  })

  const endGetPostsData = debugTime('genFeed:getPostsData')
  // 获取所有文章
  const posts
    = await getPostsData(config, rssOptions, assetsMap)
  endGetPostsData()

  for (const post of posts) {
    const { title, description, date, frontmatter, url } = post

    // 文章作者信息：合并 frontmatter 与全局，补全仅 name 的作者
    const author = emptyArrayToUndefined(
      [frontmatter.author ?? rssOptions.author]
        .flat()
        .filter(Boolean)
        .map((a: string | Author) => {
          // 字符串情况
          if (typeof a === 'string') {
            return rssOptions.authors?.find(v => v.name === a) || { name: a }
          }
          // 对象情况
          // 如果只有 name，尝试从全局 authors 补全其他信息
          if (a?.name && !a.email && !a.link && !a.avatar) {
            const found = rssOptions.authors?.find(v => v.name === a.name)
            return found ? { ...a, ...found } : a
          }
          return a
        }) as Author[]
    )

    // 文章分类信息
    const category: Category[] | undefined = emptyArrayToUndefined(frontmatter.category)

    // 最后的文章链接
    const link = `${baseUrl}${url}`

    // guid 支持，未提供时回退为 link
    const guid = frontmatter?.guid || link

    // published 支持
    const published = frontmatter?.published && new Date(frontmatter?.published)

    // enclosure 支持
    const enclosure = normalizeEnclosure(frontmatter)

    feed.addItem({
      title,
      guid,
      link,
      description,
      content: htmlCache.get(post.url) ?? '',
      author,
      category,
      published,
      enclosure,
      image: frontmatter?.cover ? new URL(frontmatter?.cover, baseUrl).href : '',
      date: new Date(date),
    } satisfies Item)
  }
  const RSSFilename = filename || 'feed.rss'

  if (!fs.existsSync(config.outDir)) {
    fs.mkdirSync(config.outDir, { recursive: true })
  }

  const RSSFilepath = path.join(config.outDir, RSSFilename)

  await fs.promises.writeFile(RSSFilepath, feed.rss2(), 'utf-8')
  if (rssOptions.log ?? true) {
    console.log('🎉 RSS generated', RSSFilename)
    console.log('rss filepath:', RSSFilepath)
    console.log('rss url:', normalizeUrl(`${baseUrl}${config.site.base + RSSFilename}`))
    console.log('included', posts.length, 'posts')
  }
}

function isBase64ImageURL(url: string) {
  // Base64 图片链接的格式为 data:image/[image format];base64,[Base64 编码的数据]
  const regex = /^data:image\/[a-z]+;base64,/
  return regex.test(url)
}

export function getRelativeImagesFromFileContent(content: string, route: string) {
  const images = [...content.matchAll(/!\[.*?\]\((.*?)\s*(".*?")?\)/g)].map(v => v[1]) || []

  return images.map((originValue) => {
    const isHTTPSource = originValue && originValue.startsWith('http')
    if (isHTTPSource || isBase64ImageURL(originValue)) {
      return [originValue, '']
    }
    const paths = joinPath('/', route).split('/')
    paths.splice(paths.length - 1, 1)
    const relativePath = normalizePath(
      originValue.startsWith('/')
        ? originValue
        : path.join(paths.join('/') || '', originValue)
    )
    return [originValue, joinPath('/', relativePath)]
  }).filter((v) => {
    return v[1].startsWith('/')
  })
}
