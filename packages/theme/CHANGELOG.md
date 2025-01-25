# @sugarat/theme

## 0.5.4

### Patch Changes

- feat(announcement): `content` support markdown
- feat(announcement): support add `style` tag
- feat(rss): 支持用户传入自定义 transform
- fix(rss): html render without markdown env
- fix(oml2d): options not effective 
- chore(shared): `getVitePressPages` support markdown env
- Updated dependencies
  - @sugarat/theme-shared@0.0.4
  - vitepress-plugin-announcement@0.1.4
  - vitepress-plugin-rss@0.3.1
  - vitepress-plugin-pagefind@0.4.13
  - vitepress@1.6.3

## 0.5.3

### Patch Changes

- Updated dependencies
  - vitepress-plugin-pagefind@0.4.12

## 0.5.3

### Patch Changes

- Updated dependencies
  - vitepress-plugin-pagefind@0.4.11

## 0.5.2

### Patch Changes

- fix: sass warn - [legacy-js-api](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/)
- chore: update dependencies
- chore: chunkSizeWarningLimit 2048

## 0.5.1

### Patch Changes

- chore: Improving i18n support
- fix: dev auto reload failed

## 0.5.0

### Minor Changes

- feat: inline group icons plugin
- feat: support i18n
- feat: support rewrites and dynamic routes
- chore: Optimization of theme reloading logic in dev mode
- Updated dependencies
  - @sugarat/theme-shared@0.0.3
  - vitepress-plugin-pagefind@0.4.11
  - vitepress-plugin-rss@0.3.0
  - vitepress-plugin-announcement@0.1.3

## 0.4.13

### Patch Changes

- feat: split buildin plugin [vitepress-plugin-announcement](https://www.npmjs.com/package/vitepress-plugin-announcement)

## 0.4.12

### Patch Changes

- fix: utc -number invalid date

## 0.4.11

### Patch Changes

- feat: 支持隐藏 recommend 部分的日期
- feat: PC 文章列表 title 添加 span 包裹
- chore: 新增 [vitepress-plugin-51la](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-51la) 插件

## 0.4.10

### Patch Changes

- feat: support custom analyze titles
- feat: support custom formatShowDate
- Updated dependencies
  - vitepress-plugin-rss@0.2.10

## 0.4.9

### Patch Changes

- Updated dependencies
  - vitepress-plugin-pagefind@0.4.10
  - vitepress-plugin-rss@0.2.9

## 0.4.8

### Patch Changes

- chore: support rewrite version text
- chore: sass warning
- Updated dependencies
  - vitepress-plugin-pagefind@0.4.9
  - vitepress@1.3.1

## 0.4.7

### Patch Changes

- fix: init project withBase error
- chore: use vitepress@1.3.0

## 0.4.6

### Patch Changes

- Updated dependencies
  - @sugarat/theme-shared@0.0.2
  - vitepress-plugin-pagefind@0.4.3
  - vitepress-plugin-rss@0.2.8

## 0.4.5

### Patch Changes

- fix: 自定义主题色，防止展示时页面颜色闪烁

## 0.4.4

### Patch Changes

- feat: RSS 生成支持配置多个
- feat: pagefind 配置复用插件配置
- chore: 分离 shared 方法库
- Updated dependencies
  - vitepress-plugin-pagefind@0.4.2
  - vitepress-plugin-rss@0.2.7

## 0.4.3

### Patch Changes

- fix: 新建文件时间获取失败显示 NaN
- feat: 文章页 hover 时完整展示缩略的时间

## 0.4.2

### Patch Changes

- feat: 支持设置数据卡片的标题

## 0.4.1

### Patch Changes

- fix: mermaid build error

## 0.4.0

### Minor Changes

- feat: support diy friend & tags title
- fix: readme spelling error.
- fix: Empty label home page display redundant problem
- chore: build speed up
  - break change: mermaid default value change to false
- Updated dependencies
  - vitepress-plugin-pagefind@0.4.1
  - vitepress@1.2.3

## 0.3.6

### Patch Changes

- fix: 分页通过左上角无法回到首页
- chore: Updated dependencies
  - vitepress-plugin-pagefind@0.3.3
  - vitepress-plugin-rss@0.2.6

## 0.3.5

### Patch Changes

- feat: 公告优化
  - 支持收起自动闪动
  - 跳转优化，同站点不再刷新页面
  - 支持自定义展示策略（页面维度）
- feat: pagefind 插件更新
  - 支持跳转目录
  * 结果优化，支持预览
  * 搜索关键词没高亮问题修复
  * 构建时间优化
  * 添加 peer deps 减少偶现构建失败的问题
- fix: 首页分页跳动问题
- fix: 评论数据展示异常（切换路由不刷新）
- Updated dependencies
  - vitepress-plugin-pagefind@0.3.2
  - oh-my-live2d@0.19.3
  - vitepress@1.2.2

## 0.3.4

### Patch Changes

- Updated dependencies
  - vitepress-plugin-rss@0.2.4

## 0.3.3

### Patch Changes

- feat：支持首页 cover 图添加 image style
- chore：导航 logo 样式优化
- chore: reduce element css size
- chore: 依赖升级，无用依赖移除，peerDeps 调整

## 0.3.2

### Patch Changes

- fix: description xss error

## 0.3.1

### Patch Changes

- feat: dev mode 支持首页内容自动刷新
- feat: 支持深色模式更加丝滑的过渡动画
- chore：首页加载优化，水合问题优化
- fix: 首页和侧边栏跳转导致页面刷新

## 0.3.0

### Minor Changes

- feat: 支持 [artalk](https://artalk.js.org/) 评论系统
- feat: 支持文章底部打赏按钮
- fix: 首页文章列表的封面拉伸异常
- chore: 依赖升级
  - vitepress 1.0.2

## 0.2.30

### Patch Changes

- feat: 新增各个模块可选开启的开关
- fix: Hydration error
- Updated dependencies
  - vitepress-plugin-pagefind@0.2.14
  - oh-my-live2d@0.15.2

## 0.2.29

### Patch Changes

- fix: 生成的链接兼容 `cleanUrls` 配置

## 0.2.28

### Patch Changes

- feat: footer 支持更丰富的配置
- chore: 依赖升级

## 0.2.27

### Patch Changes

- chore: oh-my-live2d 依赖升级，添加外部覆盖版本操作引导

## 0.2.26

### Patch Changes

- feat: 内置 oml2d 看板娘

## 0.2.25

### Patch Changes

- fix: showSelf 渲染异常
- Updated dependencies
  - vitepress-plugin-pagefind@0.2.13

## 0.2.24

### Patch Changes

- feat: 支持调整阅读时间分析组件位置，详见全局配置 `article` 属性
- feat: 左侧推荐列表可以自定义关联关键词，详见文章配置 `recommend` 属性

| top(原)                                                                       | inline(新)                                                                    | newLine(新)                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| ![](https://img.cdn.sugarat.top/mdImg/sugar/21aa2571b60f76e7401b66af851009bb) | ![](https://img.cdn.sugarat.top/mdImg/sugar/5da6e5e56bde48265e706bc004e2ad41) | ![](https://img.cdn.sugarat.top/mdImg/sugar/50e9ec84b37af64f723c3b477b99283a) |

## 0.2.23

### Patch Changes

- fix: 左侧推荐列表在很多文章时，首次展示页码不正确
- feat: 兼容 cover 指向非public 目录文件封面展示

```md
---
cover: /abc.png
---

# 标题

<img src="./abc.png" style="display: none;"/>
```

## 0.2.22

### Patch Changes

- Updated dependencies
  - vitepress-plugin-pagefind@0.2.12
  - vitepress-plugin-rss@0.2.2
- feat: 内置 pagefind 搜索自动过滤 `publish:false` 文章
- feat: RSS 插件支持配置忽略 `publish:false` 的影响

## 0.2.21

### Patch Changes

- chore: 适配 [vitepress@1.0.0-rc.43](https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md)

## 0.2.20

### Patch Changes

- Updated dependencies
  - vitepress-plugin-pagefind@0.2.11

## 0.2.19

### Patch Changes

- feat: 友链列表实现使用swiper

## 0.2.18

### Patch Changes

- feat: 内置时间线组件
- fix: 修复回到顶部按钮点击不生效
- chore: SSG 内容优化

## 0.2.17

### Patch Changes

- feat: 添加回到顶部组件
- feat: 支持移动端自动收起公告
- feat：评论组件优化（最小化新样式）
- feat：图标自定义（公告，评论，回到顶部）
- fix：流程图配置构建无效

## 0.2.16

### Patch Changes

- fix: get cover fail in table
- Updated dependencies
  - vitepress-plugin-rss@0.2.1
  - vitepress@1.0.0-rc.36

## 0.2.15

### Patch Changes

- fix: recommend active error in index.md
- fix: error in coverImgTransform function
- feat: support for customizing docMeta insert position
- feat: 内置 markdown-it-task-checkbox 插件

## 0.2.14

### Patch Changes

- fix: build cover error

## 0.2.13

### Patch Changes

- fix: 自动取封面图,相对路径构建后不生效的问题

## 0.2.12

### Patch Changes

- fix: 相对路径的图片无法自动识别cover

## 0.2.11

### Patch Changes

- fix: randomFriendLink Error

## 0.2.10

### Patch Changes

- feat: Remember the closed state.
- chore: update rc32

## 0.2.9

### Patch Changes

- feat: 友链支持随机顺序和滚动
- fix: tag error ([#154](https://github.com/ATQQ/sugar-blog/pull/154)) ([@itcatplayit](https://github.com/itcatplayit))
- chore: update rc31
- chore: devtool warn fix

## 0.2.8

### Patch Changes

- 依赖升级
  - vitepress-plugin-rss@0.2.0
  - vitepress@1.0.0-rc.29

## 0.2.7

### Patch Changes

- fix: 设置base后logo不生效

## 0.2.6

### Patch Changes

- fix: nav-bar-content-before slot

## 0.2.5

### Patch Changes

- fix: ERR_REQUIRE_ESM
  - lock vitepress-plugin-mermaid version 2.0.13

## 0.2.4

### Patch Changes

- feat: recommend 支持多种排序
- feat: 支持基于 bun 的模板
- feat: footer 配置支持flat模式
- feat: 头像合入卡片展示(支持切换为`split`模式)
- feat: 移动端支持头像展示（可关闭`minScreenAvatar: false`）
- chore: 深色模式调整卡片背景色
- chore: 评论更加丝滑的切换深色模式
  - 使用 [@giscus/vue](https://github.com/giscus/giscus-component) 组件替换 giscus 脚本

## 0.2.3

### Patch Changes

- Updated dependencies
  - vitepress-plugin-rss@0.1.3

## 0.2.2

### Patch Changes

- feat: 默认开启 tabs 支持
- chore: 优化 Mermaid 配置的生成逻辑
- chore: 内置RSS替换为 [vitepress-plugin-rss](https://www.npmjs.com/package/vitepress-plugin-tabs)
- chore: 架构优化
  - 便于独立在VitePress使用
  - 无用依赖清理
  - 主题无关配置屏蔽
  - 无用依赖移除

## 0.2.1

### Patch Changes

- chore: update version link

## 0.2.0

### Minor Changes

- feat: 支持首页展示头像
- feat: 支持更加简单的定义底部footer
- chore: 默认使用rc17

## 0.1.50

### Patch Changes

- fix: setActiveLink [#138](https://github.com/ATQQ/sugar-blog/issues/138)
- Updated dependencies
  - vitepress-plugin-pagefind@0.2.10

## 0.1.49

### Patch Changes

- feat: 支持设置 RSS 图标的 ariaLabel 同时添加默认 title

## 0.1.48

### Patch Changes

- fix: 移动端公告被遮挡
- fix: 默认 emoji 在部分设备上不展示，使用 SVG 替代
- fix: 插槽图片无法预览
- fix: 未统计 hidden 的文章数量

## 0.1.47

### Patch Changes

- Updated dependencies
  - vitepress-plugin-pagefind@0.2.9

## 0.1.46

### Patch Changes

- chore: pagefind 兼容 V1 版本

## 0.1.45

### Patch Changes

- style: 链接样式调整

## 0.1.44

### Patch Changes

- fix: 首页背景色失效

## 0.1.43

### Patch Changes

- feat: 适配 rc11 版本
- feat: 内置多套主题色（不一定好看，从 VP 和 element 移植，欢迎自荐）
- feat: 统一博客整体的颜色
- feat: 支持透传默认主题的插槽
- fix: 模式切换，评论组件未跟随

## 0.1.42

### Patch Changes

- feat: RSS 功能优化

## 0.1.41

### Patch Changes

- feat: RSS html 内容渲染

## 0.1.40

### Patch Changes

- feat: RSS 支持
- fix：nav title 样式异常
- chore：重新组织源码结构
- chore: 依赖升级
- chore: recommend 卡片默认样式调整为 sidebar

## 0.1.39

### Patch Changes

- feat: 支持配置解析 `frontmatter` 的时区
- fix: 单独使用主题的 define 方法报错
- feat: 支持切换主题 sidebar 风格
- fix: 相关文章的序号又从 1 开始
- fix: 2 位数序号展示折行

## 0.1.38

### Patch Changes

- fix: 搜索默认情况下无法展示 index.md 内容

## 0.1.37

### Patch Changes

- chore: 默认打开流程图支持

## 0.1.36

### Patch Changes

- feat: 默认开启 Mermaid 流程图支持
- fix: vitepress-plugin-mermaid 报错

## 0.1.36-beta.2

### Patch Changes

- fix: mermaid error

## 0.1.36-beta.1

### Patch Changes

- chore: devDependencies

## 0.1.36-beta.0

### Patch Changes

- chore: merpaid

## 0.1.35

### Patch Changes

- chore: update quickStart sop
- feat: Add support for rendering HTML in blog descriptions
- fix: logic for getting theme cover image

## 0.1.34

### Patch Changes

- fix: mermaid error

## 0.1.33

### Patch Changes

- feat: 流程图支持

## 0.1.32

### Patch Changes

- feat: 支持 publish 参数控制文章是否展示
- feat: scrollbar 美化

## 0.1.31

### Patch Changes

- feat: 内置单独的作品展示页组件
- fix: 修复使用主题默认 Badge 不生效的问题
- fix: recommend 和 sidebar 展示冲突

## 0.1.30

### Patch Changes

- feat: friend link 支持设置 alt

## 0.1.29

### Patch Changes

- fix: 标题中的空格被自动移除
- feat: 内置 [vitepress-plugin-tabs](https://www.npmjs.com/package/vitepress-plugin-tabs) 能力，使用见`主题配置 - 组件能力`

## 0.1.28

### Patch Changes

- fix: tag 设置为字符串时展示异常

## 0.1.27

### Patch Changes

- fix: element ui 分页组件展示异常

## 0.1.26

### Patch Changes

- fix: 翻页后回到首页又回到开头

## 0.1.25

### Patch Changes

- feat: 文章页支持 tag 展示和跳转
- feat: 作者支持跳转外链
- feat: 优化时间展示，支持单独控制显隐
- feat: 支持通过配置控制 Cover 封面的展示
- feat: 支持文章封面展示
- fix: 标签回退不生效
- chore: 一些 TODO 更新
- chore: 移动端首页卡片样式微调

## 0.1.24

### Patch Changes

- feat: 左侧相关文章，高亮当前正在浏览的文章

## 0.1.23

### Patch Changes

- fix: RecommendArticle 不支持多级中文路径
- feat: RecommendArticle 支持设置自定义过滤与是否展示正在浏览文章

## 0.1.22

### Patch Changes

- fix: ctrl+k open browser search

## 0.1.21

### Patch Changes

- fix: index.md 路径无法正常展示时间信息

## 0.1.20

### Patch Changes

- feat: 内置 pagefind 搜索针对中文优化
- fix: 内置 pagefind 在自定义 base 后无效
- chore: 没有 git 仓库时，打印 Not 日志
- chore: pagefind 引导使用独立的插件

## 0.1.19

### Patch Changes

- fix: dev not defined error
- chore: 主题的 exports 添加 package.json
- fix: default template lang error

## 0.1.18

### Patch Changes

- fix: 设置 base 路径后发布时间显示 0 秒
- fix: 评论跳转按钮在部分场景展示异常

## 0.1.17

- fix: search: false 不生效

## 0.1.16

### Patch Changes

- fix: 全局 BG 色和 Vitepress 主题样式冲突

## 0.1.15

### Patch Changes

- feat: 分离可独立使用的的 搜索插件[pagefind](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-pagefind)
- feat: 搜索框展示 UI 优化，支持定制文案，展示适配移动端
- fix: 搜索结果未全部展示
- fix: 中文文件名文章时间显示 NaN

## 0.1.14

- chore: 主题配置改为继承的方式引入

## 0.1.13

- fix: route support [withBase](https://vitepress.dev/reference/runtime-api#withbase)

## 0.1.12

- fix: 搜索框影响首页样式

## 0.1.11

- chore: 文档内容完善
- feat：内置搜索弹窗 UI 更新 - 类似 algolia（基于 [vue-command-palette](https://github.com/xiaoluoboding/vue-command-palette/blob/main/src/assets/scss/algolia.scss)）
  ![](https://img.cdn.sugarat.top/mdImg/MTY3OTEyNDM0ODQ4OA==679124348488)

## 0.1.10

- feat: 支持全文搜索（基于 [pagefind](https://pagefind.app/) 实现）
  - `search: 'pagefind'`

## 0.1.9

### Patch Changes

- feat: 支持自定义推荐文章的展示顺序

## 0.1.8

### Patch Changes

- feat: 支持首页文章置顶能力

## 0.1.7

### Patch Changes

- fix: 文章页顶部展示遮挡问题
- fix: 刷新页面评论偶现不展示
- chore: 模板里添加自定义背景图示例
- chore: 更新文档站介绍

## 0.1.6

### Patch Changes

- fix: 最新版 vitepress 首页顶部 Nav 穿透背景图
- fix: 修复 window 路径问题

## 0.1.5

### Patch Changes

- feat: 支持单独使用博客的主题能力但不影响首页布局

## 0.1.4

### Patch Changes

- fix: cover 提取失败

## 0.1.3

### Patch Changes

- fix: 模板启动构建报错

## 0.1.2

### Patch Changes

- fix: 升级 element-plus 版本，解决构建报错
- feat: 追加主题的导出方式 default

## 0.1.1

### Patch Changes

- fix: 没有初始化 git 之前启动报错
- fix: 文章作者信息重复渲染
- chore: 引导文案更新，记录 degit bug 解法
- chore: 包信息修改

## 0.1.0

### Minor Changes

- feat: 完成初版博客主题的开发
- feat: 支持评论
- feat: 支持全局弹窗 Alert
- feat: 支持全局公告 Popover
- feat: 更多见文档 [主题配置](https://theme.sugarat.top/config/frontmatter.html) [全局配置](https://theme.sugarat.top/config/frontmatter.html)
