---
title: Chrome调试技巧-基础
date: 2021-04-07
tags:
 - 技术笔记
 - 学习笔记
categories:
 - 技术笔记
---
# Chrome 调试技巧-基础

## Chrome简介
1. [维基百科(中)](https://zh.wikipedia.org/wiki/Google_Chrome)
2. [维基百科(英)](https://en.wikipedia.org/wiki/Google_Chrome)

todo: 摘抄一小段有意思的内容

## [Chrome Devtools](https://developer.chrome.com/docs/devtools/)
TODO: 开一个专题,详细介绍各个面板的使用方法与场景

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc3OTczNTY1NQ==617779735655)

开发调试前端应用必备

* 打开快捷键
  * F12 
  * Windows: `Ctrl` + `Shift` + `I`  
  * Mac: `Cmd` + `Opt` + `I`

## 面板简介
1. Element - 元素面板
2. Console - 控制台面板
3. Network - 网络面板
4. Application - 应用面板
5. Performance - 性能面板
6. Sources - 源代码面板
7. Memory - 内存面板
8. Security - 安全面板
9. Lighthouse - 生成一个有关页面性能的报告工具

### Element
元素面板可以自由的操作页面 DOM 和 CSS,所写即所得

* 检查和调整页面
* 样式修改
* DOM
  * 修改
  * 监听变动
  * 操纵绑定的事件
  * 查看参数
* ...

### Console
使用控制台面板记录诊断信息,查看console内容

* 可以用于直接执行JS
* 命令交互
* console调试大法
* ...

### Network
使用网络面板可以了解请求和下载的资源文件的概况

* 用于优化网页加载性能
* 了解资源加载时间轴
* 网络流量/带宽使用情况
* ...

### Application
应用面板可以检查加载的所有资源

包括:
* IndexedDB 与 Web SQL 数据库
* 本地和会话存储,cookie
* 应用程序缓存
* 图像,字体,样式表,脚本等等
* ...

### Performance
记录和查看网站生命周期内发生的各种事件

* 性能检测
* 帮助优化网页性能
* ...

### Source
可以使用源代码面板来断点调试js代码

* 断点调试
* ...

### Memory
* 跟踪内存泄漏
* JavaScript CPU 分析器
* 内存堆区分析器
* ...

### Security
* 证书问题
* 安全相关问题

### Lighthouse
检测网页性能的插件工具

## Chrome版本
### 查看当前版本

在地址栏输入: 
* **chrome://help**
* **chrome://version**: 更加详细的查看

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc4MzYzNTA5MQ==617783635091)

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc4MzU5Mzk1MQ==617783593951)

## 有趣的功能地址
### dino 小游戏
**chrome://dino/**

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc4NDIyNTE5Mw==617784225193)

### 查看实验中的功能
**chrome://flags/**

这里有很多正在试验中的功能,可以通过这个面板来选择启动/禁用相对应的功能

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc4NDMxNjI0Mg==617784316242)

### 查看所有功能

**chrome://chrome-urls/**

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc4NDQyMzM0NQ==617784423345)


## 全局方法 copy(...)

可以`copy`方法在 **console 面板** 中复制任何能拿到的资源到`剪贴板`中

例如:
```js
copy(location)

copy(document.title)

copy(document.querySelector(selector).innerHTML)
```

## Store as global
![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc4NTAyODUwMA==617785028500)

可以将目标变量存储为一个全局变量 tempX

在不影响它原来值的情况下,可以用这些值做一些测试操作

## 保存堆栈信息

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc4NTIzODczNQ==617785238735)

右键错误信息,即可将其存储为日志文件

## 一些快键键
1. ctrl + shift + D : 切换 DevTools 窗口布局 (来回切换最近使用两种布局方案)
2. ctrl + [ 和 ctrl + ] : 左右切换 DevTools 的面板
3. ctrl + number: 按照顺序切换DevTools面板

:::warning
第3组快捷键默认是禁用状态。需要手动打开:
:::

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc4NjAwMDMwOA==617786000308)

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc4NjAyMTIyNw==617786021227)


其余所有快捷键

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc4NzU5OTQ0Mg==617787599442)


## Command Menu
快捷键 Ctrl + Shift + P

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc5NzE0NzA3Nw==617797147077)

提供了很多实用功能

### 截图

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc5NzM3MzkzMg==617797373932)
* 页面截图: Capture full size screenshot
* 指定区域: Capture area screenshot
* 指定DOM节点: Capture node screenshot
* 当前屏幕: Capture screenshot

### 主题切换

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc5Nzc2MjYwOA==617797762608)

## 预设代码块
通过预设脚本,将在console面板中高频使用的代码块保存下来

如:统计页面中的中文数量

```js
console.log(document.body.textContent.replace(/[^\u4e00-\u9fa5]/g,'').length)
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc5ODIxNzkxMQ==617798217911)

接下来复用这个代码块,在Source面板的 snippets中新建一个Snippet并将代码块写入

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc5ODI4Mzc2Nw==617798283767)

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc5ODM3NjczMg==617798376732)

接下来通过指令运行 `!scriptName`即可执行脚本

tips: 默认打开Command会有一个 `>` 记得先删除

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNzc5ODUyMzQ3Ng==617798523476)

这个用来写 **一键评教** 脚本贼方便

