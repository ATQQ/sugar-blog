---
description: 将Markdown文档中带超链接的标题提取出来，在标题下方显示对应的链接和二维码图片。
tags:
 - 个人作品
 - AI
---

# 用Trae做了个公众号小工具

## 是什么

**MD标题外链转二维码**

![](https://cdn.upyun.sugarat.top/mdImg/sugar/e3a77b208fc5a8a30ab7d4e3ce6a1be4)

如图给 markdown 内容中带连接的标题下插入一个二维码和连接内容。

方便用户阅读时扫码直接访问或者复制链接。

已支持能力
- 自动解析 MD 文档，识别带超链接的标题
- 自动在标题下方生成对应的二维码和链接文本
- 提供原始预览和转换后预览的对比视图
- 支持一键复制转换后的内容(会将图片以 base64 形式通过img标签导入)
- 自动保存编辑内容到本地缓存
- 移动端提供便捷的预览切换功能

体验地址：
1. https://aicoding.juejin.cn/aicoding/work/7510906446952071202
2. https://atqq.github.io/md-qrlink/
3. GitHub：https://github.com/atqq/md-qrlink

发公众号的话，搭配 [微信 Markdown 编辑器](https://github.com/doocs/md?tab=readme-ov-file)（https://md.doocs.org/） 效果更加。

## 为什么搞这个

微信公众号的个人的文章无法直接跳转第三方的外链，文章通常会是外链转脚注，将相关链接放在最后。

但周刊类型的文章外链较多，不太方便用户 CV 跳转。

*之前在其它公众号有看到过类似的展示，就想着复刻过来！*

## 怎么搞得

用 Trae（Claude-3,7-sonnet）生成核心代码（99%），人工主要在一些特定的样式问题上做了介入。

### 技术原理
Vue 3 + Vite
- **Markdown解析**: [markdown-it](https://github.com/markdown-it/markdown-it)
- **二维码生成**: [qrcode](https://github.com/soldair/node-qrcode)和[qrcode.vue](https://github.com/scopewu/qrcode.vue/tree/main)
  - 前者负责复制的时候 base64 二维码内容生成，后者负责预览里的二维码渲染
- **本地存储**: localStorage API

### 人工介入部分
1. 布局的样式，AI 每次在修改其它问题的时候会把我已经调整的布局扔掉用新生成的覆盖
2. 复制到 markdown：HTML 标签在复制到微信里的时候 微信会做标签的转换，一些布局样式转换后被丢了。这块需要人工介入在微信的规则下做一下调整。

## 我的 Prompt

第一轮对话的“提示词”
```md
使用Vite Vue实现一个md 格式转换项目，将Markdown中标题是超链接的提取出来，
放在标题下方 并在左侧生成对应的二维码图片

支持预览原Markdown和转换后Markdown内容
```

总共进行了 15 轮的连续对话，就达到了这个效果。

其中部署 GitHub Pages 的 GitHub Action 脚本也是用其生成的。

## 最后

现在有了 VibeCoding 的编码方式，出 Demo 非常的快，效率比人工高 N 倍。

可以快速验证想法。

顺便推荐一波此类型的在线工具
* NoCode：https://nocode.cn/
* Bolt：https://bolt.new/
* V0：https://v0.dev/
* Lovable：https://lovable.dev/

Trae 整体体验我觉得还行，3$ 的首月体验还可以接受，大模型都一样，这比 Cursor 便宜太多了。还没搞上AI IDE 的可以试用一波，每天也有些免费额度。

**读者有发一些奇思妙想的应用想法，也可评论区来一波。**

*不多说了“两个字” AI NB*