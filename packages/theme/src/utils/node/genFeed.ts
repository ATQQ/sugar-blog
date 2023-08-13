/* eslint-disable no-console */
import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import type { SiteConfig } from 'vitepress'
import type { Theme } from '../../composables/config/index'
import { withBase } from './index'

export function genFeed(config: SiteConfig) {
  const blogCfg: Theme.BlogConfig = config.userConfig.themeConfig.blog
  const posts: Theme.PageData[] = blogCfg.pagesData
  const { RSS, authorList = [] } = blogCfg
  if (!RSS) return
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
    const link = `${baseUrl}${withBase(base || '', route)}.html`
    const authorLink = authorList.find((v) => v.nickname === author)?.url
    feed.addItem({
      title,
      id: link,
      // TODO: 待定，添加transform
      link,
      description,
      // TODO: 待定，文章多的时候，会导致 RSS 文件过大
      // content: html,
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
