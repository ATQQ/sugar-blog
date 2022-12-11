---
title: 内联JS处理(ES语法降级&内容压缩)
date: 2022-10-22
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# 内联JS处理(ES语法降级&内容压缩)

> 本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

本文简单介绍一下当前`html`在现代工程中的现状，并阐述内联js代码可能存在的一些问题，同时介绍一系列处理页面内联脚本的方法，以及通过`SWC`如何转换目标代码，通过`CLI工具如何组合这些能力`。

## 前言

**当下**大部分现代前端Web工程中，HTML文件大部分都是以`public/index.html`或`<projectRoot>/index.html`存在

其内容也比较简单，通常像下面这样。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- some meta or link source -->
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

项目通过构建工具，将编写的"源码"进行`一系列操作`后转换成供浏览器可直接运行的js

在产生的`HTML文件`中体现的就是通过`<script src>`和`<link href>`标签引入了构建后的资源

其中部分插件会往页面中直接插入`内联的JS代码`。

当然也不排除一些项目也会主动通过`CDN`引入一些第三方的SDK，然后会在模板中插入一些`初始化或者激活相应功能特性的代码`。

针对上面2种情况产生的`JS`代码，`大部分情况下`是没有通过`babel`进行编译的，可能存在一些质量问题（兼容性问题为主）。

如果只是`ES语法检查`，可以用前面文章介绍的[增强ESCheck工具](https://juejin.cn/post/7148618887787970597)进行检测。

本文将进一步介绍一下提取`HTML inline Code`的多种方法，然后进一步使用`SWC`对内联脚本进行`压缩`，`ES语法转换降级`等等操作。

## InlineJS内容处理
用于测试的目标代码如下
```html
<body>
  <div id="app"></div>
  <script>
    const hello = 'hello'
  </script>
  <script src="hello.js"></script>
  <script>
    const world = 'hello'
  </script>
  <script>
    console.log(hello,world);
  </script>
</body>
```

目的是将里面的`js code`先提取出来，然后将里面的`const`简单的替换成`var`
```ts
// 简单转换示例
function simpleConst2Var(code: string) {
  return code.replace(/const /g, 'var ')
}
```
### 正则
搞文本内容的处理首先想到的方法，[简单的正则](https://regexper.com/#%2F%3Cscript%3E%28%5B%5Cs%5CS%5D*%3F%29%3C%5C%2Fscript%3E%2Fg)如下

```
/<script>([\s\S]*?)<\/script>/g
```
![图片](https://img.cdn.sugarat.top/mdImg/MTY2NjQzNTk5MjcyMg==666435992722)


利用`replace`方法，几行代码就能搞定
```ts
function traverseScript(htmlCode: string, transformFn: (v: string) => string) {
  const rScriptTag = /<script>([\s\S]*?)<\/script>/g
  return htmlCode.replace(rScriptTag, (all, $1) => {
    return all.replace($1, transformFn($1))
  })
}
```

局限性就是无法区分出注释，字符串的值，勉强可用。

示例代码地址:[inline-code/regexp.ts](https://github.com/ATQQ/tools/blob/main/packages/cli/inlinejs-transform/__test__/inline-code/regexp.ts)

### GoGoCode
>GoGoCode 是一个基于 AST 的 JavaScript/Typescript/HTML 代码转换工具，API是jQuery风格，API还是很简洁好用

其中`HTML`的解析使用的是[hyntax-yx](https://www.npmjs.com/package/hyntax-yx)看上去是 fork[hyntax](https://www.npmjs.com/package/hyntax)重新发了个版

因此用`GoGoCode`同样可以很简单的实现

先生成AST
```ts
import $ from 'gogocode'
const htmlAST = $(htmlCode, { parseOptions: { language: 'html' } })
```
遍历`<script>`节点，其中`$scriptNode`节点结构如下，可以直接使用`attr`方法进行值的`存取操作`

```ts
htmlAST.find(`<script>$_$</script>`).each(($scriptNode) => {
  const origin = $scriptNode.attr('content.value.content')
  $scriptNode.attr('content.value.content', transformFn(origin.toString()))
})
```
![图片](https://img.cdn.sugarat.top/mdImg/MTY2NjQ0OTc4NTQxMQ==666449785411)

完整代码如下
```ts
function traverseScript(htmlCode: string, transformFn: (v: string) => string) {
  const htmlAST = $(htmlCode, { parseOptions: { language: 'html' } })
  htmlAST.find(`<script>$_$</script>`).each(($scriptNode) => {
    const origin = $scriptNode.attr('content.value.content')
    $scriptNode.attr('content.value.content', transformFn(origin.toString()))
  })
  return htmlAST.generate()
}
```

代码量和使用正则差不多，但使用AST操作准确性更高，可玩性也强。

`hyntax`只提供了AST与Tokens的生成，节点遍历与AST内容转换输出由[GoGoCode实现](https://github.com/thx/gogocode/tree/main/packages/gogocode-core/src/html-core)。

示例代码地址:[inline-code/gogocode.ts](https://github.com/ATQQ/tools/blob/main/packages/cli/inlinejs-transform/__test__/inline-code/gogocode.ts)

### svelte
> [Svelte](https://www.sveltejs.cn/) 是一种全新的构建用户界面的方法。传统框架如 React 和 Vue 在浏览器中需要做大量的工作，而 Svelte 将这些工作放到构建应用程序的编译阶段来处理。

*当然不了解这个框架，也不影响理解后续的代码，可以接着往下看*

这个是从 [AST Explorer](https://astexplorer.net/#/gist/d08dcb5d93461b5811a254a8f9630a6f/5032128f77e49280e3fbfc4656bd9560f6ce6dec) transform示例demo中看到的

看了一下[demo实现代码](https://github1s.com/fkling/astexplorer/blob/HEAD/website/src/parsers/html/transformers/svelte/index.js#L35)

[sevlte/compiler](https://github.com/sveltejs/svelte/blob/146e7a6310627d4599bb60760d573dffa5d1d2ce/src/compiler/compile/index.ts#L88)提供了直接生成AST的方法`compile`
```ts
import * as svelte from 'svelte/compiler'

const AST = svelte.compile(htmlCode).ast
const htmlAST = AST.html
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NjUxMjc4MTc4MQ==666512781781)


同时提供了一个预处理方法`preprocess`，可以实现`script`,`style`与其他标签内容的遍历与修改，最后返回处理后的结果

使用示例如下，其返回值是`promise`
```ts
import * as svelte from 'svelte/compiler'

svelte.preprocess(htmlCode, {
  script(ops) {
    return {
      code: transformFn(ops.content)
    }
  }
})
```

同样按照上面要求实现`script代码的转换`，代码很简洁
```ts
function traverseScript(htmlCode: string, transformFn: (v: string) => string) {
  return svelte
    .preprocess(htmlCode, {
      script(ops) {
        return {
          code: transformFn(ops.content)
        }
      }
    })
    .then((v) => v.code)
}
```

示例代码地址:[inline-code/svelte.ts](https://github.com/ATQQ/tools/blob/main/packages/cli/inlinejs-transform/__test__/inline-code/svelte.ts)

### posthtml
>[PostHTML](https://github.com/posthtml/posthtml) 是一个支持使用用 JS 插件转换 HTML/XML 的库。本身只包含`HTML parser`, `HTML node tree API`, `node tree stringifier`三部分。

插件开发也很简单，其官方的[awesome](https://github.com/posthtml/awesome-posthtml)里提供了很多示例的插件，也有可参考的[API文档](https://posthtml.org/#/api)

先通过[AST Explorer demo 示例](https://astexplorer.net/#/gist/d08dcb5d93461b5811a254a8f9630a6f/cc9ab894776ff836030a82a44bbe6794ad5c306c)看一下其生成的AST面貌

其AST结构描述很朴素

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NjUxNjA5NzE0NQ==666516097145)

使用方法如下,也很简单
```ts
import posthtml, { Node } from 'posthtml'

const result = posthtml()
    .use(posthtmlPlugin)
    .process(htmlCode, { sync: true }).html
```

这里就简单实现一下`posthtmlScriptContentTransform`
* 利用`match`遍历`script`节点
* 使用用户传入的`transformFn`处理`content`内容

```ts
import type { Node } from 'posthtml'

function posthtmlScriptContentTransform(transformFn: (v: string) => string) {
  return (tree: Node) => {
    tree.match({ tag: 'script' }, (node) => {
      if (node?.content?.[0]) {
        node.content[0] = transformFn(node.content[0].toString())
      }
      return node
    })
  }
}
```

最终使用代码如下
```ts
function traverseScript(htmlCode: string, transformFn: (v: string) => string) {
  return posthtml()
    .use(posthtmlScriptContentTransform(transformFn))
    .process(htmlCode, { sync: true }).html
}
```

示例代码地址:[inline-code/posthtml.ts](https://github.com/ATQQ/tools/blob/main/packages/cli/inlinejs-transform/__test__/inline-code/posthtml.ts)

### 小结
这部分除了`正则`外，介绍了3个可以用来提取`inline js`库（`gogocode`，`svelte`，`posthtml`）

从专业程度来看`posthtml`更加合适，拓展起来也方便，后面的功能也将基于其直接开发插件，方便复用。

## 使用SWC处理
>[SWC](https://swc.rs/) 是一个可以用于替换babel的工具，基于Rust实现，在单线程上比 Babel 快20倍。

前面主要阐述了html中js代码的提取，这个部分就简单阐述一下使用`SWC`对js部分代码进行`ES语法降级`与`压缩`。

直接利用[transformSync](https://swc.rs/docs/usage/core#transformfilesync)方法对代码进行语法降级
* [jsc](https://swc.rs/docs/configuration/compilation#jscexternalhelpers)：js代码编译相关配置
* [minify](https://swc.rs/docs/configuration/minification)：是否压缩

```ts
import { transformSync } from '@swc/core'
import type { JscTarget } from '@swc/core'

export function transformCode(
  code: string,
  target: JscTarget = 'es5',
  minify = false
) {
  return transformSync(code, {
    jsc: {
      target
    },
    minify
  }).code
}
```

[minifySync](https://swc.rs/docs/usage/core#minify)直接对代码进行压缩处理。
* [compress参数](https://swc.rs/docs/configuration/minification#jscminifycompress)：可用于更细粒度的控制压缩策略
* [mangle参数](https://swc.rs/docs/configuration/minification#jscminifymangle)：细粒度的控制代码混淆策略

由于在HTML中的JS 代码可能会被后续的`script`所引用。所以关掉混淆策略，避免影响代码正常工作

**例如**
```ts
const hello = 'hello'
// 开启混淆后结果是
var l="hello";
```
```ts
import { minifySync } from '@swc/core'
import type { JsMinifyOptions } from '@swc/core'

export function minifyCode(code: string, ops?: JsMinifyOptions) {
  return minifySync(code, {
    compress: false,
    mangle: false,
    ...ops
  }).code
}
```
其它压缩相关的细节参数这里就不展开介绍了,可以看结合文档介绍和官方的[playground](https://swc.rs/playground)进行实践验证

## posthtml插件封装
这里就封装2个`posthtmlSWCMinify`和`posthtmlSWCTransform`2个方法，用于压缩和转换两个场景
```ts
export function posthtmlSWCTransform(
  target: JscTarget = 'es5',
  minify = false
) {
  return (tree: Node) => {
    tree.match({ tag: 'script' }, (node) => {
      if (node?.content?.[0]) {
        node.content[0] = transformCode(
          node.content[0].toString(),
          target,
          minify
        )
      }
      return node
    })
  }
}

export function posthtmlSWCMinify(ops?: JsMinifyOptions) {
  return (tree: Node) => {
    tree.match({ tag: 'script' }, (node) => {
      if (node?.content?.[0]) {
        node.content[0] = minifyCode(node.content[0].toString(), ops)
      }
      return node
    })
  }
}
```

使用示例如下
```ts
import posthtml from 'posthtml'

posthtml()
      .use(posthtmlSWCTransform())
      .process(htmlCode, { sync: true })

posthtml()
      .use(posthtmlSWCMinify())
      .process(htmlCode, { sync: true })
```

至此对`HTML`中inlineJS的提取与使用`SWC`处理的方法进行了较为详细的阐述，下面就是通过CLI组合能力，然后对外提供使用。

## CLI封装
通过封装一个简单的CLI工具，直接对目标HTML进行转换，调用起来更加的便捷，也方便的在现有工程中集成。

### 参数定义
使用`commander`做参数解析，先定义一下指令和传参，就2个指令`transform`和`minify`，只包含上述方法的基本的传入参数
```ts
#!/usr/bin/env node

import { Command } from 'commander'
import pkg from '../package.json'
import { minifyCommand, transformCommand } from './command'

const program = new Command()
program.version(pkg.version)

program
  .command('transform [paths...]')
  .description('transform inlineJS code ESVersion by SWC')
  .alias('t')
  .option(
    '-e, --ecmaVersion [ecmaVersion]',
    'set transform jsc target version',
    'es5'
  )
  .option('-m, --minify', 'minify transform result')
  .action(transformCommand)

program
  .command('minify [paths...]')
  .description('minify inlineJS code by SWC')
  .alias('m')
  .action(minifyCommand)

program.parse(process.argv)
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NjUzOTE5NjI2Ng==666539196266)

### 指令实现
下面是 `transformCommand` 的简单实现
* 使用`fs`模块读写文件内容
* 直接通过`posthtml`调用前面实现的`posthtmlSWCTransform`插件对内容进行转换

```ts
// transformCommand
import fs from 'fs'
import type { JscTarget } from '@swc/core'
import posthtml from 'posthtml'
import { posthtmlSWCTransform } from '../index'

interface Options {
  ecmaVersion?: JscTarget
  minify?: boolean
}

export default function transformCommand(filesArg: string[], options: Options) {
  for (const filepath of filesArg) {
    const content = fs.readFileSync(filepath, 'utf-8')
    const result = posthtml()
      .use(posthtmlSWCTransform(options.ecmaVersion || 'es5', !!options.minify))
      .process(content, { sync: true }).html
    fs.writeFileSync(filepath, result, 'utf-8')
  }
}
```
`minifyCommand`的实现是类似的这里就不再赘述。

### 效果
>安装 npm i -g @sugarat/inlinejs-transform

```sh
ijs minify __test__/test.html
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NjU0MTExNzIyMw==666541117223)

```sh
ijs transform __test__/test.html --minify
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NjU0MTE5Mjk3NQ==666541192975)
## 最后

文章中涉及示例代码以及工具完整源码见 [GitHub](https://github.com/ATQQ/tools/tree/main/packages/cli/inlinejs-transform)

如内容有误还请评论区斧正，读者有其它💡想法可评论&私信交流探讨。

