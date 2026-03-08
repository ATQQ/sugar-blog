import type { Theme } from '@sugarat/theme'
import { getThemeConfig } from '@sugarat/theme/node'
import { themeEN } from './locales/en'
import workConfig from './works'

const baseUrl = 'https://theme.sugarat.top'
const RSS: Theme.RSSOptions = {
  title: '@sugarat/theme',
  baseUrl,
  copyright: 'Copyright (c) 2023-present, 粥里有勺糖',
  description: '基于 vitepress 实现的简约博客主题',
  markdownOptions: {
    lineNumbers: false,
    svg2img: 'png'
  },
  feed: `${baseUrl}/feed.rss`
}

export const blogTheme = getThemeConfig({
  home: {
    blogInfoCollapsible: true
  },
  locales: {
    en: themeEN
  },
  // groupIcon: false,
  // formatShowDate: {
  //   justNow: '不久前',
  //   minutesAgo: ' minutes ago',
  // },
  search: {
    showDate: true,
    pageResultCount: 5,
    btnPlaceholder: '搜索',
    placeholder: '搜索文章',
    emptyText: '没有找到相关文章',
    heading: '结果数: {{searchResult}} 条。',
    toSelect: '选择',
    toClose: '关闭',
    toNavigate: '移动',
    searchBy: 'Powered by',
    locales: {
      en: {
        btnPlaceholder: 'Search',
        placeholder: 'Search Docs',
        emptyText: 'No results found',
        heading: 'Total: {{searchResult}} search results.',
        toSelect: 'to select',
        toClose: 'to close',
        toNavigate: 'to navigate',
        searchBy: 'Search by',
      }
    }
  },
  // 图表支持
  mermaid: true,
  imageStyle: {
    coverPreview: [
      // 七牛云
      {
        rule: '//img.cdn.sugarat.top',
        suffix: '~cover.webp'
      },
      // 又拍云CDN
      {
        rule: '//cdn.upyun.sugarat.top',
        suffix: '-cover'
      }
    ]
  },
  oml2d: {
    mobileDisplay: true,
    models: [
      {
        path: 'https://oml2d-models.sugarat.top/Senko_Normals/senko.model3.json',
      },
      {
        path: 'https://oml2d-models.sugarat.top/mai/model.json',
      }
    ],
  },
  RSS,
  authorList: [
    {
      nickname: '粥里有勺糖',
      url: 'https://sugarat.top/aboutme.html',
      des: '你的指尖,拥有改变世界的力量'
    }
  ],
  recommend: {
    nextText: '下一页',
    sort(a, b) {
      return +new Date(b.meta.date) - +new Date(a.meta.date)
    },
  },
  friend: [
    {
      nickname: '粥里有勺糖',
      des: '你的指尖,拥有改变世界的力量',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030~fmt.webp',
      url: 'https://sugarat.top'
    },
    {
      nickname: 'Vitepress',
      des: 'Vite & Vue Powered Static Site Generator',
      avatar: 'https://vitepress.dev/vitepress-logo-large.webp',
      url: 'https://vitepress.dev/'
    }
  ],
  // 文章默认作者
  author: '粥里有勺糖',
  // 评论
  comment: {
    type: 'giscus',
    options: {
      repo: 'ATQQ/sugar-blog',
      repoId: 'MDEwOlJlcG9zaXRvcnkyNDEyNDUyOTk',
      category: 'Announcements',
      categoryId: 'DIC_kwDODmEcc84COVc6',
      inputPosition: 'top',
    },
  },
  buttonAfterArticle: {
    openTitle: '投"币"支持',
    closeTitle: '下次一定',
    content: '<img src="https://img.cdn.sugarat.top/mdImg/MTY0Nzc1NTYyOTE5Mw==647755629193">',
    icon: 'wechatPay',
  },
  popover: {
    style: '.theme-blog-popover a {color: var(--vp-c-brand-2);}',
    title: '公告',
    body: [
      { type: 'text', content: '**👇公众号👇---👇 微信 👇**' },
      {
        type: 'image',
        src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210~fmt.webp',
        alt: '粥里有勺糖微信二维码'
      },
      {
        type: 'text',
        content: '[欢迎大家加群&私信交流](/group.html)'
      },
      {
        type: 'text',
        content: '*文章首/文尾有群二维码*',
        style: 'padding-top:0'
      },
      {
        type: 'button',
        content: '作者博客',
        link: 'https://sugarat.top'
      },
      {
        type: 'button',
        content: '加群交流',
        props: {
          type: 'success'
        },
        link: '/group.html',
      }
    ],
    locales: {
      en: {
        title: 'Announcement',
        body: [
          { type: 'text', content: '👇 Wechat 👇' },
          {
            type: 'image',
            src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210~fmt.webp'
          },
          {
            type: 'button',
            content: 'Author Blog',
            link: 'https://sugarat.top'
          },
        ]
      }
    }
  },
  works: workConfig,
  footer: {
    copyright: 'MIT License | 粥里有勺糖',
  }
})
