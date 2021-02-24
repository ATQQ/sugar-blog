const sidebar = require("./siders/index");
const fs = require("fs");
const path = require("path");
const httpsConfig = {
  host: "local.sugarat.top",
  devServer: {
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "./../../src/ca/local.sugarat.top-key.pem")
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "./../../src/ca/local.sugarat.top.pem")
      ),
    },
  },
};
const isHttps = process.env.ENV_SCHEMA === "https";
module.exports = {
  ...(isHttps ? httpsConfig : {}),
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
            content: '👇微信群👇---👇个人微信👇',
            style: 'text-align: center;'
          },
          {
            type: 'image',
            src: 'http://img.cdn.sugarat.top/mdImg/MTYxNDE0OTYzNzE1MQ==614149637151'
          },
        ],
      }
    ]
  ],
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
          { text: "校招考点", link: "/offer/campus/" },
          { text: "心得总结", link: "/offer/experience/" },
          { text: "20年春招", link: "/offer/spring20/" },
          { text: "20年秋招", link: "/offer/autumn20/" },
          { text: "21年春招", link: "/offer/spring21/" },
        ],
      },
      {
        text: "技术笔记",
        items: [
          { text: "技术教程", link: "/technology/learn/" },
          { text: "技术概念", link: "/technology/theory/" },
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
          { text: "浏览器", link: "/bigWeb/browser/" },
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
          {
            text: "GitBook-blog",
            link: "https://sugar-at.gitbook.io/blog-article/",
            icon: "reco-blog",
          },
          {
            text: "GitBook-ES6",
            link: "https://sugar-js.gitbook.io/-1/",
            icon: "reco-document",
          },
        ],
      },
      {
        text: "时间线",
        link: "/timeline/",
        icon: "reco-date",
      },
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
          "https://mirror-gold-cdn.xitu.io/168e084832fd5ec238f?imageView2/1/w/180/h/180/q/85/format/webp/interlace/1",
      },
      {
        title: "YAMI",
        desc: "💡在这里分享我的灵感",
        link: "https://blog.yami.love/",
        logo:
          "https://blog.yami.love/avatar.jpg",
      }
    ],
  },
};
