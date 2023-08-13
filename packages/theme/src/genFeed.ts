import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'

const baseUrl = 'https://sugarat.top'

export async function genFeed(config: SiteConfig) {
  const feed = new Feed({
    title: 'The Vue Point',
    description: 'The official blog for the Vue.js project',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: 'https://vuejs.org/images/logo.png',
    favicon: `${baseUrl}/favicon.ico`,
    copyright:
      'Copyright (c) 2021-present, Yuxi (Evan) You and blog contributors'
  })

  const posts = await createContentLoader('docs/*.md', {
    excerpt: true,
    render: true
  }).load()

  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string)
  )

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: frontmatter.author,
          link: frontmatter.twitter
            ? `https://twitter.com/${frontmatter.twitter}`
            : undefined
        }
      ],
      date: frontmatter.date
    })
  }

  writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2())
}
