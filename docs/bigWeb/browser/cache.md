# 缓存机制
## 简述
缓存是性能优化中简单高效的一种优化方式，它可以显著减少网络传输所带来的损耗

对于一个数据请求来说，可以分为发起``网络请求``、``后端处理``、``浏览器响应``三个步骤。

浏览器缓存可以帮助我们在第一和第三步骤中优化性能。例如:
* 直接使用缓存而不发起请求
* 发起了请求但后端存储的数据和前端一致，那么就没有必要再将数据回传回来，这样就减少了响应数据。

## 缓存位置
从缓存位置上来说分为四种，并且各自有优先级，当依次查找缓存且都没有命中的时候，才会去请求网络
1. Service Worker
2. Memory Cache
3. Disk Cache
4. Push Cache
5. 网络请求

### Service Worker
Service Worker 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。使用 Service Worker的话，传输协议必须为 HTTPS。因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。
1. 注册 Service Worker
2. 监听到 install 事件以后就可以缓存需要的文件
3. 下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存
   * 是:可以直接读取缓存文件
   * 否:请求数据

Service Worker 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

当 Service Worker 没有命中缓存的时候，就需要去调用 fetch 函数获取数据。也就是说，如果没有在 Service Worker 命中缓存的话，会根据缓存查找优先级去查找数据。但是不管是从 Memory Cache 中还是从网络请求中获取的数据，浏览器都会显示是从 Service Worker 中获取的内容。

**使用示例**

目录结构
```text
serviceWorker/
├── index.css
├── index.html
├── index.js
└── sw.js
```
index.css
```css
h1{
    color:red;
}
```

index.html
```html
<head>
    <link rel="stylesheet" href="./index.css">
</head>
<body>
    <h1>Service Worker Test</h1>
    <script src="./index.js"></script>
    <script src="./sw.js"></script>
</body>
```
index.js
```js
console.log('index.js')
// 注册
if (navigator.serviceWorker) {
    console.log('开始注册service Worker')
    navigator.serviceWorker
        .register('sw.js')
        .then(function (registration) {
            console.log('service worker 注册成功')
        })
        .catch(function (err) {
            console.log('servcie worker 注册失败')
        })
}
```

sw.js
```js
/**
 * 监听 `install` 事件，回调中缓存所需文件
 */
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('my-cache').then(function (cache) {
            return cache.addAll(['./index.html', './index.js', './index.css'])
        })
    )
})

// 拦截所有请求事件
// 如果缓存中已经有请求的数据就直接用缓存，否则去请求数据
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            if (response) {
                return response
            }
            console.log('fetch source')
        })
    )
})
```
显示效果

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzI5MzY2MjYwOQ==583293662609)

第一次运行输出

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzI5MzYzMDg4Nw==583293630887)

查看Service Worker(生效)

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzI5Mzc0MDM4Nw==583293740387)

查看cache(里面有我们缓存的文件)

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzI5NDM0ODk2Nw==583294348967)

我们改动index.css,然后保存

```css
h1{
    color:blue;
}
```
显示效果(不发生改变,说明是 我们设置的service Worker生效了)

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzI5MzY2MjYwOQ==583293662609)

查看控制台中的network

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzI5NDgzMzE2NA==583294833164)

查看控制台(打印了``fetch source``,说明是从service worker中取的)

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzI5NDAwODM1MA==583294008350)

以上就是ServiceWorker的使用方式

### Memory Cache

Memory Cache 也就是内存中的缓存，读取内存中的数据肯定比磁盘快。但是内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。 一旦我们关闭 Tab 页面，内存中的缓存也就被释放了。

当我们访问过页面以后，再次刷新页面，可以发现很多数据都来自于内存缓存

随便打开一个网页

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzI5NDkzNTYxOQ==583294935619)

但是浏览器会把哪些文件放入内存这是个疑问:smile:?

* 对于大文件来说，大概率是不存储在内存中的，反之优先
* 当前系统内存使用率高的话，文件优先存储进硬盘

### Disk Cache

Disk Cache 也就是存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在容量和存储时效性上。

在所有浏览器缓存中，Disk Cache 覆盖面基本是最大的。

可以根据 HTTP Herder 中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据。

### Push Cache
Push Cache 是 HTTP/2 中的内容

当以上三种缓存都没有命中时，它才会被使用。并且缓存时间也很短暂，只在会话（Session）中存在，一旦会话结束就被释放。

* 所有的资源都能被推送，但是 Edge 和 Safari 浏览器兼容性不怎么好
* 可以推送 no-cache 和 no-store 的资源
* 一旦连接被关闭，Push Cache 就被释放
* 多个页面可以使用相同的 HTTP/2 连接，也就是说能使用同样的缓存
* Push Cache 中的缓存只能被使用一次
* 浏览器可以拒绝接受已经存在的资源推送
* 你可以给其他域名推送资源

**网络请求**

如果所有缓存都没有命中,就只能发起请求获取资源

## 缓存策略
* 强缓存
* 协商缓存

优先级较高的是强缓存，在命中强缓存失败的情况下，才会走协商缓存。

都是通过设置 HTTP Header 来实现的。

### 强缓存
强缓存表示在缓存期间不需要请求，state code 为 200。

通过设置两种 HTTP Header 实现：
* Expires
* Cache-Control

**Expires**
```json
Expires : Wed Mar 04 2020 13:33:10 GMT
```
Expires是HTTP/1中的,表示资源在指定时间之后失效,需要重新请求

受限制与本地时间,可以通过修改本地时间导致其失效

**Cache-Control**

```json
Cache-control: max-age=30
```
表示资源会在 30 秒后过期，需要再次请求。

Cache-Control 出现于 HTTP/1.1，**优先级高于** Expires 。

可以在``请求头``或者``响应头``中设置，并且可以组合使用多种指令

**常见指令**
|     指令     |                 作用                  |
| :----------: | :-----------------------------------: |
|    public    |    响应可以被服务端或者客户顿缓存     |
|   private    |        响应只可以被客户端缓存         |
|  max-age=30  |       缓存30s后过期需要重新请求       |
| s-maxage=30  | 覆盖max-age,作用一致,代理服务器才生效 |
|   no-store   |            不缓存任何响应             |
|   no-cache   |        资源能被缓存,但立即失效        |
| max-stale=30 |    30s内,即使缓存过期也使用该缓存     |
| min-fresh=30 |        希望30s内获取最新的响应        |

### 协商缓存
如果缓存过期了，就需要发起请求验证资源是否有更新

协商缓存可以通过设置两种 HTTP Header:
* Last-Modified
* ETag

当浏览器发起请求验证资源时，如果资源没有做改变，那么服务端就会返回 304 状态码，并且更新浏览器缓存有效期.

**Last-Modified**

Last-Modified 表示本地文件最后修改日期，If-Modified-Since 会将 Last-Modified 的值发送给服务器，询问服务器在该日期后资源是否有更新，有更新的话就会将新的资源发送回来，否则返回 304 状态码。

Last-Modified缺点：
* 如果本地打开缓存文件，即使没有对文件进行修改，但还是会造成 Last-Modified 被修改
* 服务端不能命中缓存导致发送相同的资源
* Last-Modified 只能以秒计时，如果在不可感知的时间内修改完成文件，那么服务端会认为资源还是命中了，不会返回正确的资源

因为以上这些弊端，所以在 HTTP / 1.1 出现了 ``ETag`` 。

**ETag**

ETag 类似于文件指纹，If-None-Match 会将当前 ETag 发送给服务器，询问该资源 ETag 是否变动，有变动的话就将新的资源发送回来。并且 ETag 优先级比 Last-Modified 高。

:::tip 问题
**如果什么缓存策略都没设置，那么浏览器会怎么处理？**
:::

对于这种情况，浏览器会采用一个``启发式的算法``,通常会**取响应头中的 Date 减去 Last-Modified 值的 10% 作为缓存时间**。

## 缓存策略应用场景
### 频繁变动的资源
1. 首先使用 ``Cache-Control: no-cache``,使浏览器每次都请求服务器
2. 配合 ETag 或 Last-Modified 来验证资源是否有效。

这样的做法虽然不能节省请求数量，但是能显著减少响应数据大小。

### 代码文件
除``HTML``外的文件

一般来说，现在都会使用工具来打包代码，那么我们就可以**对文件名进行哈希处理**，只有当代码修改后才会生成新的文件名。

因此可以给代码文件设置缓存有效期一年Cache-Control: max-age=31536000，这样只有当``HTML``文件中引入的文件名发生了改变才会去下载最新的代码文件，否则就一直使用缓存。

<comment/>
<tongji/>