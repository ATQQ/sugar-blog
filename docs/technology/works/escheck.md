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

下面先分别介绍一下社区版的[es-check](https://github.com/yowainwright/es-check)和滴滴版的[@mpxjs/es-check](https://github.com/mpx-ecology/mpx-es-check)，最后再实现一个集大成者

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
  // err 除了继承常规 Error 对象，包含 stack 和 message 等内容外，还包含如下信息
  // {
  //   pos: 0,
  //   loc: Position { line: 1, column: 0 },
  //   raisedAt: 7
  // }
}
```

下面是`es-check`的精简实现，完整源码见 [Github](https://github.com/ATQQ/tools/blob/feature/es-check/packages/cli/es-check/__test__/es-check.ts)

```ts
// npx esno es-check.ts
import fg from 'fast-glob'
import path from 'path'
import * as acorn from 'acorn'
import fs from 'fs'

const testPattern = path.join(__dirname, 'testProject/**/*.js')
// 要检查的文件
const files = fg.sync(testPattern)

// acorn 解析配置
const acornOpts = {
  ecmaVersion: 5,// 目标版本
  silent: true
  // sourceType: 'module'
  // allowHashBang:true
}

// 错误
const errArr: any[] = []

// 遍历文件
files.forEach((file) => {
  const code = fs.readFileSync(file, 'utf8')
  try {
    acorn.parse(code, acornOpts as any)
  } catch (err: any) {
    errArr.push({
      err,
      stack: err.stack,
      file
    })
  }
})

// 打印错误信息
if (errArr.length > 0) {
  console.error(
    `ES-Check: there were ${errArr.length} ES version matching errors.`
  )
  errArr.forEach((o) => {
    console.info(`
        ES-Check Error:
        ----
        · erroring file: ${o.file}
        · error: ${o.err}
        · see the printed err.stack below for context
        ----\n
        ${o.stack}
      `)
  })
  process.exit(1)
}

console.info(`ES-Check: there were no ES version matching errors!  🎉`)
```
![图片](https://img.cdn.sugarat.top/mdImg/MTY2NDEwNzY1NjA0Nw==664107656047)


### 小结
1. 只能检测源码中是否存在不符合对应ECMAScript版本的语法
2. 只会反应出文件中第一个语法问题
3. 错误信息只包含所在文件中的`行列号`以及`parser error`
4. 不支持html

## mpx-es-check
>滴滴出品的 [mpx](https://mpxjs.cn/) (增强型跨端小程序框架)的配套工具 [@mpxjs/es-check](https://github.com/mpx-ecology/mpx-es-check)

咱们还是用上面的例子先实测一下效果
```sh
# 1
npm i -g @mpxjs/es-check
# 2
mpx-es-check --ecma=6 testProject/**/*.js
```
可以看到其将错误信息输出到了1个log文件中

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NDA3Mzg0NTcxNw==664073845717)

log日志信息如下，还是很清晰的指出了有哪些错误并标明了错误的具体位置，内置了`source-map`解析。

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NDA3NDExNjQ3Ng==664074116476)

下面来探究一下实现原理
### 原理分析
打开源码，从[入口文件](https://github.com/mpx-ecology/mpx-es-check/blob/master/index.js)开始看，大体分为以下几步：
1. 使用`glob`获取要检测目标文件
2. 获取文件对应的`源码`和`sourcemap`文件内容
3. 使用[@babel/parser](https://babel.dev/docs/en/babel-parser)解析生成AST
4. 使用[@babel/traverse](https://babel.dev/docs/en/babel-traverse)遍历节点
5. 将所有非ES5语法的节点规则进行枚举，再遍历节点时，找出符合条件的节点
6. 格式化输出信息

其中`@babel/parser`与`@babel/traverse`是`babel`的核心构成部分。一个用于解析一个用于遍历

节点规则示例如下，这个方法准确，就是费时费力，需要将每个版本的特性都穷举出来
```ts
// 部分节点规则
const partRule = {
  // let and const
  VariableDeclaration(node) {
    if (node.kind === 'let' || node.kind === 'const') {
      errArr.push({
        node,
        message: `Using ${node.kind} is not allowed`
      })
    }
  },
  // 箭头函数
  ArrowFunctionExpression(node) {
    errArr.push({
      node,
      message: 'Using ArrowFunction(箭头函数) is not allowed'
    })
  }
}
```

下面是遍历规则与节点的逻辑
```ts
// 存放所有节点
const nodeQueue = []
const code = fs.readFileSync(file, 'utf8')
// 生成AST
const ast = babelParser.parse(code, acornOpts)
// 遍历获取所有节点
babelTraverse(ast, {
  enter(path) {
    const { node } = path
    nodeQueue.push({ node, path })
  }
})

// 遍历每个节点，执行对应的规则
nodeQueue.forEach(({ node, path }) => {
  partRule[node.type]?.(node)
})

// 解析格式化错误
errArr.forEach((err) => {
  // 省略 sourcemap 解析步骤
  problems.push({
    file,
    message: err.message,
    startLine: err.node.loc.start.line,
    startColumn: err.node.loc.start.column
  })
})
```
精简实现的运行结果如下，完整源码见[Github](https://github.com/ATQQ/tools/blob/feature/es-check/packages/cli/es-check/__test__/mpx-es-check.ts)

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NDA5MjM0NDgyNQ==664092344825)

### 小结
1. 检测输出的结果相对友好（比较理想的格式），内置了sourcemap解析逻辑
2. 不支持html
3. 需要额外维护一套规则（相对ECMAScript迭代频率来说，可以接受）

## 增强实现es-check
综上2个对比，从源码实现反应来看 `es-check` 的实现更简单，维护成本也相对较低
<!-- 补超链接 -->
@sugarat/es-check 也将基于`es-check`做1个增强实现，弥补`检测HTML`，`友好提示`、`sourcemap解析`、`单文件多次检测`等能力

### 单文件多次检测

### 友好提示

### sourcemap解析
### HTML支持

## 最终对比
| Name              | JS  | HTML | Friendly |
| ----------------- | --- | ---- | -------- |
| es-check          | ✅   | ❌    | ❌        |
| @mpxjs/es-check   | ✅   | ❌    | ✅        |
| @sugarat/es-check | ✅   | ✅    | ✅        |

## 最后
当然这个工具可能存在bug，存在遗漏场景等情况
## 参考
* [es-check](https://github.com/yowainwright/es-check)：社区出品
* [mpx-es-check](https://github.com/mpx-ecology/mpx-es-check)：滴滴出品 [MPX](https://mpxjs.cn/) 框架的配套工具

<comment/>