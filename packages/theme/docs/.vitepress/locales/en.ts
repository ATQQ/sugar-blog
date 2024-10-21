import { defineLocaleConfig } from '@sugarat/theme/node'

export const themeEN = defineLocaleConfig({
  author: 'sugar',
  hotArticle: {
    title: '🔥 Hot Article',
    nextText: 'next',
    pageSize: 3,
    empty: 'empty content'
  },
  homeTags: {
    title: '🏷 Tags'
  },
  home: {
    name: '@sugarat/theme',
    motto: 'Sugar\'s Blog Theme',
    inspiring: 'Based on VitePress',
    analysis: {
      articles: {
        title: ['Posts', 'Monthly', 'Weekly']
      }
    }
  },
  comment: {
    type: 'giscus',
    options: {
      repo: 'ATQQ/sugar-blog',
      repoId: 'MDEwOlJlcG9zaXRvcnkyNDEyNDUyOTk',
      category: 'Announcements',
      categoryId: 'DIC_kwDODmEcc84COVc6',
      inputPosition: 'top',
    },
    label: 'Comment',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 512 512"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2l-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29c7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1l-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160s-93.3 160-208 160z"/></svg>',
    mobileMinify: false,
  },
  recommend: {
    nextText: 'Next',
    sort: 'date'
  },
  buttonAfterArticle: {
    openTitle: 'By Me A ☕️',
    closeTitle: 'Bye Bye 👋🏻',
    content: '<img src="https://img.cdn.sugarat.top/mdImg/MTY0Nzc1NTYyOTE5Mw==647755629193">',
    icon: 'wechatPay',
  },
  friend: [{
    nickname: 'sugar',
    des: 'Your fingertips have the power to change the world.',
    avatar:
      'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
    url: 'https://sugarat.top'
  }, {
    nickname: 'Vitepress',
    des: 'Vite & Vue Powered Static Site Generator',
    avatar: 'https://vitepress.dev/vitepress-logo-large.webp',
    url: 'https://vitepress.dev/'
  }],
  authorList: [
    {
      nickname: 'sugar',
      url: 'https://sugarat.top/aboutme.html',
      des: '你的指尖,拥有改变世界的力量'
    }
  ],
  oml2d: {
    mobileDisplay: false,
    models: [
      {
        path: 'https://oml2d-models.sugarat.top/Senko_Normals/senko.model3.json',
      },
      {
        path: 'https://oml2d-models.sugarat.top/mai/model.json',
      }
    ],
  },
  themeColor: 'el-blue',
  backToTop: {
    top: 10,
    icon: '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><title>align_arrow_up_line</title><g id="align_arrow_up_line" fill=\'none\' fill-rule=\'nonzero\'><path d=\'M24 0v24H0V0h24ZM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01-.184-.092Z\'/><path fill=\'#09244BFF\' d=\'M7.05 8.703a1 1 0 0 0 1.415 0L11 6.167V15a1 1 0 0 0 2 0V6.167l2.536 2.536a1 1 0 1 0 1.414-1.415l-4.243-4.242a1 1 0 0 0-1.414 0L7.05 7.288a1 1 0 0 0 0 1.415ZM19 21a1 1 0 1 0 0-2H5a1 1 0 1 0 0 2h14Z\'/></g></svg>'
  },
  article: {
    // readingTimePosition: 'top',
    // readingTime: false,
    analyzeTitles: {
      topWordCount: '{{value}} word counts',
      topReadTime: '{{value}} min read time',
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
