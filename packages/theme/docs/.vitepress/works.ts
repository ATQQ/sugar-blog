import type { Theme } from '@sugarat/theme'

const workConfig: Theme.UserWorks = {
  title: '个人项目/线上作品',
  description: '记录开发的点点滴滴',
  topTitle: '最近&积极维护🔥',
  list: [
    {
      top: 1,
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
      top: 2,
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
      top: 3,
      title: '七牛云 OSS 图床',
      description: '基于七牛云对象存储服务搭建的图床应用，前端纯静态，无需后端',
      time: {
        start: '2019/12/31'
      },
      github: {
        owner: 'ATQQ',
        repo: 'image-bed-qiniu',
        branch: 'master',
        path: 'packages/client'
      },
      url: 'https://imgbed.sugarat.top/',
      tags: ['Vue'],
      cover:
            'https://img.cdn.sugarat.top/mdImg/sugar/d1b087516b60642d9556c470919e6b0b'
    }
  ]
}

export default workConfig
