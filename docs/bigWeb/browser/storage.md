# 本地存储

## Cookie
> 为了辨别用户身份而储存在用户本地终端上的数据。

针对一个域名

以键值对的形式存在
### 设置
1. 服务端的响应头中添加一个``Set-Cookie``字段
2. 浏览器收到之后会保存下来
3. 之后的每次请求都会附带上这个

### 属性
* name:键
* value:值
* Expires:过期时间
  * 当不设置Expires时其值为session,关闭浏览器时过期失效
* Max-Age:设置cookie失效时所需要的时间
  * 大于0:会存到本地文件中
  * 等于0:立即删除
  * 小于0:等价于会话性cookie
  * max-age优先级大于cookie
* Domain:指定了 Cookie 可以送达的主机名
  * 没有指定:默认值为当前文档访问地址中的主机部分(不包含子域名)
  * 如果设置为``.a.com``那么``a.com``,``a.a.com``,````b.a.com````都能访问
* Path:指定URL路径
  * 路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部
* Secure:标记为 Secure 的 Cookie 只应通过被HTTPS协议加密过的请求发送给服务端
* HTTPOnly:防止客户端脚本通过 document.cookie 等方式访问 Cookie,有助于避免 XSS 攻击
* SameSite:可以让 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）
  * Strict:仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致
  * Lax:允许部分第三方请求携带 Cookie
  * None:无论是否跨站都会发送 Cookie
  * 之前默认是 None 的，Chrome80 后默认是 Lax

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

<tongji/>