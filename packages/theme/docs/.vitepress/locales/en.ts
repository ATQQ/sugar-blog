import { defineLocaleConfig } from '@sugarat/theme/node'

export const themeEN = defineLocaleConfig({
  author: 'sugar',
  hotArticle: {
    title: '🔥 Hot Article',
    nextText: 'next',
    pageSize: 3,
    empty: 'empty content'
  },
  backToTop: {
    top: 10,
    icon: '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><title>arrow_left_circle_fill</title><g id="arrow_left_circle_fill" fill=\'none\' fill-rule=\'evenodd\'><path d=\'M24 0v24H0V0h24ZM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01-.184-.092Z\'/><path fill=\'#09244BFF\' d=\'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-.005-5.758a1 1 0 0 0 0-1.414L10.168 13h6.076a1 1 0 0 0 0-2h-6.076l1.829-1.829a1 1 0 0 0-1.415-1.414l-3.535 3.536a1 1 0 0 0 0 1.414l3.535 3.535a1 1 0 0 0 1.415 0Z\'/></g></svg>'
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
