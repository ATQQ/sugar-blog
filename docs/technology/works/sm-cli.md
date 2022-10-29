# 个性化source-map解析CLI工具打造

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

## source-map库的介绍

## .map资源加载

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
* [@hl-cli/restore-code](https://www.npmjs.com/package/@hl-cli/restore-code)