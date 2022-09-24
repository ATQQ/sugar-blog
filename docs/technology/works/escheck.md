---
title: ESCheck工具原理解析及增强实现
date: 2022-09-19
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# ESCheck工具原理解析及增强实现

<!-- TODO：掘金标语 -->
<!-- TODO：示例代码的Github地址 -->

## 前言

2022了，大家做的面向C端的产品，还是避不开兼容性的话题（即使IE已官宣停止支持）

但就目前看来这个停止维护还是避免不了大家做开发还是要考虑兼容低端机，甚至`IE11`

针对js目前通常的手段都是通过工具对js进行语法降级至 ES5，同时引入对应的 polyfill（垫片）

工具首选还是老牌 [Babel](https://babeljs.io/)，当然现在还有 [SWC](https://swc.rs/) 这个冉冉升起的新星

经过一顿操作为项目配置 Babel 之后，为了保证产物不出现 ES5 之外的语法，通常都会搭配一个 Check 工具去检测产物是否符合要求

本文将阐述市面上已有工具的`实现原理`，`功能对比`，最后`实现增强型的es-check`（支持HTML中的js检测，产物直接进行语法降级），提供 CLI 和 Lib 两种使用方式

下面先分别介绍一下社区版的[es-check](https://github.com/yowainwright/es-check)和滴滴版的@mpxjs/es-check，最后再实现一个集大成者

## es-check
先看一下其效果，下面是用于测试的代码
```js
// test.js
var str = 'hello'
var str2 = 'world'

const varConst = 'const'
let varLet = 'let'
const arrFun = () => {
    console.log('hello world');
}
```
```sh
npx es-check es5 testProject/**/*.js
```
![图片](https://img.cdn.sugarat.top/mdImg/MTY2NDAyODU1NTI3OA==664028555278)

可以看到其报错信息比较简单，只输出了代码中的第一个ES语法问题`const`,然后对应的是行数和具体文件路径

我们再把这个测试文件`构建压缩混淆一下`(模拟build产物)

```sh
npx tsup __test__/testProject/js/index.js --sourcemap -d __test__/testProject/dist --minify
```
通过结果，可以看到，只说有解析问题，并未告知是什么问题，然后有对应的行列数

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NDAyOTcwMjg4Ng==664029702886)

如果有`sourcemap`那么我们暂且是可以通过[source-map](https://www.npmjs.com/package/source-map)这个库解析一下，以上面的报错为例
```ts
// npx esno source-map.ts
import sourceMap from 'source-map'
import fs from 'fs'
import path from 'path'

const file = path.join(__dirname, 'testProject/dist/index.js.map')
const lineNumber = 1
const columnNumber = 45

;(async () => {
  const consumer = await new sourceMap.SourceMapConsumer(
    fs.readFileSync(file, 'utf-8')
  )
  const sm = consumer.originalPositionFor({
    column: columnNumber,
    line: lineNumber
  })
  // 对应文件的源码
  const content = consumer.sourceContentFor(sm.source!)
  // 错误行的代码
  const errCode = content?.split(/\r?\n/g)[sm.line! - 1]
  console.log(errCode)
})()
```
执行结果如下，可以得到对应的错误代码

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NDAzMjI5MTA1Mw==664032291053)

### 原理分析
打开[源码](https://github.com/yowainwright/es-check/blob/master/index.js)可以看到实现非常简单，关键不过100行。可以总结为3步骤

1. 使用 [fast-glob](https://www.npmjs.com/package/fast-glob) 获取目标文件
2. 使用 [acorn](https://github.com/acornjs/acorn/tree/master/acorn) 解析源码生层AST，并捕获解析错误
3. 判断是否存在解析错误，有就打印

`acorn` 是一个很常见的 js 解析库，可以用于AST的生成与CRUD操作，其包含1个 `ecmaVersion` 参数用于指定要解析的 `ECMAScript` 版本。`es-check`正是利用了这个特性

```ts
import * as acorn from 'acorn'

try {
  acorn.parse(`const a = 'hello'`, {
    ecmaVersion: 5,
    silent: true
    // sourceType: 'module'
    // allowHashBang:true
  })
} catch (err) {
  // The keyword 'const' is reserved (1:0)
  console.log(err)
  // err 出了继承常规 Error 对象，包含 stack 和 message 等内容外，还包含如下信息
  // {
  //   pos: 0,
  //   loc: Position { line: 1, column: 0 },
  //   raisedAt: 7
  // }
}
```


## 最终对比

| Name              | JS  | HTML | Friendly |
| ----------------- | --- | ---- | -------- |
| es-check          | ✅   | ❌    | ❌        |
| @mpxjs/es-check   | ✅   | ❌    | ✅        |
| @sugarat/es-check | ✅   | ✅    | ✅        |

## 最后
## 参考
* [es-check](https://github.com/yowainwright/es-check)：社区出品
<comment/>
* [mpx-es-check](https://github.com/mpx-ecology/mpx-es-check)：滴滴出品 [MPX](https://mpxjs.cn/) 框架的配套工具