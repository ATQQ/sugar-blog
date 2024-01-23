import process from 'node:process'
import { defineConfig, getThemeConfig } from '@sugarat/theme/node'
import type { Theme } from '@sugarat/theme'
import type { RSSOptions } from 'vitepress-plugin-rss'
import { RssPlugin } from 'vitepress-plugin-rss'

const baseUrl = 'https://sugarat.top'
const weekly = `${baseUrl}/weekly`
const RSSWeekly: RSSOptions = {
  title: '视野修炼 - 技术周刊',
  baseUrl,
  description: '每周会精选出一些 优质&有趣 的内容做推送（大前端为主），包含但不限于 优质文章，开源库，工具网站，有意思的知识',
  id: weekly,
  link: weekly,
  language: 'zh-cn',
  filter(value) {
    return value.url.startsWith('/weekly/') && !value.url.endsWith('/weekly/')
  },
  image: 'https://img.cdn.sugarat.top/mdImg/MTcwNTIwMDEzNjM5Mw==705200136393',
  favicon: 'https://sugarat.top/favicon.ico',
  copyright: 'Copyright (c) 2018-present, 粥里有勺糖',
  url: `${baseUrl}/weekly.rss`,
  icon: false,
  filename: 'weekly.rss',
}
const RSS: Theme.RSSOptions = {
  title: '粥里有勺糖',
  baseUrl,
  description: '你的指尖,拥有改变世界的力量（大前端相关技术分享）',
  id: baseUrl,
  link: baseUrl,
  language: 'zh-cn',
  image: 'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
  favicon: 'https://sugarat.top/favicon.ico',
  copyright: 'Copyright (c) 2018-present, 粥里有勺糖',
  url: `${baseUrl}/feed.rss`,
  /**
   * 最近100篇，避免太大影响解析
   */
  limit: 100
}

const blogTheme = getThemeConfig({
  themeColor: 'el-blue',
  RSS,
  author: '粥里有勺糖',
  comment: {
    repo: 'ATQQ/sugar-blog',
    repoId: 'MDEwOlJlcG9zaXRvcnkyNDEyNDUyOTk',
    category: 'Announcements',
    categoryId: 'DIC_kwDODmEcc84COVc6',
    inputPosition: 'top'
  },
  popover: {
    title: '公告',
    body: [
      { type: 'text', content: '👇公众号👇---👇 微信 👇' },
      {
        type: 'image',
        src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210'
      },
      {
        type: 'text',
        content: '欢迎大家私信&加群交流'
      },
      {
        type: 'button',
        content: '关于作者',
        link: '/aboutme'
      },
      {
        type: 'button',
        content: '加群交流',
        props: {
          type: 'success'
        },
        link: '/group',
      }
    ],
    duration: -1
  },
  friend: {
    list: [
      {
        nickname: '冴羽',
        des: '冴羽的JavaScript博客',
        avatar:
          'https://img.cdn.sugarat.top/mdImg/MTYyNjQ4MzkxMzIxMA==626483913210',
        url: 'https://github.com/mqyqingfeng/Blog'
      },
      {
        nickname: 'Linbudu',
        des: '未来的不可知，是前进的原动力',
        avatar:
          'https://linbudu-img-store.oss-cn-shenzhen.aliyuncs.com/img/48507806.jfif',
        url: 'https://linbudu.top/'
      },
      {
        nickname: '小九',
        des: '日益努力，而后风生水起',
        avatar: 'https://jiangly.com/favicon.ico',
        url: 'https://jiangly.com/'
      },
      {
        nickname: '花喵电台      ',
        des: '曹豪侠和余湾湾还有两只猫的生活记录~',
        avatar:
          'https://pic.fmcat.top/head.jpg?x-oss-process=image/auto-orient,1/resize,m_fill,w_110,h_110/quality,q_90',
        url: 'https://www.fmcat.top'
      },
      {
        nickname: '张成威的网络日志',
        des: '知不足而奋进，望远山而前行',
        avatar: 'https://www.zhangchengwei.work/logo.png',
        url: 'https://www.zhangchengwei.work'
      },
      {
        url: 'https://leelaa.cn',
        avatar: 'https://leelaa.cn/pwa-192x192.png',
        des: '肯了个德的博客',
        nickname: 'LEEDAISEN'
      },
      {
        url: 'https://next.blackcell.fun/',
        avatar: 'https://avatars.githubusercontent.com/u/45719798?v=4',
        des: '物以类聚 人以群分',
        nickname: 'BlackCell'
      },
      {
        url: 'https://blog.yovvis.top',
        avatar: 'https://img.yovvis.top/avatar.png',
        des: '工夫为艺，笃志成技',
        nickname: 'Yovvis\'s Blog'
      },
      {
        nickname: '强少来了',
        des: '互联网产品经理',
        avatar: 'https://fengxiaoqiang.com/images/logo.png',
        url: 'https://fengxiaoqiang.com/'
      },
      {
        nickname: '博友圈',
        des: '独立博客人的专属朋友圈！',
        avatar: '',
        url: 'https://www.boyouquan.com/home'
      },
      {
        nickname: 'Simon He',
        des: '除了coding，我什么都不会',
        avatar: 'https://simonme.netlify.app/black.png',
        url: 'https://simonme.netlify.app/'
      }
    ],
    random: true,
    limit: 6
  },
  search: false,
  recommend: {
    showSelf: true,
    nextText: '下一页',
    style: 'sidebar'
  },
  authorList: [
    {
      nickname: '粥里有勺糖',
      url: 'https://sugarat.top/aboutme.html',
      des: '你的指尖,拥有改变世界的力量'
    }
  ],
  footer: {
    copyright: `粥里有勺糖 2018 - ${new Date().getFullYear()}`,
    icpRecord: {
      name: '蜀ICP备19011724号',
      link: 'https://beian.miit.gov.cn/'
    }
  },
  hotArticle: {
    pageSize: 12
  }
})

const extraHead: any
  = process.env.NODE_ENV === 'production'
    ? [
        [
          'script',
          {
            charset: 'UTF-8',
            id: 'LA_COLLECT',
            src: '//sdk.51.la/js-sdk-pro.min.js'
          }
        ],
        [
          'script',
          {},
          'LA.init({id: "Jgmg5avjAUvoyePS",ck: "Jgmg5avjAUvoyePS",hashMode: true})'
        ],
      ]
    : []

export default defineConfig({
  extends: blogTheme,
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
    ...extraHead
  ],
  vite: {
    server: {
      port: 4000,
      host: '0.0.0.0'
    },
    plugins: [
      RssPlugin(RSSWeekly)
    ],
    optimizeDeps: {
      include: ['element-plus'],
      exclude: ['@sugarat/theme']
    }
  },
  lastUpdated: true,
  themeConfig: {
    outline: {
      level: [2, 3]
    },
    search: {
      provider: 'algolia',
      options: {
        appId: 'F919JCK8WY',
        apiKey: '3eca209ad24bdfc26db63382dd5e4490',
        indexName: 'sugarat_top',
        placeholder: '请输入要搜索的内容...'
      }
    },
    lastUpdatedText: '上次更新于',
    logo: '/logo.png',
    editLink: {
      pattern:
        'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
      text: '去 GitHub 上编辑内容'
    },
    nav: [
      {
        text: '关于我',
        link: '/aboutme'
      },
      {
        text: '备战春秋',
        items: [
          { text: '心得总结', link: '/offer/experience/' },
          { text: '校招考点汇总', link: '/offer/campus/' },
          { text: '面经汇总', link: '/offer/sum-interview/' },
          { text: '复习自查', link: '/offer/review/' }
        ]
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
        text: '计算机基础',
        items: [
          { text: '算法与数据结构', link: '/computerBase/algorithm/' },
          { text: '操作系统', link: '/computerBase/os/' },
          { text: '计算机网络', link: '/computerBase/Internet/' },
          { text: '设计模式', link: '/computerBase/design/' },
          { text: '剑指offer', link: '/computerBase/offer/' }
          // { text: '力扣', link: '/computerBase/leetcode/' }
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
        items: [
          { text: '心得总结', link: '/offer/experience/' },
          { text: '校招考点汇总', link: '/offer/campus/' },
          { text: '面经汇总', link: '/offer/sum-interview/' },
          { text: '复习自查', link: '/offer/review/' },
          { text: '问解', link: '/interview/problem/' },
          { text: 'javascript', link: '/interview/js/' },
          { text: 'css', link: '/interview/css/' },
          { text: '手撕代码', link: '/interview/code/' },
          { text: '性能优化', link: '/interview/performance/' },
          // { text: "网络", link: "/interview/internet/" },
          // { text: '操作系统', link: '/interview/os/' },
          // { text: '设计模式', link: '/interview/design/' },
          { text: '综合问题', link: '/interview/other/' },
          { text: '面经汇总', link: '/offer/sum-interview/' },
          { text: '小程序', link: '/interview/mini/' }
          // { text: '面经', link: '/interview/experience/' }
        ]
      },
      {
        text: '手撕代码',
        items: [
          { text: '数据结构与算法', link: '/coding/algorithm/' },
          { text: 'javascript', link: '/coding/js/' },
          { text: 'css', link: '/coding/css/' }
        ]
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
        text: '线上作品',
        items: [
          {
            text: '轻取(文件收集)',
            link: 'https://ep2.sugarat.top'
          },
          {
            text: '个人图床',
            link: 'https://imgbed.sugarat.top'
          },
          {
            text: '考勤小程序',
            link: 'https://hdkq.sugarat.top/'
          },
          {
            text: '时光恋人',
            link: 'https://lover.sugarat.top'
          },
          {
            text: '在线简历生成',
            link: 'https://resume.sugarat.top/'
          }
        ]
      }
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
