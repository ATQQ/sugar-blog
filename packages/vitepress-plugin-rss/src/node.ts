import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import type { SiteConfig } from 'vitepress'
import { Feed } from 'feed'
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
  renderDynamicMarkdown
} from '@sugarat/theme-shared'
import type { PostInfo, RSSOptions } from './type'

const imageRegex = /!\[.*?\]\((.*?)\s*(".*?")?\)/

// 使用文件缓存，避免内存占用
const htmlCache = new Map<string, string | undefined>()

// 文件系统缓存相关函数
function getCacheKey(filepath: string, content: string, url?: string): string {
  const hash = crypto.createHash('md5').update(content).digest('hex')
  // 使用 URL basename 作为 key，兼容动态路由场景
  const basename = url ? path.basename(url) : path.basename(filepath)
  return `${basename}_${hash}`
}

async function getCacheDir(config: SiteConfig): Promise<string> {
  const cacheDir = path.join(config.cacheDir || path.join(config.root, '.vitepress/cache'), 'rss')
  await fs.promises.mkdir(cacheDir, { recursive: true })
  return cacheDir
}

async function getCachedHtml(config: SiteConfig, filepath: string, content: string, url?: string): Promise<string | null> {
  try {
    const cacheDir = await getCacheDir(config)
    const cacheKey = getCacheKey(filepath, content, url)
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

async function setCachedHtml(config: SiteConfig, filepath: string, content: string, html: string, url?: string): Promise<void> {
  try {
    const cacheDir = await getCacheDir(config)
    const cacheKey = getCacheKey(filepath, content, url)
    const cachePath = path.join(cacheDir, cacheKey)

    await fs.promises.writeFile(cachePath, html, 'utf-8')
  }
  catch (error) {
    // 缓存写入失败，不影响正常流程
  }
}

let cacheMdRender: any
async function getMdRender(config: SiteConfig) {
  const { createMarkdownRenderer } = await import('vitepress')
  return createMarkdownRenderer(
    config.srcDir,
    config.markdown,
    config.site.base,
    config.logger
  )
}

let cachePageData: ReturnType<typeof getVitePressPages>
export async function getPostsData(
  config: SiteConfig,
  ops: RSSOptions
) {
  const endParseConfig = debugTime('endParseConfig')
  const { ignoreHome = true, ignorePublish = false, renderHTML = true } = ops
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
    const fileContent = await contentPromise

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

    // 获取摘要信息
    frontmatter.description
      // eslint-disable-next-line no-await-in-loop
      = (await ops?.renderExpect?.(content, { ...frontmatter }))
      ?? (frontmatter.description || excerpt || getTextSummary(content, 100))

    // 获取封面图
    frontmatter.cover
      = (frontmatter.cover
        ?? (fileContent.match(imageRegex)?.[1])) || ''

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
  if (ops?.filter) {
    posts = posts.filter(ops.filter)
  }

  // 按日期排序
  posts.sort(
    (a, b) => +new Date(b.date as string) - +new Date(a.date as string)
  )

  // 限制数量
  if (undefined !== ops?.limit && ops?.limit > 0) {
    posts.splice(ops.limit)
  }

  // render html
  const endRenderHTML = debugTime('endRenderHTML')
  await Promise.all(posts.map(async (post) => {
    const { fileContent, filepath, env, url } = post
    if (!htmlCache.has(url)) {
      let html

      // 先尝试从文件系统缓存中获取
      const cachedHtml = await getCachedHtml(config, filepath, fileContent, url)
      if (cachedHtml) {
        html = cachedHtml
      }
      else {
        // 缓存未命中，重新渲染
        if (renderHTML === true) {
          if (!cacheMdRender) {
            cacheMdRender = await getMdRender(config)
          }
          html = cacheMdRender.render(fileContent, env)
        }
        else if (typeof renderHTML === 'function') {
          html = await renderHTML(fileContent)
        }

        // 将渲染结果保存到文件系统缓存
        if (html) {
          await setCachedHtml(config, filepath, fileContent, html, url)
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
export async function genFeed(config: SiteConfig, rssOptions: RSSOptions) {
  if (!rssOptions)
    return

  const { baseUrl, filename } = rssOptions

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { renderHTML, transform = v => v, ...restOps } = rssOptions
  const feed = new Feed({
    id: rssOptions.baseUrl,
    link: rssOptions.baseUrl,
    ...restOps,
  })

  const endGetPostsData = debugTime('genFeed:getPostsData')
  // 获取所有文章
  const posts
    = await getPostsData(config, rssOptions)
  endGetPostsData()

  for (const post of posts) {
    const { title, description, date, frontmatter, url } = post
    const author = frontmatter.author || rssOptions.author?.name
    const authorInfo = rssOptions.authors?.find(v => v.name === author)
    // 最后的文章链接
    const link = `${baseUrl}${url}`
    feed.addItem({
      title,
      id: link,
      link,
      description,
      content: transform((htmlCache.get(post.url) ?? '').replaceAll('&ZeroWidthSpace;', '')),
      author: [
        {
          name: author,
          ...authorInfo
        }
      ],
      image: frontmatter?.cover ? new URL(frontmatter?.cover, baseUrl).href : '',
      date: new Date(date)
    })
  }
  const RSSFilename = filename || 'feed.rss'

  if (!fs.existsSync(config.outDir)) {
    fs.mkdirSync(config.outDir, { recursive: true })
  }

  const RSSFilepath = path.join(config.outDir, RSSFilename)

  await fs.promises.writeFile(RSSFilepath, feed.rss2())
  if (rssOptions.log ?? true) {
    console.log('🎉 RSS generated', RSSFilename)
    console.log('rss filepath:', RSSFilepath)
    console.log('rss url:', `${baseUrl}${config.site.base + RSSFilename}`)
    console.log('include', posts.length, 'posts')
  }
}
