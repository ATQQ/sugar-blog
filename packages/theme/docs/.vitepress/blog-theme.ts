import process from 'node:process'
import type { Theme } from '@sugarat/theme'
import { getThemeConfig } from '@sugarat/theme/node'

export const workConfig: Theme.UserWorks = {
  title: '个人项目/线上作品',
  description: '记录开发的点点滴滴',
  topTitle: '举些🌰',
  list: [
    {
      title: '博客主题 @sugarat/theme',
      description: '基于 vitepress 实现的博客主题',
      time: {
        start: '2023/01/29'
      },
      github: {
        owner: 'ATQQ',
        repo: 'sugar-blog',
        branch: 'master',
        path: 'packages/theme'
      },
      status: {
        text: '积级维护'
      },
      url: 'https://theme.sugarat.top',
      cover:
        'https://img.cdn.sugarat.top/mdImg/MTY3MzE3MDUxOTMwMw==673170519303',
      tags: ['Vitepress', 'Vue'],
      links: [
        {
          title: '一个简约风的VitePress博客主题',
          url: 'https://juejin.cn/post/7196517835380293693'
        }
      ]
    },
    {
      title: 'EasyPicker(轻取)',
      description:
        '在线文件收集系统，支持各种文件的收集，一站式存储，提交者无需注册',
      time: {
        start: '2019/03/27'
      },
      github: {
        owner: 'ATQQ',
        repo: 'easypicker2-client',
        branch: 'main'
      },
      status: {
        text: '积级维护'
      },
      url: 'https://docs.ep.sugarat.top',
      cover:
        'https://img.cdn.sugarat.top/mdImg/MTY3ODAwMzU3MTc2Ng==678003571766',
      tags: ['Vue'],
      links: [
        {
          title: '提交示例',
          url: 'https://ep2.sugarat.top/task/627bd3b18a567f1b47bcdace'
        },
        { title: '私有化部署', url: 'https://docs.ep.sugarat.top/deploy/' }
      ]
    },
    {
      title: '个人博客',
      description: '✍️📚我写博客的地方🤪🤪🤪，记录随笔与学习笔记',
      time: {
        start: '2020/02/18'
      },
      github: 'https://github.com/ATQQ/sugar-blog',
      url: 'https://sugarat.top',
      tags: ['Vitepress', 'Vue'],
      cover:
        'https://img.cdn.sugarat.top/mdImg/MTY3MzE3MDUxOTMwMw==673170519303',
      links: [
        { title: '掘金', url: 'https://juejin.cn/user/1028798615918983' },
        { title: 'GitHub主页', url: 'https://github.com/ATQQ' }
      ]
    },
    {
      title: '示例1',
      description: `项目介绍${'阿巴'.repeat(50)}`,
      time: {
        start: '2022/03/27'
      },
      status: {
        text: '内置badge',
        type: 'danger'
      },
      top: 1,
      github: 'https://github.com/ATQQ/sugar-blog',
      url: 'https://sugarat.top',
      tags: ['Vitepress', 'Vue'],
      cover: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ],
      links: [
        { title: '掘金', url: 'https://juejin.cn/user/1028798615918983' },
        { title: 'GitHub主页', url: 'https://github.com/ATQQ' }
      ]
    },
    {
      title: '示例2',
      description: `项目介绍${'哈哈'.repeat(50)}`,
      time: {
        start: '2022/03/27'
      },
      status: {
        text: '内置badge',
        type: 'tip'
      },
      top: 2,
      github: 'https://github.com/ATQQ/sugar-blog',
      tags: ['Vitepress'],
      cover: {
        urls: [
          'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
          'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
          'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
          'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
          'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
          'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
        ],
        layout: 'list'
      },
      links: [
        { title: '自定义链接', url: 'https://juejin.cn/user/1028798615918983' }
      ]
    }
  ]
}

const baseUrl = 'https://theme.sugarat.top'
const RSS: Theme.RSSOptions = {
  title: '@sugarat/theme',
  baseUrl,
  copyright: 'Copyright (c) 2023-present, 粥里有勺糖',
}

export const blogTheme = getThemeConfig({
  RSS,
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
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
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
        content: '欢迎大家加群&私信交流'
      },
      {
        type: 'text',
        content: '文章首/文尾有群二维码',
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
    duration: 0
  },
  works: workConfig,
  footer: {
    copyright: 'MIT License | 粥里有勺糖',
  }
})

export const extraHead: any
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
          'LA.init({id:"Jyzk2AcXA3JsYbrG",ck:"Jyzk2AcXA3JsYbrG",hashMode:true})'
        ]
      ]
    : []
