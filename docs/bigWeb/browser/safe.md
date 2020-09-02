# 浏览器安全防范

## SQL注入
### 什么是SQL注入?
后台人员使用用户输入的数据进行拼接组装SQL查询语句时,遇到恶意输入就会返回不应该返回的内容

**例如**
```sql
sql = "SELECT * FROM articles WHERE id = ? "
```
**正常情况发送的请求**
```js
/api/articlres/article?id = 12
```
**注入SQL**
```js
/api/articlres/article?id = 12 OR 1 = 1
```
### 如何防范?
* 服务端加入过滤和验证机制
## XSS
### 什么是 XSS 攻击？

``XSS``全称``Cross Site Scripting`` 跨站脚本

攻击者将代码注入页面
* 窃取Cookie
* 监听用户行为:表单输入
* 修改 DOM 伪造登录表单
* 在页面中生成浮窗广告
* 恶意跳转
* ...

XSS 可以分为两类：``持久型``和``非持久型``。

**持久型**

持久型也就是攻击的代码被服务端写入进数据库中,在页面加载的时候执行

**非持久型**

一般通过修改 URL 参数的方式加入攻击代码，诱导用户访问链接从而进行攻击
```html
<!-- http://www.domain.com?name=<script>alert(1)</script> -->
<div>{{name}}</div>  
```

### 如何防范 XSS 攻击？什么是 CSP？

#### 转义字符
>不相信任何用户的输入

转译用户输入的内容
```js
function escape(str) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quto;')
  str = str.replace(/'/g, '&#39;')
  str = str.replace(/`/g, '&#96;')
  str = str.replace(/\//g, '&#x2F;')
  return str
}
```
#### CSP
CSP 本质上就是建立白名单，明确告诉浏览器哪些外部资源可以加载和执行。可以通过这种方式来尽量减少 XSS 攻击。

**使用方式**
* 设置 HTTP Header 中的 Content-Security-Policy
* 设置 meta 标签的方式 ``<meta http-equiv="Content-Security-Policy">``

```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">
```
* 脚本：只信任当前域名
* ``<object>``标签：不信任任何URL，即不加载任何资源
* 样式表：只信任cdn.example.org和third-party.org
* 框架（frame）：必须使用HTTPS协议加载
* 其他资源：没有限制

#### 设置HttpOnly
阻止脚本读取cookie,防范XSS

:::tip 参考
[MDN:Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)<br/>
[阮一峰:CSP](http://www.ruanyifeng.com/blog/2016/09/csp.html)
:::

## CSRF
### 什么是 CSRF 攻击？
``CSRF``--``Cross-site request forgery``--跨站请求伪造

攻击者构造出一个后端请求地址，诱导用户点击或者通过某些途径自动发起请求。如果用户是在登录状态下的话，后端就以为是用户在操作，从而进行相应的逻辑。

### 如何伪造CSRF
* 自动GET:使用img,link等等标签
* 自动POST:自动提交表单的脚本
* 诱导用户点击

### 如何防范 CSRF 攻击？
* ``Get``请求不对数据进行修改,即无副作用操作
* 阻止第三方网站请求接口
* 请求时附带验证信息，比如验证码或者 Token
* 不让第三方网站访问到用户 Cookie
* 设置SameSite:表示 Cookie 不随着跨域请求发送
  * strict:完全禁止第三方请求携带Cookie
  * lax:get 方法提交表单,a标签发送 get 请求可以携带
  * none:请求会自动携带上 Cookie
* 验证Referer/Origin:通过Referer验证请求是否为第三方发送
  * Origin:域名信息
  * Referer:包含具体URL
  * **可通过自定义请求头伪造**
* Token:服务器下发一个随机 Token，每次发起请求时将 Token 携带上，服务器验证 Token 是否有效

## 点击劫持
### 什么是点击劫持？
点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己的网页中，并将 iframe 设置为透明，在页面中透出一个按钮诱导用户点击。

### 如何防范点击劫持？
**X-FRAME-OPTIONS**

X-FRAME-OPTIONS 是一个 HTTP 响应头

该响应头有三个值可选，分别是:
* DENY，表示页面不允许通过 iframe 的方式展示
* SAMEORIGIN，表示页面可以在相同域名下通过 iframe 的方式展示
* ALLOW-FROM，表示页面可以在指定来源的 iframe 中展示


**JS 防御**

```html
<head>
  <style id="click-jack">
    html {
      display: none !important;
    }
  </style>
</head>
<body>
  <script>
    if (self === top) {
      var style = document.getElementById('click-jack')
      document.body.removeChild(style)
    } else {
      top.location = self.location
    }
  </script>
</body>
```

## 中间人攻击
### 什么是中间人攻击？
* 中间人攻击是攻击方同时与服务端和客户端建立起了连接，并让对方认为连接是安全的。
* 攻击者不仅能获得双方的通信信息，还能修改通信信息。

### 如何防范中间人攻击？
* 使用https
* 不要在公共Wi-Fi上发送敏感数据

<comment/>
<tongji/>