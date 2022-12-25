---
sidebar:
 title: Chrome-DevTools的小技巧
 step: 9999
title: 分享小册《Chrome-DevTools的使用技巧》中的精华
date: 2021-05-17
tags:
 - 大前端
 - 浏览器
categories:
 - 大前端
---
# 分享小册《Chrome-DevTools的使用技巧》中的精华

## 前言
花了大概半天时间 温习了一遍（主要是忘了O(∩_∩)O哈哈~）[掘金小册：你不知道的 Chrome 调试技巧](https://juejin.cn/book/6844733783166418958)-> [开源免费版链接](https://www.frontendwingman.com/Chrome/)

和大家分享一些个人认为比较实用的内容，感兴趣的朋友推荐去阅读一下这本小册

## 查看详细Chrome版本信息
浏览器中输入[chrome://version/](chrome://version/)查看

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0MDM4NTEyMw==621240385123)

## 预设代码块
可以将一些高频使用的`工具脚本`代码块保存下来，下次使用可以直接调用

### 例如:查看掘金页面中已加载的文章
```js
{
    const posts = $$('.title-row>a');
    console.table(posts,['textContent','href']);
}
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0MjcyNjA4Mw==621242726083)

接下来复用这个代码块,在Source面板的 snippets中新建一个Snippet并将代码块写入

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc5ODI4Mzc2Nw==617798283767)

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0Mjk1MzAzMw==621242953033)

从今以后就可以直接command运行，通过指令运行 `!scriptName`即可执行脚本

tips: 默认打开Command会有一个 `>` 记得先删除

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0MzAyODY3Mg==621243028672)


## Command面板
快捷键 Ctrl + Shift + P

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0MTgxODMyMw==621241818324)

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0MTg0NzMxNA==621241847314)

### 截图

![](https://img.cdn.sugarat.top/mdImg/MTYxNzc5NzM3MzkzMg==617797373932)

* 页面截图: Capture full size screenshot
* 指定区域: Capture area screenshot
* 指定DOM节点: Capture node screenshot
* 当前屏幕: Capture screenshot

### 显示console时间戳

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0MjAxMzgwNQ==621242013805)

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0MjA0NDg0MA==621242044840)


## Console面板相关

### copy方法
有一个全局的`copy`方法，可以在console面板中**复制任何能够拿到的资源到剪贴板中**

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0MDc2NjkzMQ==621240766931)


### $符号
#### $number
$0 是对我们当前在 Element面板 中选中的 html 节点的引用

$1 是对上一次我们选择的节点的引用， $2 是对在那之前选择的节点的引用以此类推,直到 $4

![](https://img.cdn.sugarat.top/mdImg/MTYxNzc5OTMzNTA4MQ==617799335081)

#### $与$$
* $ 等价于 document.querySelector()
* \$$ 等价于 document.querySelectorAll()

![](https://img.cdn.sugarat.top/mdImg/MTYxNzc5OTUxNzIwNw==617799517207)

#### $_
上次打印结果的引用

![](https://img.cdn.sugarat.top/mdImg/MTYxNzc5OTc2NjQ4Ng==617799766486)

### console.table

可以将 数组 (或者是 类数组 的对象)打印成一个漂亮的表格

在需要使用`console.log(arrData)`查看数据时，换成`console.table(arrData,columns)`，不妨会更直观一些

第二个参数指定要展示的列

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0MTQzNzg0NQ==621241437845)

### time与timeEnd
`console.time`与`console.timeEnd`，两个方法配合计算并打印时间戳

通常用于测试方法的执行时间

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTI0MTY3NDgxNg==621241674816)

## Network面板

### Filter

用于过滤请求

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzgwNDk3NzgyNg==617804977826)

通过 `-` 查看所有筛选条件

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzgwNTA3MDc3Ng==617805070776)

### 自定义请求表中展示的项

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTIxODY5Mzc4Mw==621218693783)

### 重新发送请求

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTIxODc3NTE2MQ==621218775161)

## Drawer

`ESC`控制打开/关闭Drawer

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTIyMDg1NTk2NQ==621220855965)

所有的功能选项

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTIyMDk3MDc4NQ==621220970786)

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTIyMDkxOTIxNg==621220919216)

### 查看更改Change
在Element面板中更改元素的样式可以在这直接查看

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTIyNDQxMjE4OQ==621224412189)

