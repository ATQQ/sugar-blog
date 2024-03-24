---
tag: 技术笔记
description: 在迭代图床应用时，需要用到图片压缩，在之前分享了使用UPNG.js 处理 PNG 图片，这里记录分享一下如何处理JPG图片，并附上完整 Demo。
---

# 纯前端实现 JPG 图片压缩 | canvas

>**在线 Demo 体验地址 →:** https://demos.sugarat.top/pages/jpg-compress/

## 前言
在迭代图床应用时，需要用到图片压缩，在之前分享了[使用 UPNG.js 压缩 PNG 图片](https://juejin.cn/post/7346510823772733494)，这里记录分享一下如何处理 JPG 图片。

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

## [Compressor.js](https://github.com/fengyuanchen/compressorjs)

### 简介
>JavaScript 图像压缩工具。使用浏览器原生的 `canvas.toBlob API` 实现压缩，`有损压缩`，`异步`，在不同的浏览器压缩效果有所出入。一般可以用来在上传之前在客户端预压缩图像。

官方示例站点：[Compressor.js PlayGround](https://fengyuanchen.github.io/compressorjs/)

![](https://img.cdn.sugarat.top/mdImg/sugar/582a9d9e73a1274fa8e7aae2d7022aa3)

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

### 简单封装
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

*当然浏览器不支持这个API的话 需要引入 `polyfill` 才行（可以从 `core-js` 中引入，或自己简单实现一下）。*
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

## [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)

### 简介
>浏览器中实现图片压缩，通过降低分辨率或大小来压缩 jpeg、png、webp 和 bmp 图像；支持使用 Web Worker 实现多线程的非阻塞压缩。

官方示例站点：[compression PlayGround](https://donaldcwl.github.io/browser-image-compression/example/basic.html)

![](https://img.cdn.sugarat.top/mdImg/sugar/3619ac65a3399e4b8e1928bb4e2c28a2)

其中多线程压缩使用 [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas#browser_compatibility): 一个可以脱离屏幕渲染的 canvas 对象。在 `web worker` 环境也可工作。

### 使用
同样的也支持 `npm` 和 `cdn` 两种引入方式。

**npm 加载**
```sh
# 安装依赖
npm install browser-image-compression
```
```js
// 项目中引入使用
import imageCompression from 'browser-image-compression'
```
**cdn 加载**

```html
<!-- html head 中引入 -->
<script src="https://cdn.staticfile.net/browser-image-compression/2.0.2/browser-image-compression.min.js"></script>
<!-- 项目中直接使用 imageCompression 即可 -->
```
简单使用方式如下
```js
imageCompression(file, {
  // 设置压缩后的最大大小，单位是 MB（会根据目标自动调整图片质量或者尺寸）
  maxSizeMB: 1,

  // 如果希望通过百分比控制质量，只需简单计算一下即可
  // maxSizeMB: Math.round(file.size / (1024 * 1024) * quality),

  // 也可设置压缩后最大的宽或者高 （自动应用于图片中较长的那一边）
  // maxWidthOrHeight: 1920,
}).then((result) => {
  // result 为压缩后的结果
})
```
可以看出来使用非常简单:
* 调整尺寸就使用 `maxWidthOrHeight`;
* 保持原尺寸就调整 `maxSizeMB` 的值。

### 简单封装
```js
function compressImageByImageCompression(file, options = {}) {
  const { width, height, quality = 0.8, ...ops } = options
  return window.imageCompression(file, {
    maxSizeMB: Math.round(file.size / (1024 * 1024) * quality),
    maxWidthOrHeight: width || height || undefined,
    libURL: 'https://cdn.staticfile.net/browser-image-compression/2.0.2/browser-image-compression.js',
    ...ops
  })
}
```
这样调用起来更加方便灵活。

### 注意事项
默认是开启的多线程压缩，会从 `https://cdn.jsdelivr.net` 拉取 worker 脚本。

如果存在网络原因访问不通畅，可以通过 `options.libURL` 替换为自定义的脚本位置，比如使用 [Staticfile CDN](https://www.staticfile.org/) 资源。

```js
imageCompression(file, {
  // ...省略其它配置
  libURL: 'https://cdn.staticfile.net/browser-image-compression/2.0.2/browser-image-compression.js'
})
```

## canvas api

主流的 JPG 纯前端压缩方案，基本都是借助 [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) 实现的，区别就在于边界场景是否考虑周全，配套的特性能否满足将使用的场景。

### 使用
先创建 `Image` 对象，获取图片的基本信息

下面是使用 `URL.createObjectURL` 创建资源链接的方式：
```js
const img = new Image()
// 图片完成加载
img.onload = () => {
  // 获取图片宽高
  const { width, height } = img
  // 后续就可以使用 canvas 进行进一步的压缩处理
}

img.src = URL.createObjectURL(file)
```

当然这里也可以用 `FileReader`，此时代码看上去多2行（hhh）
```js
const reader = new FileReader()
reader.readAsDataURL(file)
reader.onload = function (event) {
  img.src = event.target.result
}
```

紧接着就可以使用 `canvas` 进行图像的绘制（img 完成加载后）

```js
// 创建 canvas 元素
const canvas = document.createElement('canvas')
// 获取画布的2D渲染上下文
const ctx = canvas.getContext('2d')

// 设置 canvas 的宽高与图片一致
canvas.width = img.width
canvas.height = img.height

// 在 canvas 上绘制图片（待绘制的图片，画布上的起始坐标，绘制的宽高）
ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

// 如果把元素插入到页面中，则可以看到 canvas 绘制的图片
// document.body.appendChild(canvas);
```

接下来最核心的就行调用 `canvas.toDataURL(type, quality)` 进行"压缩"了。
```js
// 只需要设置图片格式，与图片质量 两个参数即可
const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
```
接下来就需要将 `compressedDataUrl` 转化为 `blob` 或者 `file` 对象。

`DataUrl` 格式如下。
```sh
data:image/jpeg;base64,XXXX
# 数据标识符：以"data:"开头
# MIME类型描述：指示数据的类型，"image/jpeg"表示JPEG图像
# 数据编码：以base64编码表示，"XXXX"是 base64 编码数据部分
```

咱们先把`mimetype`,`decodedData` 这 2 部分提取出来
```js
const [dataDescription, base64Data] = compressedDataUrl.split(',')
// 文件类型
const mimetype = dataDescription.match(/:(.*?);/)[1]

// 解码 base64 数据
const decodedData = atob(base64Data)
```

最后将解码的 `base64` 数据转成 `file` 即可。
```js
let n = decodedData.length
// 创建等字节大小的 Uint8Array
const u8arr = new Uint8Array(n)

// 遍历赋值
while (n--) {
  u8arr[n] = decodedData.charCodeAt(n)
}

// 通过 Uint8Array 创建 File 对象
const result = new File([u8arr], file.name, { type: mimetype })
```

### 简单封装
完整代码如下：
```js
async function compressImageByCanvas(file, options = {}) {
  const { quality } = options
  let { width, height } = options

  let _resolve, _reject
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })

  const img = new Image()
  img.onload = function () {
    // 如果只指定了宽度或高度，则另一个按比例缩放
    if (width && !height) {
      height = Math.round(img.height * (width / img.width))
    }
    else if (!width && height) {
      width = Math.round(img.width * (height / img.height))
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width || img.width
    canvas.height = height || img.height
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
    _resolve(dataURItoFile(compressedDataUrl, file.name))
  }

  img.src = createObjectURL(file)
  return promise
}

function dataURItoFile(dataURI, fileName) {
  const [dataDescription, base64Data] = dataURI.split(',')
  const mimetype = dataDescription.match(/:(.*?);/)[1]
  const decodedData = atob(base64Data)

  let n = decodedData.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = decodedData.charCodeAt(n)
  }

  return new File([u8arr], fileName, { type: mimetype })
}
```

### 兼容性问题
笔者并没有深入测试 canvas 压缩的兼容性问题，但从社区的几个前端处理 JPG 库里的 README 描述与 issues 等可以归纳出使用 `canvas` 处理时，需考虑下面几个方面的问题：
1. 大小限制：详见 [不同浏览器和设备上 canvas 大小限制](https://jhildenbiddle.github.io/canvas-size/#/?id=test-results)；
2. 信息保留：`EXIF` 信息，正确识别与处理图片方向；
3. 设备兼容性：移动端设备浏览器定制内核相对多, 边界情况较多（相关 API 的支持程度，canvas 差异性表现）。

*参考：`browser-image-compression`, `Compressor.js`, [localResizeIMG](https://github.com/think2011/localResizeIMG)*

## 完整 demo
笔者将本节内容整理成了一个 Demo，可以直接在线体验。

>**在线 Demo 体验地址 →:** https://demos.sugarat.top/pages/jpg-compress/

大概界面如下（可修改配置切换压缩方案，对比效果）：

![](https://img.cdn.sugarat.top/mdImg/sugar/736ac7e7771d2a948845e1fe0d0fa40f)

*纯血 HTML/CSS/JS，复制粘贴就能运行。*

完整源码见：[GitHub:ATQQ/demos - jpg-compress](https://github.com/ATQQ/demos/tree/main/pages/png-compress)

## 最后
后续将继续学习&探索一下 `GIF`，`MP4 转 GIF` 等常用的动图前端处理实现的方式。