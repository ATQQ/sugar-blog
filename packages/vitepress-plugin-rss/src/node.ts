import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import glob from 'fast-glob'
import type { SiteConfig } from 'vitepress'
import { Feed } from 'feed'
import { formatDate, getDefaultTitle, getFileLastModifyTime, getTextSummary, grayMatter, normalizePath } from '@sugarat/theme-shared'
import type { PostInfo, RSSOptions } from './type'

const imageRegex = /!\[.*?\]\((.*?)\s*(".*?")?\)/
const htmlCache = new Map<string, string | undefined>()
export async function getPostsData(
  srcDir: string,
  config: SiteConfig,
  ops?: Pick<RSSOptions, 'renderExpect' | 'renderHTML'>
) {
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ['node_modules'] })

  const { createMarkdownRenderer } = await import('vitepress')

  const mdRender = await createMarkdownRenderer(
    config.srcDir,
    config.markdown,
    config.site.base,
    config.logger
  )
  const posts: PostInfo[] = []
  const fileContentPromises = files.reduce((prev, f) => {
    prev[f] = {
      contentPromise: fs.promises.readFile(f, 'utf-8'),
      datePromise: getFileLastModifyTime(f)
    }
    return prev
  }, {} as Record<string, { contentPromise: Promise<string>; datePromise: Promise<Date | undefined> | undefined | Date }>)

  for (const file of files) {
    const { contentPromise, datePromise } = fileContentPromises[file]
    const fileContent = await contentPromise

    // TODO：提前的 filter 过滤
    const { data: frontmatter, excerpt, content } = grayMatter(fileContent, {
      excerpt: true
    })

    if (!frontmatter.title) {
      frontmatter.title = getDefaultTitle(content)
    }

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

    // TODO: cache 未生效
    let html = htmlCache.get(file)

    if (html) {
      console.log('缓存复用', file)
    }
    if (!html) {
      if (ops?.renderHTML === true) {
        html = mdRender.render(fileContent)
      }
      else if (typeof ops?.renderHTML === 'function') {
        html = await ops.renderHTML(fileContent)
      }
      // 缓存一下，生成多个时加速
      if (html) {
        htmlCache.set(file, html)
      }
    }

    const url
      = config.site.base
      + normalizePath(path.relative(config.srcDir, file))
        .replace(/(^|\/)index\.md$/, '$1')
        .replace(/\.md$/, config.cleanUrls ? '' : '.html')

    posts.push({
      filepath: file,
      fileContent,
      html,
      description: frontmatter.description,
      date: frontmatter.date,
      title: frontmatter.title,
      url,
      frontmatter
    })
  }

  return posts
}

export async function genFeed(config: SiteConfig, rssOptions: RSSOptions) {
  if (!rssOptions)
    return

  const srcDir
    = config.srcDir.replace(config.root, '').replace(/^\//, '')
    || process.argv.slice(2)?.[1]
    || '.'

  const { baseUrl, filename, ignoreHome = true, filter: filterPost = () => true, ignorePublish = false } = rssOptions

  const { renderHTML = true, ...restOps } = rssOptions
  const feed = new Feed({
    id: rssOptions.baseUrl,
    link: rssOptions.baseUrl,
    ...restOps,
  })

  // 获取所有文章
  const posts = (
    await getPostsData(srcDir, config, {
      renderExpect: rssOptions.renderExpect,
      renderHTML
    })
  ).filter((p) => {
    // 忽略 layout:home
    if (p.frontmatter.layout === 'home' && ignoreHome) {
      return false
    }
    // 跳过未发布的文章
    if (p.frontmatter.publish === false && !ignorePublish)
      return false

    return true
  })
  // 自定义过滤逻辑
    .filter(filterPost)

  // 按日期排序
  posts.sort(
    (a, b) => +new Date(b.date as string) - +new Date(a.date as string)
  )
  if (undefined !== rssOptions?.limit && rssOptions?.limit > 0) {
    posts.splice(rssOptions.limit)
  }

  for (const post of posts) {
    const { title, description, date, frontmatter, url, html } = post

    const author = frontmatter.author || rssOptions.author?.name
    const authorInfo = rssOptions.authors?.find(v => v.name === author)
    // 最后的文章链接
    const link = `${baseUrl}${url}`
    feed.addItem({
      title,
      id: link,
      link,
      description,
      content: html,
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
