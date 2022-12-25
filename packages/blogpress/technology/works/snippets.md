---
title: 一个通过NPM包共(分)享代码块的解决方案
date: 2021-06-19
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# 一个通过NPM包共(分)享代码块的解决方案
## 前言

最近又看到了许多小伙伴更新了Vs Code设置代码块的实践教程，简单总结就是，[按规则](https://code.visualstudio.com/docs/editor/userdefinedsnippets)编写一个`code-snippets`文件即可：
* 项目级：将文件放在.vsode目录下
* 全局：首选项 -> 用户片段 -> 全局代码块

## 一些问题
此种方案我觉得仅能简单满足个人需要，但当个人需要编写大量snippet的时候，编写`code-snippets`配置文件比较麻

当然有大神做了[在线的snippet配置生成](https://snippet-generator.app/)的网站解决编写配置文件的繁琐，但也要复制粘贴。。

有没有不编写`code-snippets`配置文件也能加载自定义代码块的方式呢?有，当然有，后文会介绍到

但还有另一问题，比如你想把你的snippet分享给其它同事或者朋友，有如下一些方案:
* 拷贝code-snippets文件
* 编写snippet插件，发到插件市场
* 。。。

可以看出这些常规的方案有一丝繁琐，不便于分享与传播

## Share Snippets

大概三个月前我也写了篇文章简单介绍了这个插件出现的背景：[助你轻松编写与分享snippet的VsCode插件｜项目复盘](https://juejin.cn/post/6940258156232736798#heading-0)

大概就是，我来做插件的工作，你只负责编写简单的代码块配置文件

允许你以npm包的形式，将代码块的配置文件分享给全球开发者使用

但可能由于阅读量不高，目前下载体验的朋友也不多

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDEwODI4NzY0MQ==624108287641)

### 简介
支持通过npm的形式分享你的代码块

即支持**从node_modules中读取代码块的配置文件**，并在编辑器中注册

除了支持加载官方的`code-snippets配置`文件，为了简化书写，也定义了一个更加简单的`.snippets.json`文件配置方案

### 特色
* 简化配置，支持直接指定文件作为代码块
* 为HTML标签，Vue/React组件的代码块进行了定制，支持非常完善的属性提示

## 使用

当然是先装上插件

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDEwOTA4NDYxNg==624109084616)

tips：编写完新的代码块，如需立即生效，需手动执行 SP Refresh 命令

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDEwOTE2NDE2OQ==624109164169)

下面是编写配置文件的演示，插件提供了快速生成配置文件内容的代码块:

|  prefix  | 简介            |
| :------: | :-------------- |
| ss-file  | 模板文件代码块  |
|  ss-vue  | vue组件代码块   |
| ss-react | react组件代码块 |
|  ss-tag  | html标签代码块  |


一个配置文件，可以编写多个代码块

完整的[配置文件编写文档](https://github.com/ATQQ/ShareSnippet/blob/master/README.md)
### 指定文件内容作为代码块
这里以几个简单的vue3代码块为例：

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDExMTcwODU3OQ==ss-template.gif)

编写者只需要指定代码块`内容文件的相对路径`和`激活代码块的前缀`两项配置即可

### Vue组件的代码块
以一个默认的 `my-input` 组件进行演示示例

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDExMjM3MjM3NQ==ss-vue.gif)

支持完整的属性提示，支持以sp-开头展示组件的所有的可用属性

### React组件代码块
以一个默认的 `MyButton` 组件进行演示示例


![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDExMjg1ODQ5OQ==ss-react.gif)

## 总结
个人认为，此插件不仅可以帮助编写与分享代码块

也可用于业务开发中，公共业务组件添加一个`.snippets.json`配置，其它人使用的时候就能获得很友好的属性提示

## 最后
欢迎大家评论区交流，提出迭代意见

欢迎大家体验插件，提出宝贵的修改意见

* [插件源码](https://github.com/ATQQ/ShareSnippet)
* [插件体验](https://marketplace.visualstudio.com/items?itemName=sugar.snippet)


