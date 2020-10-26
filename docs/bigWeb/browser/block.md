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

## JS
TODO: 待完善


:::tip 参考
* [developers-关键路径渲染](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css)
:::
<comment/>
<tongji/>