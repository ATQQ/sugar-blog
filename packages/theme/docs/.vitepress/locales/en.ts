import { defineLocaleConfig } from '@sugarat/theme/node'

export const themeEN = defineLocaleConfig({
  author: 'sugar',
  hotArticle: {
    title: '🔥 Hot Article',
    nextText: 'next',
    pageSize: 3,
    empty: 'empty content'
  },
  article: {
    analyzeTitles: {
      inlineWordCount: '{{value}} word counts',
      inlineReadTime: '{{value}} min read time',
      wordCount: 'Total word count',
      readTime: 'Total read time',
      author: 'Author',
      publishDate: 'Published on',
      lastUpdated: 'Last updated on',
      tag: 'Tags',
    }
  },
})
