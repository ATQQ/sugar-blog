---
tag: 技术笔记
description: 在迭代图床应用时，需要用到图片压缩，在之前分享了使用UPNG.js 处理 PNG 图片，这里记录分享一下如何处理JPG图片，并附上完整 Demo。
---

# 🚧【ing】纯前端实现 JPG 图片压缩 | canvas

>**在线 Demo 体验地址 →:** https://demos.sugarat.top/pages/jpg-compress/

## 前言
在迭代图床应用时，需要用到图片压缩，在之前分享了使用 [UPNG.js 压缩 PNG 图片](https://juejin.cn/post/7346510823772733494)，这里记录分享一下如何处理 JPG 图片。

搜罗调研了一圈，JPG 图片的处理，基本都是围绕 canvas 展开的。
* [掘金：前端实现图片压缩技术调研](https://juejin.cn/post/7311633278497685544)
* 相关开源库（近期还有迭代维护的）：[Compressor.js](https://github.com/fengyuanchen/compressorjs)，[browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)。

## 如何判断图片是 JPG
同样第一步当然是判断图片类型，不然就没法正常的做后续处理了。

搜索了解了一下，JPG 图片的前三字节是固定的（16进制表示）：`FF D8 FF`。

下图是 VS Code 插件 [Hex Editor](https://marketplace.visualstudio.com/items?itemName=ms-vscode.hexeditor) 查看一个 JPG 图片的 16 进制表示信息。

![](https://img.cdn.sugarat.top/mdImg/sugar/bcba46c1cd96ae55e93d5306796cd98c)

于是可以根据这个特性判断，于是就有如下的判断代码。

```ts
function isJPG(file) {
  // 提取前3个字节
  const arraybuffer = await file.slice(0, 3).arrayBuffer()

  // JPG 的前3字节16进制表示
  const signature = [0xFF, 0xD8, 0xFF]
  // 转为 8位无符号整数数组 方便对比
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
  const source = new Uint8Array(arraybuffer)

  // 逐个字节对比
  return source.every((value, index) => value === signature[index])
}
```

当然社区也有现成的 [is-jpg](https://github.com/sindresorhus/is-jpg) 库可以使用。

![](https://img.cdn.sugarat.top/mdImg/sugar/522312911d91522d3217c11765363f85)

*可看判断代码还是很简单的。*

下面将先介绍一下上述两个开源库的简单用法与特色，最后再介绍一下直接使用 `canvas API` 压缩的方式以及注意事项。

## Compressor.js

### 简介
>JavaScript 图像压缩工具。使用浏览器原生的 `canvas.toBlob API` 实现压缩，`有损压缩`，`异步`，在不同的浏览器压缩效果有所出入。一般可以用来在上传之前在客户端预压缩图像。

官方示例站点：[Compressor.js PlayGround](https://fengyuanchen.github.io/compressorjs/)

### 使用
支持 `npm` 和 `cdn` 两种引入方式。

**npm 加载**
```sh
# 安装依赖
npm install compressorjs
```
```js
// 项目中引入使用
import Compressor from 'compressorjs'
```
**cdn 加载**

```html
<!-- html head 中引入 -->
<script src='https://cdn.staticfile.net/compressorjs/1.2.1/compressor.min.js'></script>
<!-- 项目中直接使用 Compressor 即可 -->
```
简单使用方式如下
```js
// file 是待压缩图片的文件对象
new Compressor(file, {
  quality: 0.8,
  success(result) {
    // result 是压缩后的图片内容
  }
})
```
其余的 [option 选项](https://github.com/fengyuanchen/compressorjs?tab=readme-ov-file#options)可以参考官方文档，主要是尺寸大小，压缩质量效果，图片信息的保留等细节的调节。

可以简单用 `Promise` 封装一下，使用更加方便。
```ts
async function compressJPGByCompressor(file, ops) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      ...ops,
      success(result) {
        resolve(result)
      },
      error(err) {
        reject(err)
      }
    })
  })
}
```

当然这种不支持 `Promise` 的回调用法函数用 [Promise.withResolvers](https://github.com/tc39/proposal-promise-with-resolvers) 包装最合适不过了。

当然浏览器不支持这个API的话 需要引入 `polyfill` 才行（可以从 `core-js` 中引入，或自己简单实现一下）。
```js
function compressJPGByCompressor(file, ops) {
  const { promise, resolve, reject } = Promise.withResolvers()
  new Compressor(file, {
    ...ops,
    success(result) {
      resolve(result)
    },
    error(err) {
      reject(err)
    }
  })
  return promise
}
```

### 优势

## 🚧 browser-image-compression
### 简介
### 使用
### 优势

## 🚧 canvas api

主流的 JPG 纯前端压缩方案，基本都是借助 [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) 实现的，区别就在于边界场景是否考虑周全，配套的特性能否满足将要到需求。

### 使用

### 兼容性问题
笔者并没有深入研究 canvas 压缩的兼容性问题，但从社区的几个前端处理 JPG 库里的 README 描述与 issues 等可以归纳为下面几个方面的问题。

*参考：*

## 完整 demo
笔者将本节内容整理成了一个 Demo，可以直接在线体验。

>**在线 Demo 体验地址 →:** https://demos.sugarat.top/pages/jpg-compress/

大概界面如下（可修改配置切换压缩方案，对比效果）：

<!-- TODO： -->

*纯血 HTML/CSS/JS，复制粘贴就能运行。*

完整源码见：[GitHub:ATQQ/demos - jpg-compress](https://github.com/ATQQ/demos/tree/main/pages/png-compress)

## 最后
后续将继续学习&探索一下 `GIF`，`MP4 转 GIF` 等常用的动图前端处理实现的方式。