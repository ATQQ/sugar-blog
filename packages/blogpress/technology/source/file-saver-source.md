---
title: FileSaver.js源码学习，纯前端实现文件下载，防止浏览器直接打开预览
date: 2021-06-07
tags:
 - 技术笔记
 - 源码学习
categories:
 - 技术笔记
---

# FileSaver.js源码学习，纯前端实现文件下载，防止浏览器直接打开预览

## 背景
在[毕设项目](https://github.com/ATQQ/easypicker2-client)的开发中，有文件下载的场景

其中文件直接从OSS（对象存储服务）上下载文件，使用`a标签`直接指向下载资源的方案存在一些小问题

如果文件类型是浏览器支持的类型的话，将会直接打开预览，不会调用下载

如在下载**图片**，**PDF**等文件的时候如果直接打开预览，对用户来说非常不友好，体验较差

**问题方案代码**
```js
function download(url){
  const a = document.createElement('a')
  a.target = '_blank'
  a.href = url
  document.body.append(a)
  a.click()
  a.remove()
}
```
首先想到的就是谷歌，然后就找到了这篇文章的主角[FileSaver.js](https://github.com/eligrey/FileSaver.js)

## FileSaver.js简介
**机翻**
>FileSaver.js 是在客户端保存文件的解决方案，非常适合在客户端生成文件的 Web 应用程序，但是如果文件来自服务器，我们建议您首先尝试使用 Content-Disposition 附件响应 标题，因为它具有更多的跨浏览器兼容性。

**简述**
>纯前端下载文件的解决方案

### 使用
```js
import { saveAs } from 'file-saver';
saveAs('sourceUrl')
// or
saveAs('sourceUrl','filename')
```

API非常简洁（吃鲸.jpg），非常好用

抱着敬畏与学习的态度，戳开了[仓库的源码](https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js)，好家伙只有100多行代码，这不得好好学习一番...

## 核心的下载方法
扫两遍源码，很快总结出了最小的，可运行代码

补齐了一些注释后如下
```js
function download(url, name) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  // 设置返回数据的类型为blob
  xhr.responseType = 'blob'
  
  // 资源完成下载
  xhr.onload = function () {
    // 获取响应的blob对象
    const blob = xhr.response
    const a = document.createElement('a')
    // 设置下载的文件名字
    name = name || blob.name || 'download'
    a.download = name

    // 解决安全问题，新页面的window.opener 指向前一个页面的window对象
    // 使用noopener使 window.opener 获取的值为null
    a.rel = 'noopener'

    // 创建一个DOMString指向这个blob
    // 简单理解就是为这个blob对象生成一个可访问的链接
    a.href = URL.createObjectURL(blob)

    // 40s后移除这个临时链接
    setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
    // 触发a标签，执行下载
    setTimeout(function () {
      a.dispatchEvent(new MouseEvent('click'))
    }, 0)
  }
  // 发送请求
  xhr.send()
}
```

**使用示例**

```html
<body>
    <button id="btn">下载</button>
    <script src="./index.js"></script>
</body>
```

```js
document.getElementById('btn').addEventListener('click', function () {
  const url = 'https://img.cdn.sugarat.top/mdImg/MTU3OTM2ODc3OTM4Nw==579368779387'
  download(url)
})
```
总结一下就是使用`URL.createObjectURL(blob)`为资源的创建一个临时的链接进行下载

浏览器会直接将这资源下载到本地，不会进行预览

## 发现的缺陷
### 大文件需要等待长时间
由于使用了`xhr`实现，在`xhr.onload`是在资源完全响应后才会触发

这就存在一个问题，如果文件非常大，那么需要等待很久，才会执行下载（直接完成）

用户无法感知到这个下载过程，会以为下载没生效（传统的下载会由浏览器接管，所以用户能看到进度），疯狂的连续多次的点击

我们需要监听下载的进度，用于提醒用户，下面拓展一下上面的`download`方法:
* 监听onprogress方法
* 获取`total`与`loaded`这两个属性
* 相除得到下载进度

```js
function download(url, name) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'

  // 增加的代码
  xhr.onprogress = function (e) {
    const { total,loaded } = e
    const percentage = (loaded/total).toFixed(2)
    console.log('progress:', percentage);
  }
  
  xhr.onload = function () {
    // 省略...跟前面的代码一致
  }
  xhr.send()
}
```

**示例**

找了一个稍微大一点的图片进行测试，可以发现在网速慢的时候还是需要一定的时间才能完成下载

```js
download('https://img.cdn.sugarat.top/mdImg/MTYyMzA3NjA4NDQ4NA==desktop.jpg')
```

## 总结
* 适合解决下载图片，PDF等文件被浏览器直接打开的情况
* 针对比较大的资源，可以改造一下，反馈下载进度，提升用户体验

偶尔遇到一些工具库，源代码不多的话，可以花些时间看看，精炼精炼，然后变成自己的东西

