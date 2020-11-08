# 本地存储
在目前的线代浏览器中主要有以下几种存储方案
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
服务端在响应头中添加一个`Set-Cookie`字段

**示例**
```js
Set-Cookie:"name=value;expires=session;path=/;domain=.sugarat.top;HttpOnly;secure;sameSite=lax"
```

**Set-Cookie 字段的属性介绍**

### 属性
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


**补充说明**
* Expires：其值为默认session,即关闭浏览器时此cookie就过期失效
* Max-Age：不同取值范围不同效果
  * 大于0：会将cookie存到本地文件中
  * 等于0：立即删除
  * 小于0：等价于会话性cookie
  * 优先级大于Expires
* Domain:指定了 Cookie 可以送达的主机名
  * 没有指定:默认值为当前文档访问地址中的主机部分(不包含子域名)
  * 如果设置为`.a.com`那么`a.com`,`a.a.com`，`b.a.com`等都能访问,即`a.com`的子域名都可以访问到这个cokie
* HTTPOnly
  * 防止客户端脚本通过 `document.cookie` 方式访问或者更改 此Cookie
  * 有助于避免 XSS 攻击
* SameSite:可以设置让 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）
  * Strict:仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，当前网页 URL 与请求目标 URL 完全一致才发送
  * Lax:允许部（导航到目标网址的 Get 请求）分第三方请求携带 Cookie
  * None:无论是否跨站都会发送 Cookie
  * **之前默认值是 None ，在Chrome稳定版80及更高版本上默认是 Lax**

**SameSite = lax**
```js
Set-Cookie:'name=value;SameSite=Lax;'
```
大多数情况不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外
* 超链接
* GET表单
* 预加载请求

| 请求类型  |                    示例                    | SameSite = lax 是否发送cooie |
| :-------: | :----------------------------------------: | :--------------------------: |
|  超链接   |            <a\ href="..."></a\>            |      :white_check_mark:      |
|  GET表单  | <form method="GET" action="..."\></form\>  |      :white_check_mark:      |
|  预加载   |    <link rel="prerender" href="..."/\>     |      :white_check_mark:      |
| POST 表单 | <form method="POST" action="..."\></form\> |             :x:              |
|   image   |             <img src="..." \/>             |             :x:              |
|  iframe   |       <iframe src="..."\></iframe\>        |             :x:              |
|   ajax    |                 fetch(url)                 |             :x:              |

<!-- TODO：wait continue -->

**Domain 和 Path 标识共同定义了 Cookie 的作用域：即 Cookie 应该发送给哪些 URL。**
### 用途
* 会话状态管理:（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
* 个性化设置:（如用户自定义设置、主题等）
* 浏览器行为跟踪:埋点系统（如跟踪分析用户行为等）
### 缺点
* 容量小:有上限，最大只能有 4KB
* 大的Cookie会浪费巨大的性能:同一个域名下的所有请求，都会携带 Cookie
* 可以在客户端直接获取到:有XSS,CSRF等安全问题
### 解决安全问题的方法
* 减短cookie的有效时间
* HttpOnly设置为true:防止本地脚本读取cookie
* 加密cookie
* Secure属性为true:使用https协议传输
## localStorage与sessionStorage
生命周期与作用域的不同
### 声明周期
* localStorage 是持久化的本地存储,永远不会过期,除非手动删除
* sessionStorage 是临时性的本地存储,在会话结束时(关闭页面),存储的内容就被释放

### 作用域
``Local Storage``、``Session Storage`` 和 ``Cookie`` 都遵循同源策略。但Session Storage，即便是相同域名下的两个页面，只要它们不在同一个浏览器窗口中打开，那么它们的 Session Storage 内容便无法共享。

### 优点
* 存储容量大:不同浏览器，存储容量可以达到 5-10M,针对一个域名
* 存储于客户端，不与服务端发生通信。

### 缺点
* 只能存储字符串
* 只适用于存储少量简单数据

### 应用场景
* base64图片存储
* 存储logo

## IndexedDB
运行在浏览器上的非关系型数据库

>受同源策略限制，即无法访问跨域的数据库。

### 优点
* 理论上没有存储上线
* 可以存储字符串，还可以存储二进制数据。

### 应用场景

* 当数据的复杂度和规模上升到了 LocalStorage 无法解决的程度,就使用IndexDB
* 临时存储复杂的数据,如页面中的临时文章

[简单使用](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)


:::tip 参考
* [SameSite update 日志](https://www.chromium.org/updates/same-site)
* [devTools Storage](https://developers.google.com/web/tools/chrome-devtools/storage/cookies)
* [Chrome Platform Status](https://www.chromestatus.com/feature/5088147346030592)
* [SameSite cookies explained](https://web.dev/samesite-cookies-explained/)
:::
<comment/>
<tongji/>