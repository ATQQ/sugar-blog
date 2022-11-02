---
title: 个性化Source Map解析CLI工具
date: 2022-10-29
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# 个性化Source Map解析CLI工具

> 本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

## 前言

**source-map** 大家都不陌生了，通常情况就是产物里的`xx.js.map`文件里的内容。

可用于对压缩混淆后的代码还原。通常用于帮助定位源码问题。

区别于构建时的配置（[以webpack 的devtool配置项为例](https://webpack.docschina.org/configuration/devtool/#special-cases)）不同配置，`source-map`暴露的信息程度也就也不一样

一般公司里的项目，是会把`.map`文件上传到内网环境，不耽误问题排查，也不暴露源码

个人的开源项目，一般就没这么讲究了，直接和产物一起传了。

前端监控平台，一般都支持错误堆栈解析，通过`.map`，还原出错代码位置调用堆栈信息。

有时候没有自动解析的平台可用的时候（比如一些商用监控平台，免费版通常不提供自动source-map解析能力）

就会搜些在线`source-map`解析工具凑合一下，包含在线网页，以及CLI版本的。作者也体验使用了一些都贴到最后附录列表中，大家有推荐的也可评论区补充。

本文将综合现有的source-map cli解析工具优缺点，取长补短，🐴一个集大成者。

TODO：能力简介
## source-map库的简介
npm地址：[source-map](https://www.npmjs.com/package/source-map)

可以用于生成和解析sourcemap的库，本文主要用到其解析的能力，关注[API:SourceMapConsumer](https://www.npmjs.com/package/source-map#sourcemapconsumer)即可

下面是示例，其返回值`consumer`是一个`Promise`
```ts {4}
import sourceMap from 'source-map'

function createSourceMapConsumer(sourceMapCode: string) {
  const consumer = new sourceMap.SourceMapConsumer(sourceMapCode)
  return consumer
}
```

`consumer`中包含一个`sources`属性，标明了包含的所用到的源码文件路径信息，通过实例上的`sourceContentFor`方法即可获取到对应`文件(source)`的`源码(sourceCode)`
```ts

// mapContent 内容来源 https://script.sugarat.top/js/tests/index.9bb0da5c.js.map
;(async () => {
  const consumer = await createSourceMapConsumer(mapContent)

  // [
  // '../../vite/modulepreload-polyfill',
  // '../../node_modules/.pnpm/@vue+shared@3.2.37/node_modules/@vue/shared/dist/shared.esm-bundler.js',
  // 类似的源文件路径
  // ]
  const sourceFileNames = consumer.sources

  // 源文件个数
  const sourceCount = sourceFileNames.length

  // 第一个源文件的内容
  const sourceCode = consumer.sourceContentFor(sourceFileNames[0])
})()
```

`consumer`实例上的另一个最常用的方法`originalPositionFor`可以通过压缩混淆后的代码行列号，解析出源文件信息。

包含`源文件source`,`行号line`,`列号column`,`name`
```ts
// 第一个源文件的内容
const sourceCode = consumer.sourceContentFor(sourceFileNames[0])

// 通过压缩混淆后的代码的行列号，定位到源文件
const sourceInfo = consumer.originalPositionFor({
  line: 24,
  column: 17596
})

// 这个例子的结果如下
console.log(sourceInfo)
//   {
//     source: '../../node_modules/.pnpm/vue-router@4.0.14_vue@3.2.37/node_modules/vue-router/dist/vue-router.esm-bundler.js',
//     line: 2882,
//     column: 12,
//     name: null
//   }
```
通过如上2个简单的`API`即可完成常用能力的封装。

## .map资源加载
通常每个js产物都对应有一份`.map`文件，文件命名为`原文件名.js.map`

在不考虑特殊的约定条件情况下，通常情况是在js产物末尾都有1个`// #sourceMappingURL=xx.js.map`注释表明js资源关联的map文件路径

于是乎咱们，可以先写个方法来获取传入文件对应的sourceMap文件路径

### sourceMap路径获取
```ts

```
### 远程资源加载

## 还原报错源码

## 完整source生成

## 封装CLI
### 参数定义

### 交互细节

### 能力组合

## 成品
使用

## 最后
**提前剧透：** 后续再出一篇在线sourcemap解析的工具 

工具完整源码见GitHub

## 附录
Web
* [decodeSourceMap](https://www.hai-fe.com/decodeSourceMap)

CLI
* [restore-source-tree](https://www.npmjs.com/package/restore-source-tree)
* [source-map-tools](https://www.npmjs.com/package/source-map-tools)
* [source-map-cli](https://www.npmjs.com/package/source-map-cli)
* [source-map-to-source](https://www.npmjs.com/package/source-map-to-source)
* [kaifu](https://www.npmjs.com/package/kaifu)
<comment/>
* [@hl-cli/restore-code](https://www.npmjs.com/package/@hl-cli/restore-code)