# HTML中的InlineJS处理

> 本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

本文简单介绍一下当前`html`在现代工程中的现状，并阐述可能存在的一些存在的问题，`通过CLI工具可以怎样解决`。

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

针对上面2种情况产生的`JS`代码，`部分情况下`是没有通过`babel`进行编译的，可能存在一些质量问题（兼容性问题为主）。

如果只是`ES语法检查`，可以用前面文章介绍的[增强ESCheck工具](https://juejin.cn/post/7148618887787970597)进行检测。

本文将进一步介绍一下提取`HTML inline Code`的多种方法，然后对其进行`压缩`，`混淆`，`ES语法降级`等等。

## Script内容提取与替换
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

局限性就是无法区分出注释，字符串的值，勉强可用.

### GoGoCode
>GoGoCode 是一个基于 AST 的 JavaScript/Typescript/HTML 代码转换工具，API是jQuery风格，API还是很简洁好用

其中`HTML`的解析使用的是[hyntax-yx](https://www.npmjs.com/package/hyntax-yx)看上去是 fork[hyntax](https://www.npmjs.com/package/hyntax)重新发了个版

用`GoGoCode`同样可以很简单的实现

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


## InlineCode处理

### ES语法降级
### 压缩

## CLI实现
### 定参数

### 组装功能逻辑

## 最后
