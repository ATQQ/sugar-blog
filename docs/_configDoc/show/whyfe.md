---
isTimeLine: true
title: 我眼中的前端🧐
date: 2020-12-13
tags:
 - 大前端
categories:
 - 其它
sticky: 2
---

# 我眼中的前端🧐

> 个人能力有限，大部分内容均站在个人角度思考，如有表述错误之处，还请斧正，避免误导新同学

## 前言

**写本文目的**
* 为了帮助想学前端，或者正在学前端的学弟学妹，前端新人等 重新认识前端或者说是加深对**前端工程师**的认识
* 回答收集到的一些疑问

tips:本文中提到的FE（Front-End）均指前端

## 什么是前端开发

这里先引用[百度百科-前端开发](https://baike.baidu.com/item/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91)的介绍

>前端开发是创建Web页面或app等前端界面呈现给用户的过程，通过HTML，CSS及JavaScript以及衍生出来的各种技术、框架、解决方案，来实现互联网产品的用户界面交互

>从网页制作演变而来，名称上有很明显的时代特征。在互联网的演化进程中，网页制作是Web1.0时代的产物，早期网站主要内容都是静态，以图片和文字为主，用户使用网站的行为也以浏览为主。随着互联网技术的发展和HTML5、CSS3的应用，现代网页更加美观，交互效果显著，功能更加强大。

目前很多新同学和部分学校的老师对前端开发的认识还是停留在**Web1.0**时代

认为FE的工作就是写写网页（页面），认为没有什么难度，容易学习，能力很容易达到天花板

加之网上各种在线教育机构，铺天盖地的针对没有过多FE基础的同学的课程广告 （XX天入门前端，仿XX项目，XX天入门到精通）容易对新人产生误导

这是一种比较狭义的认识

**从广义上来讲，所有用户终端产品与`视觉`和`交互`有关的部分，都有前端工程师的身影，且前端工程师的职责不止于此**，后文会详细介绍

## 快速发展的前端

![图片](http://img.cdn.sugarat.top/mdImg/MTYwNzgyODkyNTU2OA==607828925568)

在Web1.0时代掌握 HTML,JS,CSS 即可

但现代Web开发强调**工程化**，所需要掌握的内容远不止于此，尤其是JS现在已经算是前端的顶梁柱

由此诞生了一句名言：

>任何可以用 JavaScript 来写的应用，最终都将用 JavaScript 来写

**关于开发框架：**
* 曾经流行: JQuery,UI框架（Bootstrap,Layui）,requirejs(模块化方案)
* 现在流行: 组件化开发，Vue，React

**现代Web开发技术列举**

* 平台相关
  * 桌面应用：Electron
  * 跨端开发：Native，React Native，Cordova, Weex，uni-app，Rax（阿里），Taro（京东），Chameleon（滴滴），Hippy（腾讯）等 --- 百花齐放
    * 一端开发多端复用：代码复用
    * 端指：web,ios,Android,小程序等
  * web：Vue，React，Angular
* 强类型支持：TypeScript
* 构建工具：Gulp，Webpack，Grunt
* 服务端：Node.js -> express,koa,egg 等
* css预编译：SASS、Less、Stylus

以上只是对一些前端技术做了一些列举，并不全面，来说明现在前端繁荣的生态

## 前端工程师能做什么
除了普通的页面编写，前端**工程师** 还有很多能做的事情...

### 面向普通用户
* PC：PC网页，桌面应用
* 移动端：H5应用，手机App，小程序
* 互动交互
  * 游戏：比如支付宝（蚂蚁庄园，蚂蚁森林），淘宝（每年双十一的游戏活动页），各种App中的果园游戏，常见于活动页的交互游戏
  * 动画：用户看见的一些有趣的动画
  * 交互：组件/页面维度之间的交互动画
* 数据可视化：用户常见的数据图表

### 面向开发者
* 工程化
  * 流程规范工具
  * 度量监控系统：日志收集，错误上报，页面监控，数据分析，水印服务等
  * 构建工具：基于现有的构建工具进行定制化
  * 研发框架：针对特定业务场景框架，基于已有的开源框架进行定制化的框架
  * CLI：脚手架工具
  * 组件：UI组件，业务组件，图形组件
  * 测试：UI自动化测试工具
  * CI/CD：持续集成与持续交付平台搭建，云构建平台
* 性能优化
* Node.js
  * Node中间件
  * 服务端开发框架
  * 各种自动化工具
* 跨端技术：一套代码，多端复用的框架
  * 小程序跨端：微信，QQ,支付宝，百度，字节跳动，快应用等等小程序
  * 移动端跨端：IOS,Android
  * PC端跨端：windows，Linux，MacOS
* 可视化技术：将数据转化成为交互的图形或图像
  * 数据报表
  * 地理信息可视化
  * 数据图表
* 搭建服务平台：通过拖拽，结合少量配置的方式生成完整的页面技术
* 智能化平台：通过AI机器学习，实现直接通过设计原件 生成页面代码，并保证代码的高质量

## 如何成为合格的初级FE
**个人观点**

### 1. 具备一定的HTML,CSS基础
* 能完成对UI设计稿的还原
* 能完成一些简单的交互动画

### 2. 扎实的JS基础
js是FE书写最多的内容，很多框架技术,工具等也由JS书写，即最终都脱离不了JS

* 熟悉ES5,ES6的语法
* 了解BOM/DOM API: 至少了解这些API提供了哪些能力，不一定要记住API如何使用
* 熟悉一门现代Web框架（Vue,React,Angular）的使用,并了解其一些核心的原理

### 3. 工程化能力
* 了解如何使用构建工具
* 了解如何调试自己的应用

### 4. 项目能力
* 能够部署自己的web应用
* 会使用一种数据库
* 具备一定的服务端开发能力

### 其它
* 能够持续学习
* 不排斥新技术

## 前端相关开发技术列举

### 1. Web开发
**开发框架**
* [Vue](https://cn.vuejs.org/https://cn.vuejs.org/)
* [React](https://react.docschina.org/)
* [Angular](https://angular.cn/)

**UI组件库**
* Vue: [ElementUI](https://element.eleme.cn/),[iView](http://iview.talkingdata.com/#/),[Cube UI](https://didi.github.io/cube-ui/#/zh-CN)，[Vant](https://youzan.github.io/vant/#/zh-CN/),[vuetify](https://vuetifyjs.com/en/)，[Ant design](https://www.antdv.com/docs/vue/introduce-cn/)
* React: [Ant design](https://ant-design.gitee.io/docs/react/introduce-cn)，[MATERIAL-UI](https://material-ui.com/zh/),[Chakra UI](https://chakra-ui.com/)

### 2. 跨端开发
一套代码，多端复用

**桌面应用**
* [Electron](https://www.electronjs.org/)
* [Flutter](https://flutter.dev/) 

**移动应用**
|                               框架名称                                |  IOS  | Android | 小程序 |  Web  |
| :-------------------------------------------------------------------: | :---: | :-----: | :----: | :---: |
|                [React Native](https://reactnative.cn/)                |   ✅   |    ✅    |   ❌    |   ✅   |
|                 [Cordova](http://cordova.axuer.com/)                  |   ✅   |    ✅    |   ❌    |   ❌   |
|                 [uni-app](https://uniapp.dcloud.io/)                  |   ✅   |    ✅    |   ✅    |   ✅   |
|                  [Weex](https://weex.apache.org/zh/)                  |   ✅   |    ✅    |   ❌    |   ❌   |
|                      [Rax](https://rax.js.org/)                       |   ❌   |    ❌    |   ✅    |   ✅   |
|           [Taro](https://nervjs.github.io/taro/docs/README)           |   ❌   |    ❌    |   ✅    |   ✅   |
|                   [Chameleon](http://cml.didi.cn/)                    |   ❌   |    ❌    |   ✅    |   ✅   |
| [Hippy](https://github.com/Tencent/Hippy/blob/master/README.zh_CN.md) |   ✅   |    ✅    |   ❌    |   ✅   |
|                    [Flutter](https://flutter.dev/)                    |   ✅   |    ✅    |   ❌    |   ✅   |

### 3. 游戏引擎
* [egret-白鹭引擎](https://www.egret.com/)
* [LayaAir](https://www.layabox.com/)
* [phaser](http://phaser.io/)
* [Hilo](http://hiloteam.github.io/index.html)

### 4. 服务端开发-[Node.js](https://nodejs.org/zh-cn/)
* [Express](https://expressjs.com/)
* [koa](https://koajs.com/)
* [Nest](https://nestjs.com/)
* [egg](https://eggjs.org/zh-cn/)

### 5. 数据可视化
* 相关技术：[SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG),[Web GL](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API),[Canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
* 可视化库：[echarts](https://echarts.apache.org/zh/index.html),[antv](https://antv.vision/),[Chart.js](https://www.chartjs.org/),[VICTORY](https://formidable.com/open-source/victory/)...

### 6. 构建工具
* [webpack](https://www.webpackjs.com/)
* [glup](https://www.gulpjs.com.cn/)
* [grunt](https://www.gruntjs.net/)

### 7. 工程化中使用工具
* [Babel](https://www.babeljs.cn/)
* [Eslint](https://cn.eslint.org/)

### 8. 度量监控
* [frontjs](https://www.frontjs.com/)
* [fundebug](https://www.fundebug.com/)
* [百度统计](https://tongji.baidu.com/web/welcome/login)
* [Google Analytics](https://marketingplatform.google.com/about/)
* [CNZZ](https://www.umeng.com/web)

### 9. 智能化
* [imgcook](https://www.imgcook.com/)
* [pipcook](https://alibaba.github.io/pipcook/#/zh-cn/)
* [TensorFlow.js](https://www.tensorflow.org/js?hl=zh-cn)

### 其它
* [TypeScript](https://www.tslang.cn/)
* ...

TODO: 补充一张前端技术的思维导图

## 总结
前端目前正在迅猛发展，未来的前景也是一片大好

随着硬件技术的迭代，会出现更多的应用场景，FE的工作还是非常具有挑战性的

行业缺的是 **工程师**，而不是 **UI还原师**

## QA
### 1. 前端的主要工作，以及前段的好处及坏处

### 2. 前端如何入门，前端学习的阶段（学习步骤）

### 3. 前端学习有什么需要注意的吗

### 4. 前端学习进入大厂的方式

### 5. 前端学习如何可以快速做出一个项目（学什么）

### 6. 做一个桌面小程序或者微信小程序需要学习什么除了三件套之外

### 7. 进入大厂除了必要的前端知识，还需要什么知识。比如后端，数据库之类的需要吗

### 8. 进入大厂需要准备什么以前端来说，比如项目，或者奖，是必要的吗

TODO: 待补充


## 参考资料
* [语雀-分享狼叔关于《大前端工程化的实践与思考》](https://www.yuque.com/robinson/fe-pro/gu001d)

<comment/>
<tongji/>