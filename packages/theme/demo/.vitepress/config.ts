import path from 'path'
import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({
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
})

export default defineConfig({
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
  themeConfig: {
    ...blogTheme
  }
})
