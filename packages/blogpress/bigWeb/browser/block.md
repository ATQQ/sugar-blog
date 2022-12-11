---
sidebar:
 title: 阻塞渲染
 step: 2
isTimeLine: true
title: 浏览器-阻塞
date: 2020-10-27
tags:
 - 大前端
 - 浏览器
categories:
 - 大前端
---
# 阻塞
## CSS
### 1. 阻塞渲染

**阻塞渲染，仅是指浏览器是否需要暂停网页的首次渲染，直至该资源准备就绪**

CSS 被视为阻塞渲染的资源，这意味着浏览器将不会渲染任何已处理的内容，直至 CSSOM 构建完毕

举例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 外网资源，无梯子无法访问 -->
    <link rel="stylesheet" href="https://www.youtube.com/s/player/4a1799bd/www-player-webp.css">
    <link rel="stylesheet" href="./1.css">
    <title>Document</title>
</head>
<body>
    <h1>content</h1>
</body>
</html>
```
1.css
```css
h1{
    color: red;
}
```

在外网样式资源下载完成前，页面将会处于白屏现象

如阻塞渲染的样式资源下载超时报错，则会跳过，会使用已经下载完成的CSS资源做解析构建CSSOM

所以在等待一段时间后（资源下载超时后）页面才会显示出来

### 2. 阻塞html解析

举例
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>red1</h1>
    <link rel="stylesheet" href="https://www.youtube.com/s/player/4a1799bd/www-player-webp.css">
    <h1>red2</h1>
</body>
</html>
```

可以看到页面依旧处于白屏状态，此时在开发者工具中，可查看到Dom树中`link`节点后的`h1` 节点并未被解析出来

点击浏览器的停止加载按钮，`red1`内容会被渲染出来，此时查看Dom树，发现是没有`<h1>red2</h1>`这个节点的

当资源下载失败时，`<h1>red2</h1>` 才会被解析到，然后渲染出来


### 3. 如何解除阻塞
在渲染树构建中，要求同时具有 DOM 树和 CSSOM树 才能进行构建,任何一个🌲构建过程中出现阻塞，会导致页面显示异常，导致出现严重的性能问题

**HTML 和 CSS 都是阻塞渲染的资源**
  
* HTML 显然是必需的，因为如果没有 DOM，我们就没有可渲染的内容
* CSS 的必要性就不一定
  * **浏览器会下载所有 CSS 资源，无论阻塞还是不阻塞**
  * CSS 是阻塞渲染的资源。需要将它尽早、尽快地下载到客户端，以便缩短首次渲染的时间

**通过`媒体类型`或`媒体查询`可以将一些 CSS 资源标记为不阻塞渲染的资源**

如果我们有一些 CSS 样式只在特定条件下（例如显示网页或将网页投影到大型显示器上时）使用,我们可以通过 CSS“媒体类型”或“媒体查询”来解决这类用例

```html
<!-- 适用于所有情况，始终阻塞渲染 -->
<link href="style.css" rel="stylesheet">

<!-- 只在打印内容时适用，网页首次加载时 -->
<!-- 该样式表不需要阻塞渲染 -->
<link href="print.css" rel="stylesheet" media="print">

<!-- 由浏览器执行的“媒体查询”：符合条件时-->
<!-- 浏览器将阻塞渲染，直至样式表下载并处理完毕-->
<!-- (页面首次加载时，如果不满足条件，不会阻塞渲染，但依旧会请求下载对应的资源) -->
<link href="other.css" rel="stylesheet" media="(max-width: 400px)">
```

通过使用媒体查询，我们可以根据特定用例（比如显示或打印），也可以根据动态情况（比如屏幕方向变化、尺寸调整事件等）定制外观
```html
<!-- 阻塞渲染，适用于所有情况 -->
<link href="style.css"    rel="stylesheet">

<!-- 默认all，等价于不写 -->
<link href="style.css"    rel="stylesheet" media="all">

<!-- 具有动态媒体查询，将在网页加载时计算 -->
<!-- 根据网页加载时设备的方向，portrait(纵向-高度大于宽度).css 可能阻塞渲染，也可能不阻塞渲染 -->
<link href="portrait.css" rel="stylesheet" media="orientation:portrait">

<!-- 只在打印网页时应用，因此网页首次在浏览器中加载时，它不会阻塞渲染 -->
<link href="print.css"    rel="stylesheet" media="print">
```

利用媒体查询解决上面的问题:
* 只在加载时当屏幕宽度`<=400px`时才阻塞,其它情况不阻塞渲染

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 外网资源，无梯子无法访问 -->
    <link rel="stylesheet" href="https://www.youtube.com/s/player/4a1799bd/www-player-webp.css" media="(max-width: 400px)">
    <link rel="stylesheet" href="./1.css">
    <title>Document</title>
</head>
<body>
    <h1>content</h1>
</body>
</html>
```

### 4. 小结
* CSS 是阻塞渲染的资源，在CSSOM构建完毕之前浏览器将不会渲染任何已处理的内容
* 利用**媒体类型** 或 **媒体查询**来解除对渲染的阻塞
* 浏览器会下载所有 CSS 资源，无论阻塞还是不阻塞

## JS
### 1. 阻塞渲染
JavaScript 可以查询和修改 DOM 与 CSSOM

所以当 HTML 解析器遇到一个 script 标记时，它会暂停构建 DOM，将控制权移交给 JS 引擎，等 JS 引擎运行完毕，浏览器会从中断的地方恢复 DOM 构建

**内联脚本阻塞渲染示例**
* 刚加载时页面白屏，5秒后才会渲染出内容
* 说明内联js会阻塞DOM解析和渲染

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>AAA</h1>
    <script>
        let d = Date.now()
        while (Date.now() < d + 1000 * 5) { }
    </script>
    <h2>BBB</h2>
</body>

</html>
```

**外联同步脚本阻塞渲染示例**
* 可以看到会先渲染出 `AAA`,5 s 后才渲染出 `BBB`
* 说明外联脚本也会阻塞DOM解析与渲染，但是因为无法确定脚本中的内容，所以会优先渲染一次已经构建DOM，确保加载的脚本能取得最新的DOM

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>AAA</h1>
    <script src="./test.js"></script>
    <h2>BBB</h2>
</body>

</html>
```

test.js
```js
let d = Date.now()
while (Date.now() < d + 1000 * 5) { }
```

### 2. 解除阻塞
将 JavaScript 脚本显式声明为异步，即可防止其阻塞DOM构建与渲染

向 script 标记添加异步关键字可以指示浏览器在等待脚本可用期间不阻止 DOM 构建
* defer：异步进行下载，然后等待 HTML 解析完成后（DOM完成构建）按照下载顺序进行执行
* async：异步进行下载,下载完成后会立即执行，执行时仍然会阻塞

**defer使用示例**
* 5 s 后可以看到渲染出`AAA`和`BBB`
* 又经过 5 s后控制台打印 `render success`,`render success2`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>AAA</h1>
    <script defer src="./test.js"></script>
    <script defer src="./tes2.js"></script>
    <script>
        let k = Date.now()
        while (Date.now() < k + 1000 * 5) { }
    </script>
    <h1>BBB</h1>
</body>
</html>
```
test.js
```js
let d = Date.now()
while (Date.now() < d + 1000 * 5) { }
console.log('render success');
```

tes2.js
```js
console.log('render success2');
```

**async使用示例**
* 4 s 后可以看到渲染出`AAA`
* 又经过 4 s后渲染出`BBB`
* 然后控制台打印 `render success`,

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>AAA</h1>
    <script async src="./test.js"></script>
    <script>
        let k = Date.now()
        while (Date.now() < k + 1000 * 4) { }
    </script>
    <h1>BBB</h1>
</body>
</html>
```
test.js
```js
let d = Date.now()
while (Date.now() < d + 1000 * 4) { }
console.log('render success');
```

### 3. 小结
**无论是内联还是外联，js脚本会阻塞DOM的解析与渲染**但
* 外联：因为无法确定外联脚本中的内容，所以会优先渲染一次已经构建DOM，确保加载的脚本能取得最新的DOM


将 JavaScript 脚本显式声明为异步，即可防止其阻塞DOM构建与渲染

在 script 标签中添加异步关键字即可指示浏览器在等待脚本下载期间不阻止 DOM 构建

**异步关键字**
* defer：异步进行下载，然后等待 HTML 解析完成后（DOM完成构建）按照下载顺序进行执行
 * async：异步进行下载,下载完成后会立即执行，执行时仍然会阻塞

## 总结
1. JS 与 CSS 都是阻塞页面渲染的资源
2. 可以通过媒体查询解除解决CSS在特定场景阻塞的问题
3. 可通过为script添加异步属性来防止阻塞

**补充：** CSS 其实可以通过打包工具转化成js，在页面加载时，通过异步加载js资源，然后应用样式。这也是可以防止css阻塞渲染的一种方式

:::tip 参考
* [developers-关键路径渲染](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css)
:::
