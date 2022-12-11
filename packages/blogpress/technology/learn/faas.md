---
isTimeLine: true
title: ServerLess之云函数实践-天气API
date: 2020-11-23
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# ServerLess之云函数实践-天气API

## 前言
云计算是大势所趋

Serverless 架构即“⽆服务器”架构，它是一种全新的架构方式，是云计算时代⼀种⾰命性的架构模式

FaaS(Function as a Service - 函数即服务) 是在无状态容器中运行的事件驱动型计算的执行模型

☁️云函数算是FaaS的一种具体的形式，由云商（腾讯云，阿里云，七牛云等等）提供计算平台，开发者只需关注函数逻辑的实现，将服务器相关的配置管理工作统统交给云商去做，不再花大精力去管理服务器

我们只需要提供一段代码，由云商研制的 FaaS 方案帮我们选择语言对应技术栈的最佳实践，基于内置的扩展机制按实际需要，进行动态扩展计算资源，轻松部署服务到公网，并提供可靠的监控、报警保障，不需要以前一样，服务器资源不是大部分时间处于闲置状态，就是遇到超大浏览需要紧急扩容

给 FaaS 一个函数，就能上线一个高可用的服务

简单的服务接口开发的专业性要求降低了，前端有了更大的发挥空间，包括但不限于：
* BFF（Backend For Frontend）
* SSR（Server-Side Rendering）

上面简单的介绍了一下“云函数”，有一点抽象，下面就结合实操，来搞一个”实用的“

![](http://wx3.sinaimg.cn/large/78b88159gy1gkr8mh459dg208w08cu0x.gif)

## :cloud:搞一个简单的天气查询API

就像这样的：[点我体验](https://service-rixme52n-1256505457.cd.apigw.tencentcs.com/release/checkWeather?cityId=3)

参数：cityId [地区参照表](https://www.weiyun.com/office?fid=1c8be5bf-7ee0-451d-ba19-0cd31371d7a2&pid=2d1ebb3d8cd9f0ef71a8cf4cb1f75120&ppid=2d1ebb3d07e603741f4015313cc3cd2b&size=908800&share_key=5lgsGhw) 

## 所使用到的技术与平台
* Node.js (云函数选用JavaScript语言)
* [腾讯云](https://cloud.tencent.com/) - 免费的云函数服务
* [阿里云](https://market.aliyun.com/products/57096001/cmapi023656.html?accounttraceid=235b91fa4fc145eb8c2e539568143ea2arym#sku=yuncode1765600000) - 免费的墨迹天气查询服务

下面开始手把手教程

## 腾讯云侧
### 1. 注册账号

注册腾讯云账号并登录

[https://cloud.tencent.com/](https://cloud.tencent.com/)

### 2. 进入控制台

点击右上角进入控制台

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA1OTA0OTA5MA==606059049090)

### 3. 云函数-函数服务

左上角选择云产品，输入云函数，选择 云函数-函数服务

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA1OTEwOTg4NQ==606059109885)

### 4. 新建云函数

新建一个云函数

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA1OTE5MDY3NA==606059190674)

### 5. 录入基本信息
* 符合规范的函数名称
* 环境选择一个Node.js的环境
* 选择空白函数
* 然后下一步
![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA1OTI2MDczNA==606059260734)

### 6. 完成创建

直接点击完成，什么都不更改

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA1OTUwNjc4NQ==606059506785)

### 7. 触发器

然后来到这个界面，点击触发管理

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA1OTU5ODY4MQ==606059598681)

### 8. 创建触发器

创建触发器，填写相关信息

* 触发方式-API网关触发
* 请求方法-GET
* 鉴权方法-免鉴权

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA1OTcwMDk3NA==606059700974)

### 9. 大功告成

体验一下生成的触发器[链接](https://service-36n2x31h-1256505457.cd.apigw.tencentcs.com/release/demoAPi?param1=中文&param2=123)

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA1OTgxOTU3NQ==606059819575)

### 10. 观察接口

观察响应结果与我们的代码

**响应结果**

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2MDAyMTk0Mg==606060021942)

**我们的云函数代码**

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2MDEwMjU0NA==606060102544)

关注红色框中的内容
* 执行方法：index.main_handler
  * index 对应的就是 `index.js`
  * main_handler就是就是index.js中对外暴露的 `main_handler`方法

再看代码
```js
'use strict';
exports.main_handler = async (event, context) => {
    console.log("Hello World")
    console.log(event)
    console.log(event["non-exist"])
    console.log(context)
    return event
};
```

根据上上图返回的结果可知其对应的是`event`里面的内容: 即我们可以在event中取到我们请求的参数,header,body等信息，便于我们执行后续逻辑

context的内容（console.log的内容）在哪里看?

### 11. 日志查询

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2MDQ5NDAwOA==606060494008)

在日志查询面板可以查询到我们接口的调用信息，响应状态与log的内容

### 12. 安装依赖的模块

这个和本地安装差不多，一个敲命令，一个点按钮

我们使用本地终端创建一个package.json文件

```sh
npm init -y
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2MDcyOTQyMg==606060729422)

package.json
```json
{
  "name": "faas",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

如安装axios,本地执行安装先
```sh
yarn add axios
# or
npm i axios
```
此时的package.json

```json
{
  "name": "faas",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.21.0"
  }
}

```

在平台上创建一个 package.json文件,并把上述内容粘贴进去,`ctrl/command + S` 保存修改的内容

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2MDk5Mzc5NA==606060993794)

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2MTA0MTkzNg==606061041936)

选择在线安装依赖，然后点击保存

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2MTEzNjU5NA==606061136594)

安装完成后 会出现 node_modules目录

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2MTU3NjI5Ng==606061576296)

JS云函数创建相关流程，差不都陈述完毕

下面开始我们的代码编写

### 天气云函数编写
代码同步到线上的方式
* 可以本地编辑后上传文件
* 使用腾讯云的cli工具上传
* 复制粘贴

这里比较简单我们就复制粘贴了

先简单编写一下大体结构，然后点击保存，再访问刚刚的触发器[链接](https://service-36n2x31h-1256505457.cd.apigw.tencentcs.com/release/demoAPi?cityId=666)观察返回的结果

index.js
```js
'use strict';
const http = require('axios').default

function getNowWeather(cityId = 3) {
    // 待编写
    return {
        data:{
            cityId
        }
    }
}
exports.main_handler = async (event, context) => {
    // 结构取得url中传递的参数
    const { queryString: { cityId } } = event
    return getNowWeather(cityId)
};
```

下面实现`getNowWeather`的逻辑就要用到阿里云的服务了

## 阿里云侧
先白嫖个服务

[阿里云-免费版气象天气服务（cityid）-墨迹天气](https://market.aliyun.com/products/57096001/cmapi023656.html?accounttraceid=235b91fa4fc145eb8c2e539568143ea2arym#sku=yuncode1765600000    )

根据其文档中的请求示例,我们先构建出 Node版本的方法

```js
const http = require('axios').default

function getNowWeather(cityId = 3) {
    const token = ''
    const appcode = ''
    const nowStatusURL = 'http://freecityid.market.alicloudapi.com/whapi/json/alicityweather/briefcondition' // 精简实况的请求URL
    const data = `cityId=${cityId}&token=${token}` // 请求参数
    const headers = { // header
        'Authorization': `APPCODE ${appcode}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    
    // 发送请求
    return http.post(nowStatusURL, data, {
        headers
    }).then(res => res.data)
}
```

购买服务后根据[文档](https://market.aliyun.com/products/57096001/cmapi023656.html?accounttraceid=235b91fa4fc145eb8c2e539568143ea2arym#sku=yuncode1765600000)找到[token](https://share.weiyun.com/5ebmy2i?spm=5176.730006-56956004-57096001-cmapi023656.content.12.4afb308fDQi0lQ)与[appcode](https://help.aliyun.com/document_detail/157953.html?spm=5176.730006-56956004-57096001-cmapi023656.content.9.4afb308fDQi0lQ)即可


[控制台](https://apigateway.console.aliyun.com/?spm=5176.12818093.products-recent.dapigateway.718e16d05FzxRX#/cn-beijing/purchasedApis/list)->API网关->华北2（北京）

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2MzU3MTA1OA==606063571058)

为了节约查找token与appcode的时间，下面列一下步骤（吐槽，阿里云的文档太拦了，不方便信息定位）

### token与appcode

[API网关](https://apigateway.console.aliyun.com/?spm=5176.12818093.products-recent.dapigateway.718e16d05FzxRX#/cn-beijing/apps/list?AppName=)页面地址
1. token: 应用管理->选择一个应用->已授权API列表->选择自己要查看的API->点击调试API->调试面板的token参数即是所需参数
2. appcode: 应用管理->选择一个应用->AppCode面板

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2Mzk4NTYyOQ==606063985629)

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2NDE0NzU2Mg==606064147562)

## 最终代码

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjA2NDY3MDM4MQ==606064670381)

index.js
```js
'use strict';
const http = require('axios').default

function getNowWeather(cityId = 3) {
    const token = ''
    const appcode = ''
    const nowStatusURL = 'http://freecityid.market.alicloudapi.com/whapi/json/alicityweather/briefcondition' // 精简实况的请求URL
    const data = `cityId=${cityId}&token=${token}` // 请求参数
    const headers = { // header
        'Authorization': `APPCODE ${appcode}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    
    // 发送请求
    return http.post(nowStatusURL, data, {
        headers
    }).then(res => res.data)
}

exports.main_handler = async (event, context) => {
    const {queryString:{cityId}} = event
    return await getNowWeather(cityId)
};
```
触发器[链接](https://service-36n2x31h-1256505457.cd.apigw.tencentcs.com/release/demoAPi?cityId=4) 

## 最后
到此一个云函数就开发完毕了

可以感觉到，如果熟悉创建流程了，只需要几分钟就能创建一个提供服务的API，极大的节约了成本

不懂服务端部署，服务器运维，Linux的开发者可以通过 云函数+云数据库(关系数据库，非关系数据库) 快速搭建一个后端服务

文件存储服务可以使用OSS

开发者只需要通过云函数调用各服务提供的API即可完成一个后端服务的构建

:::tip 参考
* [FaaS 给前端带来了什么？](https://cloud.tencent.com/developer/article/1666644)
* [三分钟给女票写个“彩虹屁”bot | 🏆 技术专题第七期征文](https://juejin.cn/post/6897509349246107661)
:::
