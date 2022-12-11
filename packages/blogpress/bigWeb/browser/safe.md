---
sidebar:
 title: 安全问题
 step: 5
isTimeLine: true
title: 浏览器-安全问题
date: 2020-10-27
tags:
 - 大前端
 - 浏览器
categories:
 - 大前端
---
# 安全
在现代网络中，安全相关的问题是非常繁杂的，种类颇多

这里只介绍Web开发中经常碰到的一些安全问题：
* SQL注入
* XSS
* CSRF
* 点击劫持
* 中间人攻击

## SQL注入
### 什么是SQL注入
后台人员使用用户输入的数据进行拼接组装SQL查询语句时,遇到恶意输入就会返回不应该返回的内容

### 简单示例
**普通的查询语句**
```sql
SELECT * FROM articles WHERE id = $id
```

**1. 客户端发送的正常请求**
```js
/api/articlres/article?id = 12
```
拼接后的SQL
```sql
SELECT * FROM articles WHERE id = 12
```

**2. 注入SQL发送的恶意请求**
```js
/api/articlres/article?id=1%20or%201=1
```
这里的 `%20`是空格经过UrlEncode过后的内容

拼接后的sql
```sql
SELECT * FROM articles WHERE id = 12 or 1=1
```
这样就扩大了查询数据的范围，导致查询异常或者 返回原本不该返回的数据

### 如何防范
加入过滤和验证机制：
* 将参数的所有内容当做值，而不是当做字符串的一部分
* 使用正则表达式过滤传入的参数
* 检查传入内容是否包含非法的关键字

## XSS
### 什么是 XSS

``XSS``全称``Cross Site Scripting`` ，`即跨站脚本`攻击

攻击者可以将代码注入页面，然后可以进行一系列损害用户利益的事情
* 窃取Cookie
* 监听用户行为
* 修改 DOM 伪造登录表单
* 在页面中生成浮窗广告
* 恶意跳转
* ...

恶意代码未经过滤，与网站正常的代码混在一起，以至于浏览器无法分辨哪些脚本是可信的，导致恶意脚本被执行

XSS 可以分为两类：``持久型``和``非持久型``

**持久型**

持久型也就是攻击的代码被服务端写入进数据库中,在页面加载的时候执行

常见于服务端渲染的时候出现

示例
```html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <title>Document</title>
</head>
<body>
    <script src="./test.js"></script>
</body>
</html>
```

```js
function renderPage() {
    // ajax获取数据 <script>alert(123)</script>
    // 解析字符串生成对应dom节点
    const script = document.createElement('script')
    script.innerHTML = 'alert(123)'
    document.body.appendChild(script)
}
renderPage()
```

**非持久型**

一般通过修改 URL 参数的方式加入攻击代码，诱导用户访问链接从而进行攻击
```html
<!-- http://www.domain.com?name=<script>alert(1)</script> -->
<div>{{name}}</div>  
```

**jquery触发此错误示例**
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="https://cdn.staticfile.org/jquery/1.10.0/jquery.min.js"></script>
</head>

<body>
    <h1>大标题</h1>
    <ul id="list"></ul>
    <script src="./test.js"></script>
</body>

</html>
```
test.js
```js
const data = [
    '1',
    '2',
    '<script>alert(123)</script>'
]
data.forEach(str=>{
    $('#list').append(`<li>${str}</li>`)
})
```
### 如何防范

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
或者利用现代浏览器的特性

自动处理特殊字符
```js
function filterStr(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
}
filterStr('<div></div>') // &lt;div&gt;&lt;/div&gt;
```

### CSP
CSP - 内容安全策略

本质上就是建立白名单，明确告诉浏览器哪些外部资源可以加载和执行

可以通过这种方式来尽量减少 XSS 攻击。

**使用方式**
* 设置 HTTP Header 中的 Content-Security-Policy
* 设置 meta 标签的方式 ``<meta http-equiv="Content-Security-Policy">``

```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">
```
上述策略解释
* 脚本：只信任当前域名
* ``<object>``标签：不信任任何URL，即不加载任何资源
* 样式表：只信任cdn.example.org和third-party.org
* 框架（frame）：必须使用HTTPS协议加载
* 其他资源：没有限制

示例：
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy"
        content="script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">
    <script src="https://cdn.staticfile.org/jquery/1.10.0/jquery.min.js"></script>
    <title>Document</title>
</head>

<body>
    <h1>测试</h1>
    <script>
        console.log($);
    </script>
</body>

</html>
```
观察浏览器的devtools面板会发现以下内容

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjMxODQxNDk2NQ==606318414965)

阻止第三方域名的脚本资源加载，阻止内联脚本执行

### 防止脚本读取Cookie
JavaScript提供了访问cookie的API

可以通过`document.cookie`读取与修改cookie
```js
document.cookie
```

**新增一个cookie**
```js
document.cookie = 'sugar=at;expires=session'
```
执行后我们可以在devtools面板的`Application`选项卡中看到我们添加的cookie

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjMxOTM3NDEzMQ==606319374131)

```js
console.log(document.cookie)
// 可以看到我们刚才设置的cookie
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjMyMDU3MDE0Mw==606320570143)


目前很多统计网站的埋点监控，权限控制，离线数据都依赖于cookie，第三方脚本很容易的能够进行窃取

可以为Cookie添加HttpOnly属性，防止脚本读取网站的cookie

添加`Secure`属性要求必须使用https协议才能传输此cookie，可以防止中间人截获修改到传输的cookie


## CSRF
### 什么是CSRF
``CSRF``--``Cross-site request forgery``--跨站请求伪造

攻击者构造出一个请求链接，诱导用户点击或者通过某些途径自动发起请求

主要利用的cookie会自动附带在请求header中这个特性，很多网站使用cookie鉴权

如果当前用户是在登录状态下请求的此链接的话，服务端就以为是用户在操作，从而进行相应的逻辑

### 发起手段
* 自动GET:使用img,link,script等等标签
* 自动POST:自动提交表单的脚本
* 诱导用户点击：iframe,a标签，透明的元素等

```html
<img src="http://a.b.com/api/xxx"/>
<link href="http://a.b.com/api/xxx">
<script src="http://a.b.com/api/xxx"></script>
<script>
setTimeout(()=>{
    const $form = document.createElement('form')
    $form.method = 'POST'
    $form.action = 'a.b.com/api/xxx'
    document.body.appendChild($form)
    $form.submit()
    $form.remove()
},0)
</script>
```

### 如何防范
* Get请求不对数据进行修改,即无副作用操作
* 服务端过滤
  * 阻止第三方网站请求接口
  * 验证request header中的 Referer/Origin:通过Referer验证请求是否为第三方发送
    * Origin:域名信息
    * Referer:包含具体URL
    * **开发者可通过自定义请求头伪造**
* 请求时附带验证信息
  * 添加验证码参数
  * request header中添加一个token字段
* 阻止第三方网站访问到用户 Cookie
* 设置Cookie的SameSite属性： Cookie 随跨域请求发送的策略
  * Strict:仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，当前网页 URL 与请求目标 URL 完全一致才发送
  * Lax:允许部分（导航到目标网址的 Get 请求）第三方请求携带 Cookie
  * None:无论是否跨站都会发送 Cookie

Cookie相关更多知识-> [本地存储-Cookie](./storage.md#set-cookie)

## 点击劫持
### 什么是点击劫持
点击劫持是一种视觉欺骗的攻击手段

1. 攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己的网页中，并将 iframe 设置为透明，在页面中透出一个按钮诱导用户点击：此种方式最为常见，因为iframe中可以嵌入用户已经登陆过的网页
2. 使用一个透明的绑定了事件元素附在正常元素上，诱导用户点击


### 如何防范
#### 1. X-FRAME-OPTIONS
针对iframe形式的可通过设置**X-FRAME-OPTIONS**

X-FRAME-OPTIONS 是一个 HTTP 响应头

该响应头有三个值可选，分别是:
* DENY，表示页面不允许通过 iframe 的方式展示
* SAMEORIGIN，表示页面可以在相同域名下通过 iframe 的方式展示
* ALLOW-FROM，表示页面可以在指定来源的 iframe 中展示


#### 2. JS 防御
* window.self: 当前 window 对象的引用
* window.top: 最顶层的窗口对象
* window.parent: 当前窗口的直接父对象

在页面中加入此代码
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
### 什么是中间人攻击
* 中间人攻击是`攻击方`同时与`服务端`和`客户端`建立起了连接，并让对方认为连接是安全的
* 攻击者不仅能获得双方的通信信息，还能修改通信信息

**场景举例：使用非对称加密传输的数据**
1. 中间人已经同时与客户端与服务端建立了链接
2. 服务端下发公钥a1，中间人截获，然后下发自己的公钥b1
3. 客户端接收到公钥b1，对传输的数据 “你好” 加密成 “xxx”，然后发送给服务端
4. 中间人收到数据 “xxx”，用自己的私钥B解密获得内容 “你好”，然后用截获的a1公钥 加密 内容“滚滚滚”成 “yyy”，发送给服务端
5. 服务端收到内容 “yyy” 用自己的私钥A解密 得到 “滚滚滚”的内容

在这个过程中，中间人不仅获取了用户传输的真实数据，还给服务的发送了错误的信息

### 如何防范
* 使用https
* 不要在公共Wi-Fi上发送敏感数据
* 使用权威机构的CA证书

:::tip 参考
* [简书 - sql注入基础原理（超详细）](https://www.jianshu.com/p/078df7a35671)
* [MDN:Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)
* [阮一峰:CSP](http://www.ruanyifeng.com/blog/2016/09/csp.html)
:::
