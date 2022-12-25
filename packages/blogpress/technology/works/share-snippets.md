---
title: 助你轻松编写与分享snippet的VsCode插件
date: 2021-03-16
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# 助你轻松编写与分享snippet的VsCode插件

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNTg5OTg3Njc4OA==615899876788)

## 前言
分享你的代码片段通过npm包的形式，让其它的开发者都能够一键体验

**我**来搞定插件，**你**来编写snippet提示规则

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNTkwMDE3NDcwMw==615900174703)

先给各位哥哥姐姐奉上插件相关链接
* [仓库地址](https://github.com/ATQQ/ShareSnippet)
* [插件:Share Snippets](https://marketplace.visualstudio.com/items?itemName=sugar.snippet)

老规矩,先给大家简单说说这个是干嘛的,有什么用

### 效果
![](https://img.cdn.sugarat.top/images/snippet/snippet1.gif)

**助你简单快速编写模板代码的snippet**

**助你简单快速编写组件代码的snippet**

**助你一键在项目中引入别人的snippet**

**帮助团队沉淀各种snippet**

### 如何使用
只需要3步

1. 安装上述插件
2. 按照[文档](https://github.com/ATQQ/ShareSnippet/blob/master/README.md#%E5%8A%9F%E8%83%BD)简单编写一个以 **.snippets.json**结尾的snippet文件在项目中的任意位置(包括node_modules)
3. 重启vscode或者F1输入Refresh命令即可

下面给大家详细讲讲为什么做这个

## 背景
日常页面开发中,经常会编写组件/页面

对于没有**snippet**的代码文件常规操作:
1. Ctrl+C
2. Ctrl+V
3. 删除不需要的代码
4. 编写新的代码

所以snippet在日常开发中是最常见的提效工具之一

可以说人人的Vs Code中都装了不少snippet相关的插件

## 现有的问题

### 问题1
一般的大一点的开源组件库都提供了snippet插件,供开发者直接使用

而一些没有提供snippet插件的UI框架/库 只能由开发者去翻看文档,复制粘贴 示例/属性

当复制粘贴次数多了,统计下来,难免确实会浪费一些时间

### 问题2
在日常开发中一般都避免不开编写各种业务组件,现在又推行的是组件化

项目一般又是多人并行开发,任务一般会按组件粒度进行工作分配

当某些公共业务组件需要被其它成员使用的时候,有文档的前提下,第一时间会去看文档,如果没有文档,那么会有如下常规操作:
1. 翻看其它同事如何调用的,复制粘贴过来使用看看
2. 翻看业务组件的源码或者类型定义,看看暴露了哪些props
3. 如果组件是纯js又没有注释/文档,那么就得挨个尝试一下才保险

这种情况会增加项目的时间成本

### 问题3
对于一些做了很多自定义工作的特殊框架项目,页面的模板通常无法使用现有的snippet

如果框架在不断迭代,又是由多个可单独使用的模块构成

通过编写snippet插件的话,插件使用者需要主动更新插件,才能获取最新的snippet提示

如果只是用了框架的某一部分内容,可能插件提供的snippet会太多了,输入一个前缀会出现很多的snippet

## 我的解决方案
### 前期调研
通过调研,发现编写snippet的规则非常简单,能够1分钟就上手

而编写vs code插件学习成本可能稍微大一点

官方提供的snippet规则只支持.vscode目录或者本地编辑器全局使用

不太方便其它人使用你的规则

官方推荐的就是**想分享自己的snippet给其它人使用,那就编写个snippet插件**

### 最终方案
想到这里脑瓜子突然灵光一闪,插件学习成本既然高,那么**我来学习插件开发,其它人只需学习编写snippet的配置文件**

其它人要使用的话**只需要装一个插件**,然后将snippet配置文件通过npm包的形式发到npm仓库去

使用者只需要一条指令就在项目中引入了snippet

对于UI框架开发者来说也只需要,在自己的依赖中加入对于的snippet包,只要用户装了这个插件那么就能享受其snippet

接着调研了一晚,发现没有现成的类似插件,机会来了,花了大概一周时间学习与开发

这个插件就问世了: [Share Snippets](https://marketplace.visualstudio.com/items?itemName=sugar.snippet)

## 总结思考
轮子永远造不完,没有一劳永逸的插件,希望各位提出宝贵的意见来帮助完善

善于留心开发中遇到的非技术问题,如果浪费了你的时间,调研一下有不有什么工具能帮助节约这部分时间

如果没有咱就撸一个,帮助自己也帮助它人节约此部分时间

## 其它
* 插件目前还没有logo,希望对插件感兴趣的朋友赶紧pr个logo来嘿嘿

>[本文](https://juejin.cn/post/6940258156232736798)正在参与「掘金 2021 春招闯关活动」, 点击查看 [活动详情](https://juejin.cn/post/6939329638506168334)

