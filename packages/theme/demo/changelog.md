---
title: 更新日志
author: 粥里有勺糖
tag:
 - 日志
---

# Changelog

升级主题，原项目执行如下指令即可
```sh
pnpm up @sugarat/theme
```
## 0.1.20 (2023/04/08)

### Patch Changes

- feat: 内置 pagefind 搜索针对中文优化
- fix: 内置 pagefind 在自定义base后无效
- chore: 没有git仓库时，打印Not日志
- chore: pagefind 引导使用独立的插件 [vitepress-plugin-pagefind](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-pagefind/README-zh.md)

## 0.1.19 (2023/04/02)

### Patch Changes

- fix: dev not defined error
- chore: 主题的exports 添加 package.json
- fix: default template lang error

## 0.1.18 (2023/03/31)

### Patch Changes

- fix: 设置base路径后发布时间显示0秒
- fix: 评论跳转按钮在部分场景展示异常

## 0.1.17 (2023/03/26)
- fix: search: false 不生效

## 0.1.16 (2023/03/26)
- fix: 全局BG色和Vitepress主题样式冲突

## 0.1.15 (2023/03/26)

- feat: 分离可独立使用的的 搜索插件[pagefind](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-pagefind)
- feat: 搜索框展示UI优化，支持定制文案，展示适配移动端
- fix: 搜索结果未全部展示
- fix: 中文文件名文章时间显示NaN

## 0.1.14 (2023/03/19)
- chore: 主题配置改为继承的方式引入

## 0.1.13 (2023/03/19)
- fix: route support [withBase](https://vitepress.dev/reference/runtime-api#withbase)

## 0.1.12 (2023/03/18)
- fix: 搜索框影响首页样式

## 0.1.11 (2023/03/18)
- chore: 文档内容完善
- feat：内置搜索弹窗UI更新 - 类似algolia（基于 [vue-command-palette](https://github.com/xiaoluoboding/vue-command-palette/blob/main/src/assets/scss/algolia.scss)）

![](https://img.cdn.sugarat.top/mdImg/MTY3OTEyNDM0ODQ4OA==679124348488)

## 0.1.10 (2023/03/12)
- feat: 支持全文搜索（基于 [pagefind](https://pagefind.app/) 实现）
  - `search: 'pagefind'`

## 0.1.9 (2023/02/24)
### Patch Changes
- feat: 支持自定义推荐文章的展示顺序，详见[frontmatter.recommend](./config/frontmatter.md#recommend)


## 0.1.8 (2023/02/22)
### Patch Changes

- feat: 支持首页文章置顶能力 (详见[frontmatter.top](./config/frontmatter.md#top)样式较粗糙，欢迎PR改进)

## 0.1.7 (2023/02/21)

### Patch Changes

- fix: 文章页顶部展示遮挡问题
- fix: 刷新页面评论偶现不展示
- chore: 模板里添加自定义背景图示例
- chore: 更新文档站介绍

## 0.1.6 (2023/02/20)

### Patch Changes

- fix: 最新版vitepress首页顶部Nav穿透背景图
- fix: 修复window路径问题

## 0.1.5 (2023/02/19)

### Patch Changes

- feat: 支持单独使用博客的主题能力但不影响首页布局

## 0.1.4 (2023/02/05)

### Patch Changes

- fix: cover 提取失败

## 0.1.3 (2023/02/01)

### Patch Changes

- fix: 模板启动构建报错

## 0.1.2 (2023/01/31)

### Patch Changes

- fix: 升级 element-plus 版本，解决构建报错
- feat: 追加主题的导出方式 default

## 0.1.1 (2023/01/30)

### Patch Changes

- fix: 没有初始化 git 之前启动报错
- fix: 文章作者信息重复渲染
- chore: 引导文案更新，记录 degit bug 解法
- chore: 包信息修改

## 0.1.0 (2023/01/29)

### Minor Changes

- feat: 完成初版博客主题的开发
- feat: 支持评论
- feat: 支持全局弹窗 Alert
- feat: 支持全局公告 Popover
- feat: 更多见文档 [主题配置](https://theme.sugarat.top/config/frontmatter.html) [全局配置](https://theme.sugarat.top/config/frontmatter.html)