const sidebar = require('./sidebar')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const jsStringify = require('javascript-stringify');
const fs = require('fs')
module.exports = {
  plugins: [
    ["@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: {
          message: "站点有新的内容更新，点击按钮加载最新的内容",
          buttonText: "加载最新的内容",
        },
        popupComponent: "MySWUpdatePopup",
      }],
    [
      "@vuepress-reco/vuepress-plugin-bulletin-popover", {
        title: '公告',
        body: [
          {
            type: 'title',
            content: '欢迎加入交流群 🎉🎉🎉'
          },
          {
            type: 'text',
            content: 'QQ群：1047199470',
            style: 'text-align: center;'
          },
          {
            type: 'text',
            content: '👇公众号👇---👇个人微信👇',
            style: 'text-align: center;'
          },
          {
            type: 'image',
            src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210'
          },
        ],
        footer: [
          // {
          //   type: 'text',
          //   content: '新年快乐，虎虎生威',
          //   style: 'text-align: center;'
          // },
          // {
          //   type: 'button',
          //   link: '/_configDoc/newyear/2022',
          //   style: 'background-color:red;',
          //   text: '领红包',
          // },
          {
            type: 'text',
            content: '美团全年招聘 前端&客户端',
            style: 'text-align: center;'
          },
          {
            type: 'button',
            link: '/_configDoc/show/bole',
            text: '投递',
          }
        ]
      }
    ]
  ],
  configureWebpack(config, isServer) {
    // fs.writeFileSync(isServer ? 'server.js' : 'client.js', jsStringify.stringify(config, null, 2))
    if (!isServer) {
      const jsRule = config.module.rules.find(v => v.test.toString() === '/\\.jsx?$/')
      config.optimization.minimize = true
      config.optimization.minimizer = [
        new ESBuildMinifyPlugin({
          target: 'es2015',
          css: true
        })
      ]
      // jsRule.use = [
      //   {
      //     loader: require.resolve('esbuild-loader'),
      //     options: {
      //       loader: 'jsx',
      //       target: 'es2015'
      //     }
      //   }
      // ]
    }
  },
  title: "粥里有勺糖",
  description:
    "粥里有勺糖的个人博客,记录随笔与学习笔记，大前端相关的知识，高频面试题，个人面经等",
  head: [
    ["link", { ref: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  locales: {
    "/": {
      lang: "zh-CN", // 默认中文
    },
  },
  base: "/",
  markdown: {
    lineNumbers: true,
  },
  theme: "reco",
  themeConfig: {
    lastUpdated: "Last Updated",
    repo: "ATQQ/sugar-blog",
    repoLabel: "Github",
    editLinks: true,
    docsDir: "docs",
    docsBranch: "master",
    nav: [
      {
        text: "关于我",
        link: "/aboutme",
        icon: "reco-account",
      },
      {
        text: "备战春秋",
        items: [
          { text: "心得总结", link: "/offer/experience/" },
          { text: "校招考点汇总", link: "/offer/campus/" },
          { text: "面经汇总", link: "/offer/sum-interview/" },
          { text: "复习自查", link: "/offer/review/" },
        ],
      },
      {
        text: "技术笔记",
        items: [
          { text: "技术教程", link: "/technology/learn/" },
          { text: "模板工程", link: "/technology/tpl/" },
          { text: "源码学习", link: "/technology/source/" },
          { text: "技术概念", link: "/technology/theory/" },
          { text: "个人作品", link: "/technology/works/" },
          { text: "学习笔记", link: "/technology/study/" },
        ],
      },
      {
        text: "计算机基础",
        items: [
          { text: "算法与数据结构", link: "/computerBase/algorithm/" },
          { text: "操作系统", link: "/computerBase/os/" },
          { text: "计算机网络", link: "/computerBase/Internet/" },
          { text: "设计模式", link: "/computerBase/design/" },
          { text: "剑指offer", link: "/computerBase/offer/" },
          // { text: '力扣', link: '/computerBase/leetcode/' }
        ],
      },
      {
        text: "大前端",
        items: [
          { text: "javascript", link: "/bigWeb/js/" },
          { text: "vue", link: "/bigWeb/vue/" },
          { text: "html", link: "/bigWeb/html/" },
          { text: "css", link: "/bigWeb/css/" },
          { text: "🌏浏览器专题", link: "/bigWeb/browser/" },
          { text: "Web性能优化", link: "/bigWeb/performance/" },
          { text: "regexp", link: "/bigWeb/regexp/" },
          { text: "node", link: "/bigWeb/node/" },
        ],
      },
      {
        text: "面试",
        items: [
          { text: "问解", link: "/interview/problem/" },
          { text: "javascript", link: "/interview/js/" },
          { text: "css", link: "/interview/css/" },
          { text: "手撕代码", link: "/interview/code/" },
          { text: "性能优化", link: "/interview/performance/" },
          // { text: "网络", link: "/interview/internet/" },
          // { text: '操作系统', link: '/interview/os/' },
          // { text: '设计模式', link: '/interview/design/' },
          { text: "综合问题", link: "/interview/other/" },
          { text: "面经汇总", link: "/offer/sum-interview/" },
          { text: "小程序", link: "/interview/mini/" },
          // { text: '面经', link: '/interview/experience/' }
        ],
      },
      {
        text: "手撕代码",
        items: [
          { text: "数据结构与算法", link: "/coding/algorithm/" },
          { text: "javascript", link: "/coding/js/" },
          { text: "css", link: "/coding/css/" },
        ],
      },
      {
        text: "个人站点",
        icon: "reco-message",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/ATQQ/sugar-blog",
            icon: "reco-github",
          },
          {
            text: "博客园",
            link: "https://www.cnblogs.com/roseAT/",
            icon: "reco-bokeyuan",
          },
          {
            text: "掘金",
            link: "https://juejin.im/user/1028798615918983",
            icon: "reco-juejin",
          },
          // {
          //   text: "GitBook-blog",
          //   link: "https://sugar-at.gitbook.io/blog-article/",
          //   icon: "reco-blog",
          // },
          // {
          //   text: "GitBook-ES6",
          //   link: "https://sugar-js.gitbook.io/-1/",
          //   icon: "reco-document",
          // },
        ],
      },
      {
        text: "线上作品",
        icon: "reco-other",
        items: [
          {
            text: "轻取(文件收集)",
            link: "https://ep2.sugarat.top",
          },
          {
            text: "个人图床",
            link: "https://imgbed.sugarat.top",
          },
          {
            text: "考勤小程序",
            link: "https://hdkq.sugarat.top/",
          },
          {
            text: "时光恋人",
            link: "https://lover.sugarat.top",
          },
          {
            text: "在线简历生成",
            link: "https://resume.sugarat.top/",
          },
        ],
      },
      // {
      //   text: "时间线",
      //   link: "/timeline/",
      //   icon: "reco-date",
      // },
      {
        text: "留言板",
        link: "/_configDoc/show/messagePanel",
        icon: "reco-suggestion",
      },
    ],
    sidebar,
    displayAllHeaders: false,
    sidebarDepth: 2,
    type: "blog",
    logo: "/icon.png",
    authorAvatar: "/icon.png",
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    subSidebar: "auto",
    // 最后更新时间
    lastUpdated: "Last Updated",
    // 作者
    author: "粥里有勺糖",
    // 备案号
    record: "蜀ICP备19011724号",
    recordLink: "https://beian.miit.gov.cn/",
    valineConfig: {
      appId: "L3HgpT2JA3KJFUots3ql2AAd-gzGzoHsz",
      appKey: "cmU9sBLuIqYl5QLS1aCYIKzK",
      showComment: false,
    },
    // 项目开始时间
    startYear: "2018",
    friendLink: [
      {
        title: "Linbudu",
        desc: "未来的不可知，是前进的原动力",
        email: "linbudu@qq.com",
        link: "https://linbudu.top/",
        logo:
          "https://linbudu-img-store.oss-cn-shenzhen.aliyuncs.com/img/48507806.jfif",
      },
      {
        title: "kweku",
        desc: "所有的出乎意料都是努力的结果",
        email: "631199793@qq.com",
        link: "http://kweku.top/",
        logo:
          "https://img.cdn.sugarat.top/mdImg/MTYwNjE0NjI1ODc2Ng==606146258766",
      },
      {
        title: "炽翎",
        desc: " A full stack developer from China🇨🇳.",
        link: "https://juejin.im/user/3122268753634541",
        logo:
          "https://img.cdn.sugarat.top/mdImg/MTYwNjE0NjM3Njg2OA==606146376868",
      },
      {
        title: "神三元",
        desc:
          "热爱技术，深耕前端，乐于分享。     掘金小册《React Hooks 与 Immutable 数据流实战》作者",
        link: "http://47.98.159.95/my_blog",
        logo:
          "https://img.cdn.sugarat.top/mdImg/MTYwNjE0NjM0NzA0MA==606146347040",
      },
      {
        title: "冴羽",
        desc: "冴羽的JavaScript博客",
        link: "https://github.com/mqyqingfeng/Blog",
        logo:
          "https://img.cdn.sugarat.top/mdImg/MTYyNjQ4MzkxMzIxMA==626483913210",
      },
      {
        title: "YAMI",
        desc: "💡在这里分享我的灵感",
        link: "https://blog.yami.love/",
        logo:
          "https://img.cdn.sugarat.top/mdImg/MTYyNjQ4Mzg3ODUwMg==626483878503",
      }
    ],
  },
};
