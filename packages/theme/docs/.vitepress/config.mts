import path from 'node:path'
import { defineConfig } from 'vitepress'
import { La51Plugin } from 'vitepress-plugin-51la'
import packageJSON from '../../package.json'
import { blogTheme } from './blog-theme'

export default defineConfig({
  extends: blogTheme,
  metaChunk: true,
  sitemap: {
    hostname: 'https://theme.sugarat.top',
  },
  cleanUrls: false,
  lang: 'zh-cn',
  title: '@sugarat/theme',
  description: '粥里有勺糖的博客主题，基于 vitepress 实现',
  rewrites: {
    'test/abc/hello/test.md': 'abc/test.md'
  },
  vite: {
    resolve: {
      alias: {
        '@sugarat/theme': path.join(__dirname, '../../src/index.ts')
      }
    },
    plugins: [
      La51Plugin({
        id: 'Jyzk2AcXA3JsYbrG',
        ck: 'Jyzk2AcXA3JsYbrG'
      })
    ]
  },
  themeConfig: {
    logo: '/logo.png',
    nav: [
      {
        text: `v${packageJSON.version}`,
        link: '/changelog'
      },
      {
        text: '关于',
        link: '/about'
      },
      {
        text: '案例',
        link: '/example/'
      },
      {
        text: '个人作品展示',
        link: '/work'
      },
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
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ATQQ/sugar-blog/tree/master/packages/theme'
      },
      {
        icon: 'x',
        link: 'https://x.com/Mr_XiaoZou'
      }
    ],
    editLink: {
      pattern:
        'https://github.com/ATQQ/sugar-blog/tree/master/packages/theme/docs/:path',
      text: '去 GitHub 上编辑内容'
    },
    lastUpdatedText: '上次更新于',
    outline: {
      level: [2, 3],
      label: '目录'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关推荐'
  },
  lastUpdated: true,
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-cn'
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/'
    }
  }
})
