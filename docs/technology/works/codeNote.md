---
title: 组装个低配版语雀+CodePen
date: 2022-08-28
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# 组装个低配版语雀+CodePen
## 前言
emmm。。。，有好长一段时间没码文了（近几个月实在是太忙了），这个玩具刚好是这两周抽空`拼`的拿出来和大家分享一下

朋友最近刚学前端，经常问一些问题，通过聊天软件发代码和贴图实在是不太方便，就给它推荐了[CodePen](https://codepen.io/) 和 [🐴上掘金](https://code.juejin.cn/)

前者国内访问实在不稳定，后者emm有个内容审核，导致内容`实时性`较差。

就搜了搜GitHub上有不有类似的项目，搜了一圈还真有不少，这里贴两个感觉不错的 [CodeRun](https://wanglin2.github.io/code-run-online/#/) 和 [CodePan](https://codepan.egoist.sh/)

朋友使用后反馈，问了问有不有啥支持直接在旁边 **写笔记**，**贴图片（这个）**，方便做记录

emm...，检索了一圈记忆中除了 `VsCode` 好像还真没有这种东西（可能是我孤陋寡闻了，读者有推荐的可以评论区补充）

那就给他造个吧，练练手，有段时间没写自己的代码了

等不及了？先体验体验👉🏻 [示例1](https://code.sugarat.top),[示例2](https://code.sugarat.top/share/63035c10a6ea447087355f55)

## 技术选型
行动肯定是要站在巨人的"键盘上"(手滑打错了，那就这样吧)，先看看有哪些可用的 "零件"

### 内容编辑器
先是写笔记部分，挑了几个库玩了一下
* [wangEditor](https://www.wangeditor.com/) - 开源 Web 富文本编辑器，开箱即用，配置简单
* [prosemirror](https://prosemirror.net/) - 支持部分MarkDown语法，可拓展定制的富文本编辑器
* [🧴 Lotion](https://lotion.dashibase.com/) - 基于Vue3开发的块编辑器
* [Editor.js](https://editorjs.io/) - 官方:"Next generation block styled editor.",下一代块编辑器

因为屏幕中需要展示 笔记/代码/预览 3个部分，直接使用markdown语法会有个切换的动作（这里就不考虑markdown格式做编辑了）

上述的几个库分大体上分为两类`富文本编辑器`，`块编辑器`

|                                富文本编辑器                                 |                                  块编辑器                                   |
| :-------------------------------------------------------------------------: | :-------------------------------------------------------------------------: |
| ![图片](https://img.cdn.sugarat.top/mdImg/MTY2MTY5ODE0NTY2OQ==661698145669) | ![图片](https://img.cdn.sugarat.top/mdImg/MTY2MTY5ODIyNjk3NQ==661698226975) |

前者是比较传统的编辑器，后者从社区反应来看像是`下一代趋势`，但国内好像还没看到使用此方案的成熟产品（可能是我孤陋寡闻了，读者有推荐的可以评论区补充）

最后本着技术尝鲜（喜欢折腾）的精神选了[Editor.js](https://editorjs.io/)

## 代码编辑器
这个就[monaco-editor](https://github.com/microsoft/monaco-editor) 没得跑了

不过在使用之前先看了一下最近阿里开源的[OpenSumi](https://opensumi.com/zh)，看之前以为是个可直接用的`NPM`包，文档翻了半天，只给了个demo，emm 拉下来，果然如官方预料 卡在了 `yarn install`，感觉有一定上手成本，先不看了


### 后端部分
思考了一下都是简单的`CRUD`场景，存储和鉴权`MongoDB`与`Redis`感觉就够了（也没有配置成本，安装即用）

服务端框架部分就直接拿自己的之前写的玩具[flash-wolves](https://github.com/ATQQ/flash-wolves)开整

接下来就是组装了

## 项目搭建
粗糙的原型图如下

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MTY5OTkyOTE2OQ==661699929169)

布局也比较简单
```html
<header>工具条...</header>
<!-- 主体内容 --> 
<main>
    <Note />
    <Code />
    <Render />
</main>
```

直接拿之前整的模板进行创建[vite-vue3-template](https://github.com/ATQQ/vite-vue3-template)出前端工程


## 实现
### 文本编辑部分
在线演示：https://code.sugarat.top/share/630b8793789c242a31e57c40

直接[参照官方文档](https://editorjs.io/configuration)，CV起来就能运行，这里贴几个关键部分仅仅
```ts
 const editor = new EditorJS({
    holder: 'note-editor',
    placeholder: '在这里开始记录你的笔记',
    /**
     onReady callback
    */
    onReady: () => {
      console.log('Editor.js is ready to work!')
      // 内容初始化
      editor.render(xxx)
    },
    /**
     * 内容改变
     */
    onChange: (api, e) => {
      editor
        .save()
        .then((outputData) => {
            // 取得编辑器的内容
        })
        .catch((error) => {
          console.log('Saving failed: ', error)
        })
    },
    tools: {
      image: {
        class: Image,
        config: {
          uploader: {
            uploadByFile(file: File) {
              // 需要自己处理图片上传逻辑 
              return {
                success: 1,
                file: {
                  url: 'https://img.cdn.sugarat.top/online-editor/6302403434e52962875fbf3e/1661169105550/pupza3m486'
                }
              }
            }
          }
        }
      },
    // 一系列官方插件
      header: Header,
      list: List,
    //   ...
    },
    i18n: {
      // 国际化相关配置
    }
  })
```

未完待续。。。
### 代码编辑

### 代码渲染

## 最后

<comment/>
