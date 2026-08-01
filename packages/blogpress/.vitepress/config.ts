import { defineConfig } from 'vitepress'
import { La51Plugin } from 'vitepress-plugin-51la'
import { blogTheme } from './blog-theme'

export default defineConfig({
  extends: blogTheme,
  metaChunk: true,
  srcExclude: ['CHANGELOG.md', 'redirect-tag.md', 'weekly/2026-07-16.md'],
  markdown: {
    image: {
      lazyLoading: true
    }
  },
  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://sugarat.top',
  },
  lang: 'zh-cn',
  title: '粥里有勺糖',
  description:
    '粥里有勺糖的个人博客，记录随笔与学习笔记，大前端相关的知识，高频面试题，个人面经等',
  head: [
    // <meta name="baidu-site-verification" content="codeva-b08avp82Uj" />
    ['meta', { name: 'baidu-site-verification', content: 'codeva-b08avp82Uj' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/png' }],
    [
      'link',
      {
        rel: 'alternate icon',
        href: '/favicon.ico',
        type: 'image/png',
        sizes: '16x16'
      }
    ],
    ['meta', { name: 'author', content: '粥里有勺糖' }],
    ['link', { rel: 'mask-icon', href: '/favicon.ico', color: '#ffffff' }],
    [
      'link',
      { rel: 'apple-touch-icon', href: '/favicon.ico', sizes: '180x180' }
    ],
  ],
  vite: {
    plugins: [
      La51Plugin({
        id: 'Jgmg5avjAUvoyePS',
        ck: 'Jgmg5avjAUvoyePS',
        importMode: 'async'
      })
    ]
  },
  vue: {
    template: {
      compilerOptions: {
        // https://github.com/vuejs/vitepress/discussions/468
        isCustomElement: (tag) => {
          return ['center'].includes(tag.toLocaleLowerCase())
        }
      }
    }
  },
  lastUpdated: true,
  themeConfig: {
    outline: {
      level: [2, 3],
      label: '目录'
    },
    // search: {
    //   provider: 'algolia',
    //   options: {
    //     appId: 'F919JCK8WY',
    //     apiKey: '3eca209ad24bdfc26db63382dd5e4490',
    //     indexName: 'sugarat_top',
    //     placeholder: '请输入要搜索的内容...'
    //   }
    // },
    lastUpdatedText: '上次更新于',
    logo: 'https://cdn.upyun.sugarat.top/avatar/blog/zlyst-avatar.jpeg-wh100',
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    nav: [
      {
        text: '关于我',
        link: '/aboutme'
      },
      {
        text: '技术笔记',
        items: [
          { text: '技术教程', link: '/technology/learn/' },
          { text: '模板工程', link: '/technology/tpl/' },
          { text: '源码学习', link: '/technology/source/' },
          { text: '技术概念', link: '/technology/theory/' },
          { text: '个人作品', link: '/technology/works/' },
          { text: '学习笔记', link: '/technology/study/' }
        ]
      },
      {
        text: '大前端',
        items: [
          { text: 'javascript', link: '/bigWeb/js/' },
          { text: 'vue', link: '/bigWeb/vue/' },
          { text: 'html', link: '/bigWeb/html/' },
          { text: 'css', link: '/bigWeb/css/' },
          { text: '🌏浏览器专题', link: '/bigWeb/browser/' },
          { text: 'Web性能优化', link: '/bigWeb/performance/' },
          { text: 'regexp', link: '/bigWeb/regexp/' },
          { text: 'node', link: '/bigWeb/node/' }
        ]
      },
      {
        text: '面试',
        link: '/interview/'
      },
      // {
      //   text: '个人站点',
      //   items: [
      //     {
      //       text: 'GitHub',
      //       link: 'https://github.com/ATQQ/sugar-blog'
      //     },
      //     {
      //       text: '博客园',
      //       link: 'https://www.cnblogs.com/roseAT/'
      //     },
      //     {
      //       text: '掘金',
      //       link: 'https://juejin.im/user/1028798615918983'
      //     }
      //     // {
      //     //   text: "GitBook-blog",
      //     //   link: "https://sugar-at.gitbook.io/blog-article/",
      //     //   icon: "reco-blog",
      //     // },
      //     // {
      //     //   text: "GitBook-ES6",
      //     //   link: "https://sugar-js.gitbook.io/-1/",
      //     //   icon: "reco-document",
      //     // },
      //   ]
      // },
      {
        text: '个人作品',
        link: '/works/work'
      }
      // {
      //   text: '线上作品',
      //   items: [
      //     {
      //       text: '轻取(文件收集)',
      //       link: 'https://ep2.sugarat.top'
      //     },
      //     {
      //       text: '个人图床',
      //       link: 'https://imgbed.sugarat.top'
      //     },
      //     {
      //       text: '考勤小程序',
      //       link: 'https://hdkq.sugarat.top/'
      //     },
      //     {
      //       text: '时光恋人',
      //       link: 'https://lover.sugarat.top'
      //     },
      //     {
      //       text: '在线简历生成',
      //       link: 'https://resume.sugarat.top/'
      //     }
      //   ]
      // }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ATQQ/sugar-blog' },
      {
        icon: 'x',
        link: 'https://x.com/Mr_XiaoZou'
      }
    ]
  }
})
