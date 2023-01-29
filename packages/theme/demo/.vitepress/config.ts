import { defineConfigWithTheme } from 'vitepress'
import type { Theme } from '@sugarat/theme'
import path from 'path'
import { getThemeConfig } from '@sugarat/theme/node'

const blogConfig: Partial<Theme.BlogConfig> = {
  // 开启搜索
  // search: false,
  // 精选文章文案
  // hotArticle: {
  //   title: '🔥 自定义标题',
  //   nextText: '下一页',
  //   pageSize: 1
  // },
  // 首页相关
  // home: {
  //   pageSize: 6,
  //   name: '@sugarat/theme',
  //   motto: '粥里有勺糖的博客主题',
  //   inspiring: '基于 Vitepress 定制的主题🎨'
  // },
  // 推荐文章文案
  // recommend: {
  //   title: '🔍 推荐文章',
  //   nextText: '下一页',
  //   pageSize: 1
  // },
  // 文章默认作者
  author: '粥里有勺糖',
  // 评论
  comment: {
    repo: 'ATQQ/sugar-blog',
    repoId: 'MDEwOlJlcG9zaXRvcnkyNDEyNDUyOTk',
    category: 'Announcements',
    categoryId: 'DIC_kwDODmEcc84COVc6',
    inputPosition: 'top'
  }
}

const blogTheme = getThemeConfig(blogConfig)

export default defineConfigWithTheme<Theme.Config>({
  lang: 'zh-cmn-Hans',
  title: '@sugarat/theme',
  description: '粥里有勺糖的博客主题',
  vite: {
    server: {
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        '@sugarat/theme': path.join(__dirname, '../../src/index.ts')
      }
    }
  },
  // lastUpdated: true,
  themeConfig: {
    ...blogTheme
    // lastUpdatedText: '上次更新于',
    // footer: {
    //   message:
    //     '<a target="_blank" href="https://beian.miit.gov.cn/">蜀ICP备19011724号</a>',
    //   copyright: 'MIT Licensed | © 2018-present 粥里有勺糖'
    // },
    // logo: '/logo.png',
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/theme-blog/demo/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    // nav: [
    //   {
    //     text: '关于我',
    //     link: '/aboutme'
    //   },
    //   {
    //     text: '线上作品',
    //     items: [
    //       {
    //         text: '轻取(文件收集)',
    //         link: 'https://ep2.sugarat.top'
    //       },
    //       {
    //         text: '个人图床',
    //         link: 'https://imgbed.sugarat.top'
    //       },
    //       {
    //         text: '考勤小程序',
    //         link: 'https://hdkq.sugarat.top/'
    //       },
    //       {
    //         text: '时光恋人',
    //         link: 'https://lover.sugarat.top'
    //       },
    //       {
    //         text: '在线简历生成',
    //         link: 'https://resume.sugarat.top/'
    //       }
    //     ]
    //   }
    // ],
    // socialLinks: [
    //   {
    //     icon: 'github',
    //     link: 'https://github.com/ATQQ/sugar-blog/tree/master/packages/theme'
    //   }
    // ]
  }
})
