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
  // article: {
  //   readingTime: false
  // },
  // alert: {
  //   type: 'success',
  //   title: '标配内容，这是一个不会自动关闭的弹窗',
  //   duration: 0
  // },
  // popover: {
  //   title: '📢 广而周知 📢',
  //   duration: -1,
  //   body: [
  //     {
  //       type: 'title',
  //       content: '小标题',
  //       style: 'color:red'
  //     },
  //     { type: 'text', content: '👇公众号👇---👇 微信 👇' },
  //     {
  //       type: 'image',
  //       src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210'
  //     }
  //   ],
  //   footer: [
  //     {
  //       type: 'text',
  //       content: 'footer 与 body 结构一致'
  //     },
  //     {
  //       type: 'button',
  //       link: 'https://sugarat.top',
  //       content: '作者博客',
  //       props: {
  //         round: true
  //       }
  //     }
  //   ]
  // },
  friend: [
    {
      nickname: '粥里有勺糖',
      des: '你的指尖用于改变世界的力量',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
      url: 'https://sugarat.top'
    },
    {
      nickname: 'Vitepress',
      des: 'Vite & Vue Powered Static Site Generator',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTI2NzY1Ng==674995267656',
      url: 'https://vitepress.vuejs.org/'
    }
  ],
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
  description: '粥里有勺糖的博客主题，基于 vitepress 实现',
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
