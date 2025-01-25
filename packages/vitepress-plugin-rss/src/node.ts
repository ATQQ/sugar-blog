import fs from 'node:fs'
import path from 'node:path'
import type { SiteConfig } from 'vitepress'
import { Feed } from 'feed'
import { formatDate, getDefaultTitle, getFileLastModifyTime, getTextSummary, getVitePressPages, grayMatter, joinPath, normalizePath, renderDynamicMarkdown } from '@sugarat/theme-shared'
import type { PostInfo, RSSOptions } from './type'

const imageRegex = /!\[.*?\]\((.*?)\s*(".*?")?\)/
const htmlCache = new Map<string, string | undefined>()
export async function getPostsData(
  config: SiteConfig,
  ops: RSSOptions
) {
  const { ignoreHome = true, ignorePublish = false, renderHTML = true } = ops
  const pagesData = getVitePressPages(config)

  const { createMarkdownRenderer } = await import('vitepress')

  const mdRender = await createMarkdownRenderer(
    config.srcDir,
    config.markdown,
    config.site.base,
    config.logger
  )
  let posts: PostInfo[] = []
  const fileContentPromises = pagesData.reduce((prev, f) => {
    const { isDynamic, dynamicRoute, filepath } = f
    const contentPromise = (isDynamic && dynamicRoute)
      ? Promise.resolve(renderDynamicMarkdown(filepath, dynamicRoute?.params, dynamicRoute?.content))
      : fs.promises.readFile(filepath, 'utf-8')

    prev[f.page] = {
      contentPromise,
      datePromise: getFileLastModifyTime(f.filepath)
    }
    return prev
  }, {} as Record<string, { contentPromise: Promise<string>; datePromise: Promise<Date | undefined> | undefined | Date }>)

  for (const page of pagesData) {
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
  for (const post of posts) {
    const { fileContent, filepath, env } = post
    if (!htmlCache.has(filepath)) {
      let html
      if (renderHTML === true) {
        html = mdRender.render(fileContent, env)
      }
      else if (typeof renderHTML === 'function') {
        html = await renderHTML(fileContent)
      }
      // 缓存一下，避免生成多个时重复 render
      if (html) {
        htmlCache.set(filepath, html)
      }
    }
  }

  return posts
}

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

  // 获取所有文章
  const posts
    = await getPostsData(config, rssOptions)

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
      content: transform((htmlCache.get(post.filepath) ?? '').replaceAll('&ZeroWidthSpace;', '')),
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
  const RSSFilepath = path.join(config.outDir, RSSFilename)
  await fs.promises.writeFile(RSSFilepath, feed.rss2())
  if (rssOptions.log ?? true) {
    console.log('🎉 RSS generated', RSSFilename)
    console.log('rss filepath:', RSSFilepath)
    console.log('rss url:', `${baseUrl}${config.site.base + RSSFilename}`)
    console.log('include', posts.length, 'posts')
  }
}
