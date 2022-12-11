---
isTimeLine: true
title: 为什么要使用模块化？有哪几种方式可以实现模块化，各有什么特点？
date: 2020-04-14
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# 为什么要使用模块化？有哪几种方式可以实现模块化，各有什么特点？
## 为什么要使用模块化？
**好处**
* 解决命名冲突
* 提高代码复用性
* 提高项目的可维护性


## 有哪几种方式可以实现模块化，各有什么特点
* IIFE(立即执行函数)
* AMD
  ```js
    define(['./a', './b'], function(a, b) {
      // 加载模块完毕可以使用
      a.do()
      b.do()
    })
  ```
* CMD
  ```js
    define(function(require, exports, module) {
      // 加载模块
      // 可以把 require 写在函数体的任意地方实现延迟加载
      var a = require('./a')
      a.doSomething()
    })
  ```
* CommonJS

CommonJS 最早是 Node 在使用，目前也仍然广泛使用，比如在 Webpack 中你就能见到它，当然目前在 Node 中的模块管理已经和 CommonJS 有一些区别了
  ```js
    // a.js
    module.exports = {
        a: 1
    }
    // or 
    exports.a = 1

    // b.js
    var module = require('./a.js')
    module.a // -> log 1
  ```
* ES Module

ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别:

|   方案    |         导出          |             导入              |          语法           |   this    |
| :-------: | :-------------------: | :---------------------------: | :---------------------: | :-------: |
| CommonJS  |  值拷贝/只能单个导出  | 动态导入(运行时加载)/同步导入 | 动态语法,可以写在判断中 | 当前模块  |
| ES Module | 值的引用/可以导出多个 |    编译时输出接口/异步导入    | 静态语法,只能写在最顶层 | undefined |

**ES Module 会编译成 require/exports 来执行的**
```js
// 引入模块 API
import XXX from './a.js'
import { XXX } from './a.js'
// 导出模块 API
export function a() {}
export default function() {}
```

