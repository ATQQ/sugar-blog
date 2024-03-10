---
description: 记录一下每天干的杂事，写的杂七杂八的代码，用于日后回顾，翻开尘封的记忆
---
# 开发日记 | 不定时更新

记录一下每天干的杂事，写的杂七杂八的代码，用于日后回顾，翻开尘封的记忆。

[[toc]]
## 2024-03-10
### 博客主题CLI
*[@sugarat/create-theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/create-theme)*

* 模板更新
  * 添加 GitHub/Gitee Pages 部署所需文件
  * 添加引导使用文档

## 2024-03-09
### 七牛云图床
*[image-bed-qiniu](https://github.com/ATQQ/image-bed-qiniu/tree/master/packages/client#-%E4%B8%83%E7%89%9B%E4%BA%91oss%E5%9B%BE%E5%BA%8A-)*

* 基于 [UPNG.js](https://github.com/photopea/UPNG.js) 支持 PNG 图片的上传自动压缩

![](https://img.cdn.sugarat.top/mdImg/sugar/727ade06e155fd9541cfcab78bdaab7f)

## 2024-03-05
### 七牛云图床

*[image-bed-qiniu](https://github.com/ATQQ/image-bed-qiniu/tree/master/packages/client#-%E4%B8%83%E7%89%9B%E4%BA%91oss%E5%9B%BE%E5%BA%8A-)*

* 文案优化
* 尝试本地压缩部分图片资源

## 2024-03-04

### 周刊自动化创建工具

*[@sugarat/cli-plugin-blog@0.0.10](https://www.npmjs.com/package/@sugarat/cli-plugin-blog)*

* 迭代生成周刊的模板
  * `frontmatter` 默认添加注释掉的 `createTime`
  * 移除 [投稿](https://www.wenjuan.com/s/AN32YrD/) 👈🏻分享内容
  * 格式调优
  * [云谦：MDH 前端周刊](https://sorrycc.com/mdh/) 切换到[新地址](https://sorrycc.com/mdh/)
* 新增 option `--weekly-dir` 用于设置周刊目录

```sh
q blog --weekly-dir ./packages/blogpress/weekly
```

* 创建周刊优化
  * 自动根据周刊目录拼接周刊文章创建路径（减少一次复制粘贴的时间）
  * 自动更新周刊序号（减少来回切确认周刊期数）

![](https://img.cdn.sugarat.top/mdImg/sugar/3f4b2c2c0497eb31ce8b4d86d16b63b4)

### 七牛云图床

*[image-bed-qiniu](https://github.com/ATQQ/image-bed-qiniu/tree/master/packages/client#-%E4%B8%83%E7%89%9B%E4%BA%91oss%E5%9B%BE%E5%BA%8A-)*

* 显示上传图片的大小信息

![](https://img.cdn.sugarat.top/mdImg/sugar/951b7a23af37d64c0ee1414a6faee899)
