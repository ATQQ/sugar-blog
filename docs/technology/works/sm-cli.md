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

### 本地sourceMap路径获取
先是考虑本地的情况，通过路径拼接`.map`与读取文件文件末尾`sourceMappingURL`2种方式相结合

```ts
function getLocalSourceMapFilePath(sourceJsPath: string) {
  // 文件不存在
  if (!existsSync(sourceJsPath)) {
    return NOT_FOUND
  }

  // 先直接判断是否存在.js.map文件存在
  if (existsSync(`${sourceJsPath}.map`)) {
    return `${sourceJsPath}.map`
  }

  // 获取代码里的 // #sourceMappingURL= 注释的内容
  const jsCode = readFileSync(sourceJsPath, 'utf-8')
  const flag = '//# sourceMappingURL='
  const flagIdx = jsCode.lastIndexOf(flag)
  if (flagIdx === -1) {
    return NOT_FOUND
  }
  const sourceMappingURL = jsCode.slice(flagIdx + flag.length)

  // 如果是http路径表明 是绝对路径 直接返回
  if (isHTTPSource(sourceMappingURL)) {
    return sourceMappingURL
  }

  // 否则拼接js资源的目录
  return path.resolve(path.dirname(sourceJsPath), sourceMappingURL)
}
```
<!-- TODO:test case -->

### 远程资源加载
除了本地情况那也有线上资源的情况，比如用于测试的`https://script.sugarat.top/js/tests/index.9bb0da5c.js`

下面介绍3种常见方式获取`http`资源，`http`,`axios`,`fetch`

首先是`http`，node内置网络模块，使用上的感官和web里的[XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)差不多，不太优雅

简单场景书写代码量也在可接受的范围
```ts
import http from 'http'
import https from 'https'

function getRemoteSource(
  url: string
): Promise<{ body: string; code?: number }> {
  return new Promise((resolve, reject) => {
    // 区别https与http资源
    const HTTP = url.startsWith('https://') ? https : http

    // 通过回调的形式获取
    HTTP.get(url, (res) => {
      // 设置可读流的字符编码
      res.setEncoding('utf-8')

      // 响应内容拼接
      let content = ''
      res.on('data', (chunk) => {
        content += chunk
      })

      // 读完对外暴露内容和状态码
      res.on('end', () => {
        resolve({
          body: content,
          code: res.statusCode
        })
      })

      res.on('error', (err) => {
        reject(err)
      })
    })
  })
}
```

`axios`，前端常用的跨平台网络请求库（web/node/其它场景提供adaptor层做适配）

用这个代码量就更简洁了，3行就能搞定
```ts
function getRemoteSourceByAxios(url: string) {
  return axios.get(url).then((v) => {
    return {
      code: v.status,
      body: v.data
    }
  })
}
```


`fetch`，在web侧已经出现很久了，Node.js>=v17.5.0 内置，低版本可使用第三方的[node-fetch](https://www.npmjs.com/package/node-fetch)

这里使用`node-fetch`进行举例，使用也是非常简单
```ts
import fetch from 'node-fetch'

function getRemoteSourceByFetch(url: string) {
  return fetch(url).then(async (v) => {
    const code = v.status
    const body = await v.text()
    return {
      code,
      body
    }
  })
}
```

包含但不限于以上三种方式达到需要的目的。

### 远程sourceMap路径获取
思路和本地的资源逻辑基本一致，只是内容获取和判断需要走网络，实现如下，接近一半都是重复代码，有优化空间，这里不赘述了
```ts
async function getRemoteSourceMapFilePath(sourceJsPath: string) {
  const context = await getRemoteSource(sourceJsPath)
  if (context.code === 404) {
    return NOT_FOUND
  }
  if ((await getRemoteSource(`${sourceJsPath}.map`)).code === 200) {
    return `${sourceJsPath}.map`
  }
  const jsCode = context.body
  const flag = '//# sourceMappingURL='
  const flagIdx = jsCode.lastIndexOf(flag)
  if (flagIdx === -1) {
    return NOT_FOUND
  }
  const sourceMappingURL = jsCode.slice(flagIdx + flag.length)
  if (isHTTPSource(sourceMappingURL)) {
    return sourceMappingURL
  }
  return path.resolve(path.dirname(sourceJsPath), sourceMappingURL)
}
```

简单做合并后的方法如下
```ts
const isHTTPSource = (sourcePath: string) =>
  sourcePath.startsWith('http')

async function getSourceMapFilePath(sourceJsPath: string) {
  if (!isHTTPSource(sourceJsPath)) {
    return getLocalSourceMapFilePath(sourceJsPath)
  }
  return getRemoteSourceMapFilePath(sourceJsPath)
}
```

## 还原报错源码
有了前面的基础，咱们第一个整合功能就可以实现了 **根据报错资源信息，还原源码和行列号**，先给出方法的定义

```ts
interface SourceResult {
  /**
   * 源码
   */
  sourceCode: string
  /**
   * 源码文件路径
   */
  source: string
  /**
   * 行号
   */
  line: number
  /**
   * 列号
   */
  column: number
}

/**
 * 根据报错资源信息，获取对应源码信息
 * @param url 报错资源
 * @param line 行号
 * @param column 列号
 */
async function getErrorSourceResult(
  url: string,
  line: number,
  column: number
): Promise<SourceResult>
```

利用上面实现的`getSourceMapFilePath`,配合`source-map`的2个API即可实现`originalPositionFor`,`originalPositionFor`
```ts
import fs from 'fs/promises'

const sourceMapURL = await getSourceMapFilePath(url)

// sourceMap 内容
const sourceMapCode = await (isHTTPSource(sourceMapURL)
  ? getRemoteSource(sourceMapURL).then((v) => v.body)
  : fs.readFile(sourceMapURL, 'utf-8'))

const consumer = await createSourceMapConsumer(sourceMapCode)
// 解析出原来的行列号，源文件路径等信息
const { name, ...rest } = consumer.originalPositionFor({
  line,
  column
})
// 获取源码
const sourceCode = consumer.sourceContentFor(rest.source!)
const result = {
  ...rest,
  sourceCode
}
```

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