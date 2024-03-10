---
sticky: 998
description: 主题的开发更新计划
sidebar: false
---
# 🥔 开发计划

## 正在进行中

* [ ] 文章支持短链
* [ ] 时区问题（对齐 VitePress默认逻辑），同时支持自定义时区（引入第三方时间处理库）
* [ ] 文章时间：支持选择显示创建时间，而非最后更新时间
* [ ] pagefind 系列优化
  * [ ] 支持跳转目录
  * [ ] 结果优化，支持预览
* [ ] 首页独立BG图，参考 [友人Aの博客](http://niubin.site/)
* 文档
  * [ ] VitePress 资源推荐
  * [ ] VitePress 常见问题解答（deadLink，markdown，frontmatter）
* [ ] 主题部分能力分离为插件（公告，评论，回到顶部）

## 已完成

近期完成：
* [x] github pages example
* [x] 左侧推荐列表可以自定义
* [x] 阅读时间分析支持手动设置位置
* [x] 左侧推荐列表在很多文章时，首次展示页码不正确。
* [x] 兼容 cover 指向非public 目录文件封面展示。
* [x] 友链列表实现调整

:::details 更多归档
* [x] 内置高频使用的 markdown插件，参考 <https://vitepress.yiov.top/plugin.html>
* [x] SSG 生成内容优化
* [x] 流程图配置构建无效
* [x] 文章页支持快速回到顶部功能
* [x] 公告（支持：自动收起移动端，自定义图标）
* [x] 评论（支持：自定义文案&图标，移动端自动最小化）
* [x] 默认主题配置文案
* [x] frontmatter汇总
* [x] 博客案例集合
* [x] 内置 [markdown-it-task-checkbox](https://github.com/linsir/markdown-it-task-checkbox) 插件
* [x] 未统计hidden的文章数量
* [x] 首页支持头像展示
* [x] 图片懒加载(vitepress 官方支持)
* [x] 集成sitemap(vitepress 官方支持)
* [x] emoji 展示缺陷
* [x] 支持独立使用主题部分能力
* [x] recommend 支持排序
* [x] 评论更加丝滑的切换主题
* [x] tabs能力内置
* [x] footer 支持更灵活的布局
* [x] 头像合入卡片展示
* [x] 移动端支持头像展示（可关闭）
* [x] pagefind search error
:::

## 规划&反馈&建议&优化

|                           描述                           | 状态  |
| :------------------------------------------------------: | :---: |
|        [Valine](https://valine.js.org/) 评论系统         |   ❌   |
|   [gitalk](https://github.com/gitalk/gitalk) 评论系统    |   ❌   |
|  [Waline](https://github.com/walinejs/waline) 评论系统   |   ❌   |
|        文章合集，聚合一个专题内容，类似掘金的专题        |   ❌   |
| 掘金小册模式，系列文章聚合，有相似的独立的介绍和阅读体验 |   ❌   |
|                    文章时间线页面支持                    |   ❌   |
|                      背景图自动切换                      |   ❌   |
|                 首页面板数据多种卡片支持                 |   ❌   |
|                 首屏铺满slogan，自动展开                 |   ❌   |
|                  support img noreferrer                  |   ❌   |
|                        顶导航折叠                        |   ❌   |
|                         独立标签                         |   ❌   |
|                        独立分类页                        |   ❌   |
|                      独立时间线页面                      |   ❌   |
