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
  const posts: Theme.PageData[] = blogCfg.pagesData
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
  const feed = new Feed(RSS)

  posts.sort(
    (a, b) =>
      +new Date(b.meta.date as string) - +new Date(a.meta.date as string)
  )

  for (const { route, meta } of posts) {
    const { title, description, date, hidden } = meta
    if (hidden) continue
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
  const RSSFile = path.join(config.outDir, filename || 'feed.rss')
  writeFileSync(RSSFile, feed.rss2())
  console.log('🎉 RSS generated', filename || 'feed.rss')
  console.log()
}
