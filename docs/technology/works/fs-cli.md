# 实用的文件下载上传CLI工具实现

## 前言
在日常学习/生活中，下载资源时，大部分情况是通过别人分享的资源站点，找到下载入口然后触发下载。

当资源通过url传播的时候，一般也是直接打开，通过浏览器触发下载。

资深的冲浪选手，一般会用一些客户端工具（还记得Win上的各种下载器），Mac上笔者有时候会使用 [NeatDownloadManager](https://www.neatdownloadmanager.com/index.php/en/)，无 🪜 时也能拥有不错的下载速度

**Coder**们用命令行下载文件的方式就很多了，比如最常使用的内置库 [curl](https://github.com/curl/curl)

下面是最常用的拉取资源的例子
```sh
# 链接是第三方服务缩短后的
# -L 参数表明自动对资源进行重定向
curl -L http://mtw.so/6647Rc -o 码上掘金logo.image

# 通过管道
curl -L http://mtw.so/6647Rc >码上掘金logo.image

# 原图链接 https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/759e2aa805c0461b840e0f0f09ed05fa~tplv-k3u1fbpfcp-zoom-1.image
```

当然 **curl** 也支持上传下载，以及多种传输协议，具体用法这里就不展开了，感兴趣的读者可以前往[Quick Reference: Curl 备忘清单](https://wangchujiang.com/reference/docs/curl.html) 进一步了解。

本文针对常见的文件下载&上传场景做一些定制。

定制场景包含`url文件下载`，`GitHub/Gitee Release资源简化下载`，`七牛OSS文件直传`等。

知识点包含`Node下载文件`，`CLI配置存储`，`Proxy 网络代理`等

下面是简单演示
TODO：

## url资源下载
先是纯 **url资源下载** 的场景，本小节将详细展开相关小功能的实现

### Node原生实现
基于`读写流`操作，可以看到代码还是十分的简洁
```ts
import https from 'https'
import fs from 'fs'
import path from 'path'
function downloadByUrl(url: string, filename?: string) {
  const filepath = path.resolve(filename || randomName())
  https.get(url, (response) => {
    // 创建1个可写流
    const writeStream = fs.createWriteStream(filepath)
    response.pipe(writeStream).on('close', () => {
      console.log(`file save to ${filepath}`)
    })
  })
}

// sourceUrl 为前面的原图链接
downloadByUrl(sourceUrl,'test.image')
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY2ODI2MjI2ODMxNQ==668262268315)

### 下载进度获取
大一点的文件肯定无法实现秒下载，需要获取一下进度，了解现在下载了多少

资源的总大小可以一般可以通过`response headers`中的`content-length`字段获取
```ts
const sumSize = +response.headers['content-length']
```

流的传输进度可以通过`on data`事件间接获取

在不通过`response.setEncoding(BufferEncoding)`修改的编码时，`chunk`默认是`Buffer`类型

```ts
let receive = 0
response.on('data', (chunk: Buffer) => {
  receive += chunk.length
  const percentage = receive / sumSize
})
```
到此进度`percentage`就可以获取到了

对上面的方法进行稍加改造通过链式调用增加`progress`，`end`两个方法

```ts
function downloadByUrl(url: string, filename?: string) {
  let receive = 0

  // 支持链式调用相关逻辑
  let progressFn: (cur: number, rec: number, sum: number) => void
  let endFn: (filepath: string) => void

  const thisArg = {
    progress: (fn: typeof progressFn) => {
      progressFn = fn
      return thisArg
    },
    end: (fn: typeof endFn) => {
      endFn = fn
      return thisArg
    }
  }

  https.get(url, (response) => {
    // 输出文件路径
    const filepath = path.resolve(filename || randomName())
    // 创建一个可写流
    const writeStream = fs.createWriteStream(filepath)

    const sumSize = +response.headers['content-length']! || 0
    response.on('data', (chunk: Buffer) => {
      receive += chunk.length
      progressFn && progressFn(chunk.length, receive, sumSize)
    })

    response.pipe(writeStream).on('close', () => {
      endFn && endFn(filepath)
    })
  })
  return thisArg
}

// 调用示例
downloadByUrl(sourceUrl, 'test.image')
  .progress((current, receive, sum) => {
    console.log(receive, ((receive / sum) * 100).toFixed(2), '%')
  })
  .end((filepath) => {
    console.log('file save:', filepath)
  })
```
![图片](https://img.cdn.sugarat.top/mdImg/MTY2ODI2MzA2OTAyMQ==668263069021)

### 重定向处理
部分资源在对外直接暴露时，可能是一个短链，此时就需要做重定向处理

重定向的状态码常见`301`和`302`，当然还有其它的3开头的这里不赘述

除了状态码，重定向的目标url由`response.headers.location`表示

这里稍微改造一下之前的代码，添加一个重定向逻辑即可
```ts
// 通过url 简单区分一下 资源是 https 还是 http 
const _http = url.startsWith('https') ? https : http
_http.get(
  url,
  {
    // 添加一个UA，避免404
    // 部分短链服务网站没有UA会响应404
    headers: {
      'User-Agent': 'node http module'
    }
  },
  (response) => {
    const { statusCode } = response
    // 判断状态码是否3开头
    if (Math.floor(statusCode! / 100) === 3) {
      // 且存在 location
      if (response.headers.location) {
        // 递归
        downloadByUrl(response.headers.location, filename)
          // 透传事件
          .progress(progressFn)
          .end(endFn)
        return
      }
      // 不存在抛出错误
      throw new Error(
        `url:${url} status ${statusCode} without location header`
      )
    }
  }
)
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY2ODI2NjY3NjE0MA==668266676140)

### 后台下载

### Proxy

### 相关三方库

## 本地配置存储
