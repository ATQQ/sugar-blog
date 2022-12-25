---
sidebar:
 title: 本地存储
 step: 4
isTimeLine: true
title: 浏览器-本地存储
date: 2020-04-14
tags:
 - 大前端
 - 浏览器
categories:
 - 大前端
---
# 本地存储
在目前的现代浏览器中主要有以下几种存储方案
* cookie
* localStorage
* sessionStorage
* indexDB

下面为大家详细道来各种方案的适用场景与缺点

## Cookie
### 简介
主要为了辨别用户身份而储存在用户本地终端上的数据

可以记录用户对网站的访问情况（停留时长，访问深度，记录账号密码，在线状态等）

主要由服务端生成然后下发，客户端也可控制其内容

每次发送请求都会自动携带对应域名的cookie

### 如何使用

#### 服务端
服务端在响应头(Response Header)中添加一个`Set-Cookie`字段

**示例**
```js
Set-Cookie:"name=value;expires=session;path=/;domain=.sugarat.top;HttpOnly;secure;sameSite=lax"
```

#### 客户端（浏览器）
```js
document.cookie
```
可以通过此 API获取或者修改cookie


### Set-Cookie

**:star:Set-Cookie 字段的属性介绍**

| cookie属性 |          简介          |                   特殊说明                   |
| :--------: | :--------------------: | :------------------------------------------: |
|    name    |           键           |                      -                       |
|   value    |           值           |                      -                       |
|  Expires   |        过期时间        |                一个固定的时间                |
|  Max-Age   |        过期时间        | 收到此cookie后多久后过期，优先级大于Expires  |
|   Domain   | 可以送达的主机名(域名) |                      -                       |
|    path    |        生效路径        | 路径必须出现在要请求的资源的路径中才可以发送 |
|   Secure   |        安全标志        |   只有使用HTTPS协议的时候才会携带此cookie    |
|  HTTPOnly  |        安全标志        |     不允许使用脚本去更改/获取这个cookie      |
|  SameSite  |        安全标志        |            控制跨站请求获取cookie            |

**:star:属性补充说明**

* Expires：其值为默认session,即关闭浏览器时此cookie就过期失效
* Max-Age：不同取值范围不同效果
  * 大于0：会将cookie存到本地文件中
  * 等于0：立即删除
  * 小于0：等价于会话性cookie
  * 优先级大于Expires
* Domain：指定了 Cookie 可以送达的主机名
  * 没有指定：默认值为当前文档访问地址中的主机部分(不包含子域名)
  * 如果设置为`.a.com`那么`a.com`,`a.a.com`，`b.a.com`等都能访问,即`a.com`的子域名都可以访问到这个cokie
* HTTPOnly
  * 防止客户端脚本通过 `document.cookie` 方式访问或者更改 此Cookie
  * 有助于避免 XSS 攻击
* SameSite:可以设置让 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）
  * Strict:仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，当前网页 URL 与请求目标 URL 完全一致才发送
  * Lax:允许部（导航到目标网址的 Get 请求）分第三方请求携带 Cookie
  * None:无论是否跨站都会发送 Cookie
  * **之前默认值是 None ，在Chrome稳定版80及更高版本上默认是 Lax**

**:star:SameSite = lax 的影响**
```js
Set-Cookie:'name=value;SameSite=Lax;'
```
大多数情况不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外
* 超链接
* GET表单
* 预加载请求

| 请求类型  |                    示例                    | SameSite = lax 是否发送cooie |
| :-------: | :----------------------------------------: | :--------------------------: |
|  超链接   |            <a\ href="..."></a\>            |              ✅               |
|  GET表单  | <form method="GET" action="..."\></form\>  |              ✅               |
|  预加载   |    <link rel="prerender" href="..."/\>     |              ✅               |
| POST 表单 | <form method="POST" action="..."\></form\> |              ❌               |
|   image   |             <img src="..." \/>             |              ❌               |
|  iframe   |       <iframe src="..."\></iframe\>        |              ❌               |
|   ajax    |                 fetch(url)                 |              ❌               |


**:star:Cookie 的作用域**

Domain 和 Path 标识共同定义了 Cookie 的作用域：即哪些URL的请求 会携带 目标Cookie

### 用途
* 会话状态管理:（如用户登录状态、账号信息等）
* 个性化设置:（如用户自定义设置、主题等）
* 用户行为分析：埋点系统（访问深度，停留时长等）

### 缺点
* 容量问题：有上限，最大只能有 4KB
* 性能问题：同一个域名下的所有请求，都会携带 Cookie，某些请求（a,img,link等标签发出的请求）可能不需要此cookie，会加大传输的头部，损耗一定时空开销
* 安全问题：客户端可以通过一定手段（脚本，devtools，本地存储的文件，修改host文件）获取到，存在XSS,CSRF等安全问题

### 解决安全问题的方案
* 减短cookie的有效时间
* 添加HttpOnly属性：防止本地脚本读取cookie
* 服务端对传送的cookie加密
* 添加Secure属性：使用https协议传输
* 设置samesite属性为需要的值：严格卡控cookie的携带范围

## localStorage与sessionStorage
浏览器提供的数据存储API，作用相同，生命周期与作用域的不同

```js
window.sessionStorage.setItem()
window.localStorage.setItem()
window.sessionStorage.getItem()
window.localStorage.getItem()
```

### 生命周期
* localStorage 是持久化的本地存储,永远不会过期,除非手动删除
* sessionStorage 是临时性的本地存储,在会话结束时(关闭页面),存储的内容就被释放

### 作用域
`Local Storage`、`Session Storage` 和 `Cookie` 都遵循**同源策略**

但Session Storage有特殊之处：即便是相同域名下的两个页面，只要它们不在浏览器的同一个Tab中打开，那么它们的 Session Storage 内容便无法共享

### 优点
* 存储容量大:不同浏览器，针对一个域名的存储容量(大小)可以达到 4-20M（不同编码的字符占用空间大小不一样）
  * 一些资料通常说的5M：实际上指的存储内容字符串长度，即`length`等于 **5\*1024\*1024**，并不是实际上的内容大小为5Mb并且限制的是 key + value 的字符数不大于 5M(5\*1024*1024)
  * UTF-8 - 英文：1字节
  * UTF-8 - 中文：3字节
  * UTF-16 - 中/英文：4字节
* 存储于客户端，不会服务端发生通信

关于存储容量的计算demo可以[跳转查看](https://github.com/ATQQ/demos/blob/main/getLocalStoragSize/README.md)

### 缺点
* 只能存储字符串，JSON对象需要转换为json string 存储
* 只适用于存储少量简单数据
* localStorage需要手动删除

### 应用场景
* base64图片存储：存储logo
* 接口数据持久化：对于依赖于接口(变动周期比较长)生成的内容，可以使用storage存储，以加快首屏渲染

## IndexedDB
运行在浏览器上的非关系型数据库

依旧受同源策略限制

### 优点
* 理论上没有存储上线
* 可以存储字符串，还可以存储二进制数据
* 浏览器提供了一套可简单操作的API

### 应用场景
* 当数据的复杂度和规模上升到了 LocalStorage 无法解决的程度,就使用IndexDB
* 临时存储复杂的数据，如页面中的临时文章
* 一些复杂表单内容的离线保存

### 使用教程
笔者就不在这里赘述使用方法，网上有更优秀的资料

下面给大家推荐两篇
* [MDN：使用 IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)
* [阮一峰：浏览器数据库 IndexedDB 入门教程](http://www.ruanyifeng.com/blog/2018/07/indexeddb.html)

:::tip 参考
* [SameSite update 日志](https://www.chromium.org/updates/same-site)
* [devTools Storage](https://developers.google.com/web/tools/chrome-devtools/storage/cookies)
* [Chrome Platform Status](https://www.chromestatus.com/feature/5088147346030592)
* [SameSite cookies explained](https://web.dev/samesite-cookies-explained/)
:::
