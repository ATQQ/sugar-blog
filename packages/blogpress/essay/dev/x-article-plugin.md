---
description: 我平时习惯用 Markdown 写文章，再发到各个平台。但每次发 X 文章都要重新排版、传图，于是做了个小插件。
date: 2026-10-21 18:00:00
tag: [vibecoding, Chrome 插件]
---

# 做了个 Chrome 插件：把 Markdown 直接导进 X 文章

我平时写东西基本都在本地用 Markdown，写完再发到博客、掘金这些地方。

博客和文档站天然支持 MD，其它平台也各有各的发布工具，整体还算顺手。

只有 X 文章比较麻烦，不支持 MD。

网上搜了一下，合适方案就是用 Chrome 插件。

就10来分钟就 Vibe 出来了。（AI NB）

安装好后，在文章页右下角有一个导入的按钮

![](https://cdn.upyun.sugarat.top/mdImg/sugar/8896af0b0ded5cae4f896e328804354b)

插件界面：

![](https://cdn.upyun.sugarat.top/mdImg/sugar/28f4c8b2e6fa079e76e4a05e8cc23ae8)

把 Markdown 粘进去，它会转成 X 的富文本，图片按原文位置上传。


> 在线安装页：<https://atqq.github.io/md2xarticle/>
>
> 直接下载：<https://github.com/ATQQ/md2xarticle/releases/latest/download/md2xarticle.zip>

## 怎么装

目前还没上架扩展商店，需要手动加载一下。Chrome、Edge、Arc、Brave 这些 Chromium 浏览器都可以，版本要求是 111+。

1. 下载 ZIP 并解压到一个固定的文件夹
2. 打开 `chrome://extensions`
3. 开启右上角的「开发者模式」
4. 点「加载已解压的扩展程序」
5. 选择解压后包含 `manifest.json` 的那个文件夹

Edge 对应的是 `edge://extensions`，Arc 是 `arc://extensions`。

## 怎么用

1. 打开 <https://x.com/compose/articles>
2. 手动新建一篇文章，或者打开已有草稿
3. 进到能看到标题框和正文编辑区的位置
4. 点右下角的「↑ 导入 Markdown」
5. 粘贴或拖入你的内容
6. 点「导入到当前编辑器」

## 最后

如果你也习惯用 Markdown 写文章，又偶尔需要发到 X，可以试试看。

* 在线安装页：<https://atqq.github.io/md2xarticle/>
* GitHub 仓库：<https://github.com/ATQQ/md2xarticle>

有问题可以在评论区聊，或者直接去 GitHub 提 Issue。
