# @sugarat/theme

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
