---
title: 腾讯云Serverless实践-Node.js服务部署
date: 2021-06-16
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 腾讯云Serverless实践-Node.js服务部署

:::tip
本文旨在帮助不懂运维/网络/服务器知识的**小白**，在**不租用云服务器**实现Node服务（Node开发的后端应用）的上线部署
:::

<!-- more -->

本系列已更新:
* [腾讯云Serverless实践-静态网站托管](./tx-serverless-static.md)


超多图预警！！！

该手把手Serverless实践系列预计会出几篇包含[静态站点](./tx-serverless-static.md)，云函数，后端服务等等

如有表述不清，内容错误等还请评论区斧正

## 准备工作
* [注册腾讯云账号](https://cloud.tencent.com/register)

## 创建Serverless应用

进入[控制台面板](https://console.cloud.tencent.com/)，通常在首页右上角

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTQxNDAwOTUxNg==621414009516)

然后在左上角的云产品列表中找到[Serverless应用中心](https://console.cloud.tencent.com/sls)

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1MDQ2Njg3Ng==623850466876)

然后你能看到如下的界面

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1MDUyOTAwOA==623850529008)

点击新建，可以看见有很多模板可供选择,咱这里先选择`Express`应用，然后点击下一步

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1MDU4ODUyMA==623850588520)

基本配置包含：
* 应用的名称：随心所欲填
* 环境(dev/test/prod)：随心所欲的选
* 地域（服务器所在地区）:随心所欲的选

高级配置包含：
* 内存：默认128MB，可以根据服务的情况选择256或者更高，服务会在流量大的情况下动态扩容（建立新服务实例分摊流量）不用担心因为配置问题服务挂掉
* 超时时间：默认3s，建议改长一点（10s左右），因为服务**存在冷启动问题**,所以在3s的时候部分请求可能会由于服务还未启动或者未及时响应导致接口调用失败
* 环境变量：（可以忽略，建议配在项目的.env文件中）

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1MDc3MzQ4NQ==623850773485)

填完基本信息后紧接着点击完成即可

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1MTI2Nzg1MA==623851267850)

赖心等待几分钟服务就初始化完毕了


这个真免费，不要钱（咱根本用不完免费额度 嘿嘿）

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1MzI0Njc1MQ==623853246751)

## 线上访问地址

应用创建完成后能在卡片处看见后端服务的线上地址：

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1MTQzNzUyMw==623851437523)

比如我这个demo服务地址:[https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release/](https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release/)

访问默认效果如下：

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1MTU0MDQ4Mw==623851540483)

## 模板的源代码
选择卡片中的 `开发部署` -> `更新应用`

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1MTY3ODEwNA==623851678104)

紧接着 选择 `本地开发` ,点击下载项目

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1MTgyNDEzMg==623851824132)

### 模板目录结构
```sh
/home/sugar/Downloads/source
├── index.html             
├── layer                  
|  └── serverless.yml      
├── package-lock.json      
├── package.json           
├── serverless.yml   
├── sls.js
└── src.map

directory: 1 file: 7
```
需要关注的就只有`serverless.yml`配置文件与`sls.js`

其中`serverless.yml`文件就是Serverless服务的一个配置文件

没有特殊需求咱可以不用管它，它是生成好了的与你创建的项目一一对应

其中`sls.js`文件才是咱们项目的源代码
### sls.js源代码

<details>
<summary>点击查看完整源码</summary>

```js
const express = require('express')
const path = require('path')
const app = express()

// Routes
app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/user', (req, res) => {
  res.send([
    {
      title: 'serverless framework',
      link: 'https://serverless.com'
    }
  ])
})

app.get('/user/:id', (req, res) => {
  const id = req.params.id
  res.send({
    id: id,
    title: 'serverless framework',
    link: 'https://serverless.com'
  })
})

app.get('/404', (req, res) => {
  res.status(404).send('Not found')
})

app.get('/500', (req, res) => {
  res.status(500).send('Server Error')
})

// Error handler
app.use(function(err, req, res, next) {
  console.error(err)
  res.status(500).send('Internal Serverless Error')
})

app.listen(8080)

module.exports = app
```
</details>

省去无关代码，核心上就只有短短**4行**
```js
const express = require('express')
const app = express()

// 省略注册的路由

// 省略Error handler

app.listen(8080)

module.exports = app
```
1. 引入express
2. 执行`express`实例化
3. 调用listen方法监听一个端口，以启动服务福
4. 导出这个实例


所以要部署咱们自己的Node - Express项目（其它Node项目类似），只需要简单的2步：
1. 拷贝serverless.yml 文件到自己项目对应目录
2. 小小修改sls.js文件，**先引入**自己的express实例,**再将其导出**即可

可参看后面的[现有Express项目改造示例](#现有express项目改造示例)
### serverless.yml配置文件解释
只关注根目录下的那个`serverless.yml`文件，不关注`layer/serverless.yml`

```yaml
component: express
name: express-jskJUp-v4
org: '1256505457'
app: suixinsuoyu
stage: dev
inputs:
  src:
    src: ./
    exclude:              # 上传代码时，需要排除的目录或文件
      - .env
      - node_modules/**
  region: ap-chengdu
  runtime: Nodejs10.15
  apigatewayConf:
    protocols:
      - http
      - https
    environment: release
    serviceTimeout: 60
    autoCreateDns: false
  isAutoCiDeploy: false
  functionConf:
    eip: false
    timeout: 3           # 配置的响应超时时间，超过此时间接口未响应，就直接返回错误
    memorySize: 128      # 配置的服务使用的内存大小
  layers:
    - name: '${output:${stage}:${app}:suixinsuoyu-layer.name}'
      version: '${output:${stage}:${app}:suixinsuoyu-layer.version}'
```

咱们只用关心 配置中加了注释的项

不同的框架/服务类型配置由些许差异

完整的配置介绍可翻阅文档：[Serverless应用中心-yml文件规范](https://cloud.tencent.com/document/product/1154/51080)

测试发现，服务自动安装package.json中的依赖有些问题，为问题造成的避免影响，所以需要上传本地的node_modules目录
## 现有Express项目改造示例
* [仓库完整源码](https://github.com/ATQQ/sign-server)

### 原目录结构

```sh
├── README.md
├── _tests_
|  └── index.test.js
├── docs
|  ├── api
|  └── db.md
├── jest.config.js
├── package.json
├── src
|  ├── app.js
|  ├── config
|  ├── constants
|  ├── db
|  ├── routes
|  └── utils
└── yarn.lock

```

`src/app.js`源码,省略部分代码
```js
const dotenv = require('dotenv')
const express = require('express')

// 读取-打印环境变量
// 读取.env环境变量配置文件
console.log(dotenv.config())

const { serverConfig } = require('./config')
// 用户的所有路由
const mainRouter = require('./routes')

// 实例化express
const app = express()

// 注册一些中间件
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ strict: true }))

// 首先进入的路由(全局的拦截器)
app.route('*').all(async (req, res, next) => {
  //  -------跨域支持-----------
  // 登录校验
  next()
})
// 注册所有路由
app.use(mainRouter)

app.listen(serverConfig.port, serverConfig.hostname, () => {
  console.log(`server start at ${serverConfig.hostname}:${serverConfig.port}`)
})
```
### 改造步骤
参考上面叙述的两个步骤：
1. `sls.js`,`serverless.yml`文件拷贝（一共3个），拷贝后的目录如下

```sh
├── LICENSE
├── README.md
├── _tests_
|  └── index.test.js
├── docs
|  ├── api
|  └── db.md
├── jest.config.js
├── layer       
|  └── serverless.yml # 1
├── package.json
├── serverless.yml   # 2
├── sls.js           # 3
├── src
|  ├── app.js
|  ├── config
|  ├── constants
|  ├── db
|  ├── routes
|  └── utils
└── yarn.lock

directory: 10 file: 11
```

2. 小小修改 app.js 与 sls.js中的源码

**src/app.js**改动
```js
// 省略其它代码
app.listen(serverConfig.port, serverConfig.hostname, () => {
  console.log(`server start at ${serverConfig.hostname}:${serverConfig.port}`)
})

// 添加的一行导出app实例
module.exports = app
```

sls.js源码
```js
// 引入导出的app
const app = require('./src/app')

// 再将其导出
module.exports = app
```

大功改成，改造完毕

## 线上WebIDE查看源码
回到`Serverless-应用`选择我们刚刚创建的应用，回到熟悉的卡片页

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1NDQ3NDM2Ng==623854474366)

点击云函数蓝色的那个函数名称（是一个链接），就会跳转到WebIDE页面

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1NDYyODA1OQ==623854628059)

咱就能通过WebIDE查看到我们模板项目的源代码，其中还有一些不是模板中的代码，咱不管它，也不去修改


## 部署上线
下面咱简单修改一下我们刚才的那个模板项目，然后部署上线

### 简单修改模板
* [模板修改后的完整源码](https://github.com/ATQQ/demos/blob/main/sls-express/README.md)

<details>
<summary>点击查看 index.html 修改后的内容</summary>

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>随心所欲Demo - Express.js</title>
</head>

<body>
  <h1>
    接口列表（随心所欲Demo）
  </h1>
  <ul>
    <li><span>首页</span><span>GET:</span>/</li>
    <li><span>获取随机数字</span><span>GET:</span>/random/code</li>
    <li><span>登录</span><span>POST:</span>/user/login</li>
    <li><span>404</span><span>GET:</span>/404</li>
  </ul>
</body>

</html>
```

</details>

<details>
<summary>点击查看 sls.js 修改后的内容</summary>

```js
const express = require('express')
const path = require('path')
const app = express()

// Routes
app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/random/code',(req,res)=>{
  res.send({
    num:Math.random()
  })
})
app.post('/user/login', (req, res) => {
  res.send({
    code:0,
    data:{
      token:'test-token'
    },
    msg:'ok'
  })
})

app.get('/404', (req, res) => {
  res.status(404).send('Not found')
})

// Error handler
app.use(function(err, req, res, next) {
  console.error(err)
  res.status(500).send('Internal Serverless Error')
})

app.listen(8080)

module.exports = app

```
</details>

### 前置环境
* Node.js

确保电脑上有Node.js环境，没有可参考[菜鸟教程：Node.js](https://www.runoob.com/nodejs/nodejs-install-setup.html) 安装

打开你的终端工具查看是否拥有Node环境
```sh
node -v
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTQxNzk1NjM2Nw==621417956367)

### Serverless Framework
安装[Serverless Framework](https://github.com/serverless/serverless/blob/master/README_CN.md)

```sh
npm install -g serverless
```

验证是否安装完成
```sh
sls -v
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1NTY5MzQwMg==623855693402)
### 部署

在项目跟路径执行部署指令

**部署**
```sh
sls deploy
```

会弹出一个**登录**界面，**微信扫码**登录即可

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1NTc3MDY2Mg==623855770662)

此时静静等待几秒

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1NTg4ODkxMA==623855888910)

出现此图说明部署成功

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1NTkzMDUxNw==623855930517)

示例访问地址：[https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release/](https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release/)

部署的GET接口地址:
* [GET /random/code](https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release/random/code)
* [GET /404](https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release/404)


访问结果可以看出我们改造后的模板项目已经上去了

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzg1NjM4NDQyMw==623856384423)

到此从0-1的创建应用到部署上线的流程都走完了


# TODO
* 补全原生Node使用HTTP模块开发的应用部署
* 补全koa项目的部署
* 探究一下终端如何展示二维码的，展示图片的可能性

