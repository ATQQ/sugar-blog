/* eslint-disable no-console */
import path from 'path'
import fs, { writeFileSync } from 'fs'
import { Feed } from 'feed'
import type { SiteConfig } from 'vitepress'
import type { Theme } from '../../composables/config/index'
import { withBase } from './index'
import { pageMap } from './theme'

export async function genFeed(config: SiteConfig) {
  const blogCfg: Theme.BlogConfig = config.userConfig.themeConfig.blog
  let posts: Theme.PageData[] = blogCfg.pagesData
  const { RSS, authorList = [] } = blogCfg
  if (!RSS) return
  const { createMarkdownRenderer } = await import('vitepress')

  const mdRender = await createMarkdownRenderer(
    config.srcDir,
    config.markdown,
    config.site.base,
    config.logger
  )
  console.log()
  console.log('=== feed: https://github.com/jpmonette/feed ===')
  const { base } = config.userConfig

  const { baseUrl, filename } = RSS
  const feed = new Feed({
    id: baseUrl,
    link: baseUrl,
    ...RSS
  })

  posts.sort(
    (a, b) =>
      +new Date(b.meta.date as string) - +new Date(a.meta.date as string)
  )

  posts = posts
    // 过滤掉 layout:home
    .filter((v) => v.meta.layout !== 'home')
    // 过滤掉不展示的
    .filter((v) => v.meta.hidden !== true)

  if (undefined !== RSS?.limit && RSS?.limit > 0) {
    posts.splice(RSS.limit)
  }

  for (const { route, meta } of posts) {
    const { title, description, date } = meta

    const author = meta.author ?? blogCfg.author
    let link = `${baseUrl}${withBase(
      base || '',
      // 移除末尾的index
      route.replace(/(^|\/)index$/, '$1')
    )}`
    // 补全后缀
    link = link.endsWith('/')
      ? link
      : `${link}${config?.cleanUrls ? '' : '.html'}`
    const authorLink = authorList.find((v) => v.nickname === author)?.url
    let html
    const filepath = pageMap.get(route)
    if (filepath) {
      const fileContent = fs.readFileSync(filepath, 'utf-8')
      html = mdRender.render(fileContent)
    }

    feed.addItem({
      title,
      id: link,
      link,
      description,
      content: html,
      author: [
        {
          name: author,
          link: authorLink
        }
      ],
      date: new Date(date)
    })
  }
  const RSSFilename = filename || 'feed.rss'
  const RSSFile = path.join(config.outDir, RSSFilename)
  writeFileSync(RSSFile, feed.rss2())
  console.log('🎉 RSS generated', RSSFilename)
  console.log('rss filepath:', RSSFile)
  console.log('rss url:', `${baseUrl}${config.site.base + RSSFilename}`)
  console.log('include', posts.length, 'posts')
  console.log()
  console.log()
}
