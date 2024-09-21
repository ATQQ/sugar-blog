---
description: 记录一下每天干的杂事，写的杂七杂八的代码，用于日后回顾，翻开尘封的记忆
---
# 开发日记 | 不定时更新

记录一下每天干的杂事，写的杂七杂八的代码，用于日后回顾，翻开尘封的记忆。

[[toc]]
## 2024/09/21
### VitePress 插件开发模板1
* [vitepress-plugin-slot-inject-template](https://github.com/ATQQ/sugar-blog/tree/master/template/vitepress-plugin-slot-inject-template)：适用基于默认 Layout 拓展的场景

## 2024/09/17
### VitePress 公告 插件
*[vitepress-plugin-announcement](https://www.npmjs.com/package/vitepress-plugin-announcement)*

* 为 `VitePress` 站点提供全局公告弹窗。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/7af94a65e3b4dd05e61e3411daba7fdd)

## 2024/09/09
### VitePress 51la 插件

*[vitepress-plugin-51la](https://www.npmjs.com/package/vitepress-plugin-51la)*

* 为 `VitePress` 站点引入 [51.la](https://v6.51.la/) 的网站数据统计能力。

## 2024/07/27
### 周刊自动化创建工具

*[@sugarat/cli-plugin-blog@0.0.12](https://www.npmjs.com/package/@sugarat/cli-plugin-blog)*

- 迭代生成周刊的模板
- 优化 description 字段的生成逻辑
- 自动拼接周刊标题，展示描述信息

### 同步 cnpm 工具

*[cnnc](https://www.npmjs.com/package/cnnc)*

- 接入 `@clack/prompts` 支持交互式选择要同步的包

---

## 2024/03/27

*[@sugarat/theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/theme)*

- feat: 新增各个模块可选开启的开关
- fix: Hydration error
- fix: 生成的链接兼容 `cleanUrls` 配置
- Updated dependencies
  - vitepress-plugin-pagefind@0.2.14
  - oh-my-live2d@0.15.2

## 2024/03/23

*[JPG 图片压缩](https://github.com/ATQQ/demos/tree/main/pages/jpg-compress)*

- 编写 [JPG 压缩在线 Demo](https://demos.sugarat.top/pages/jpg-compress/)

## 2024/03/16

*[PNG 图片压缩 | UPNG.js](https://github.com/ATQQ/demos/tree/main/pages/png-compress)*

- 编写 UPNG.js 在线 Demo

*[@sugarat/theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/theme)*

- 依赖更新 看板娘 和 VitePress1.0.1
- footer 支持更丰富的定制（参加[又拍云活动](https://www.upyun.com/league)）

## 2024/03/14

### 七牛云图床

*[image-bed-qiniu](https://github.com/ATQQ/image-bed-qiniu/tree/master/packages/client#-%E4%B8%83%E7%89%9B%E4%BA%91oss%E5%9B%BE%E5%BA%8A-)*

- fix：压缩后更大，仍使用了压缩的图片
- feat：查看详情增加压缩率展示

## 2024/03/13

### 博客主题

*[@sugarat/theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/theme)*

- 内置开箱即用的看板娘支持（[oh-my-live2d](https://github.com/oh-my-live2d/oh-my-live2d)）

## 2024/03/11

### 博客主题

*[@sugarat/theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/theme)*

- fix：主题 `showSelf: false` 失效的问题
- fix：pagefind 搜索插件 SSR 编译时影响 SVG 图标导入

## 2024-03-10

### 博客主题CLI

*[@sugarat/create-theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/create-theme)*

- 模板更新
  - 添加 GitHub/Gitee Pages 部署所需文件
  - 添加引导使用文档

## 2024-03-09

### 七牛云图床

*[image-bed-qiniu](https://github.com/ATQQ/image-bed-qiniu/tree/master/packages/client#-%E4%B8%83%E7%89%9B%E4%BA%91oss%E5%9B%BE%E5%BA%8A-)*

- 基于 [UPNG.js](https://github.com/photopea/UPNG.js) 支持 PNG 图片的上传自动压缩

![](https://img.cdn.sugarat.top/mdImg/sugar/727ade06e155fd9541cfcab78bdaab7f)

## 2024-03-05

### 七牛云图床

*[image-bed-qiniu](https://github.com/ATQQ/image-bed-qiniu/tree/master/packages/client#-%E4%B8%83%E7%89%9B%E4%BA%91oss%E5%9B%BE%E5%BA%8A-)*

- 文案优化
- 尝试本地压缩部分图片资源

## 2024-03-04

### 周刊自动化创建工具

*[@sugarat/cli-plugin-blog@0.0.10](https://www.npmjs.com/package/@sugarat/cli-plugin-blog)*

- 迭代生成周刊的模板
  - `frontmatter` 默认添加注释掉的 `createTime`
  - 移除 [投稿](https://www.wenjuan.com/s/AN32YrD/) 👈🏻分享内容
  - 格式调优
  - [云谦：MDH 前端周刊](https://sorrycc.com/mdh/) 切换到[新地址](https://sorrycc.com/mdh/)
- 新增 option `--weekly-dir` 用于设置周刊目录

```sh
q blog --weekly-dir ./packages/blogpress/weekly
```

- 创建周刊优化
  - 自动根据周刊目录拼接周刊文章创建路径（减少一次复制粘贴的时间）
  - 自动更新周刊序号（减少来回切确认周刊期数）

![](https://img.cdn.sugarat.top/mdImg/sugar/3f4b2c2c0497eb31ce8b4d86d16b63b4)

### 七牛云图床

*[image-bed-qiniu](https://github.com/ATQQ/image-bed-qiniu/tree/master/packages/client#-%E4%B8%83%E7%89%9B%E4%BA%91oss%E5%9B%BE%E5%BA%8A-)*

- 显示上传图片的大小信息

![](https://img.cdn.sugarat.top/mdImg/sugar/951b7a23af37d64c0ee1414a6faee899)
