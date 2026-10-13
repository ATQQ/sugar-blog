---
tag: [AI,ComfyUI]
description: 使用UP主秋葉 提供的整合包，开箱即用。同时介绍如何通过本地Agent 配合完成模型下载，环境配置，搭建工作流等。
---
# Windows 搭建 ComfyUI 环境 | 小白也能直接上手

*当然需要自备合适的电脑 O(∩_∩)O嘿嘿~*

废话不多了，直接开始！

## 下载整合包

笔者这里使用的是 [B站UP主秋葉aaaki](https://space.bilibili.com/12566101) 提供的整合包

资源可以在[动态：ComfyUI整合包更新](https://www.bilibili.com/opus/1233418589167419397)里翻到。

大佬的 GitHub：https://github.com/Akegarasu

![](https://cdn.upyun.sugarat.top/mdImg/sugar/46ef807432d610bf3b68ab8c1db0a68b)

*二次元头像，不多说强的离谱了*

![](https://cdn.upyun.sugarat.top/mdImg/sugar/ae2cbdb08b1e50c2a5766ab8c8eff9ab)

酷酷的下载就行。

## 安装

*纯傻瓜式了！* 只需两步

1 解压 

![](https://cdn.upyun.sugarat.top/mdImg/sugar/6a5df829dac96b2094ed3fb35c895268)

2 双击打开

![](https://cdn.upyun.sugarat.top/mdImg/sugar/ad31f54827eb6e6e263c725764dea4b0)

## 启动

一键启动
![](https://cdn.upyun.sugarat.top/mdImg/sugar/21d301cc3e2dc2fa31a6b324e77d98ac)

然后界面就出来了，浏览器会自动打开 `http://127.0.0.1:8188`

![](https://cdn.upyun.sugarat.top/mdImg/sugar/34f1857750e82fc90bd1a0e10b425508)

预设了许多模板，可以直接使用，但是模型需要自己下载。

接下来交给 AI 就行。

## 使用

*此部分笔者全交给WorkBuddy了。* 给大家放记录和截图

将刚刚存放comfyui整合包的文件夹，直接导入WorkBuddy 打开。

笔者的几个对话记录：
1. 首次配置：https://workbuddy.link/p/Gl2e58D0wDNtNITGps1owo?ext2=copy_link
2. 新模型下载：https://workbuddy.link/p/euAW51C5euYc1wckM9dC2w?ext2=copy_link

### 下载与配置模型

![](https://cdn.upyun.sugarat.top/mdImg/sugar/ea2554ea0bb9986d201bbcd5a5f1c76b)

![](https://cdn.upyun.sugarat.top/mdImg/sugar/0f459384fbe5736e9cf80c0719381945)

![](https://cdn.upyun.sugarat.top/mdImg/sugar/e71d7a808f606918d0f3b2bcea6f6ad2)

下载近期出的 qwen-image-2.1-turbo

![](https://cdn.upyun.sugarat.top/mdImg/sugar/54b0eb5d04ccd9c1cd7f1ea9aeaf2ad6)

### 工作流

需要什么工作流直接告知 Agent ，让它帮你搭建就行，文生图，图生图，图生视频之类的。

搭好在工作栏里直接选择。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/762d4e6fcf923b60808f57f417b96fa7)

修改提示词点击生成即可

![](https://cdn.upyun.sugarat.top/mdImg/sugar/de6391ec0c6134cb10a57b0308699afe)

你甚至也可以不用操作界面，让 WorkBuddy 通过API 自己完成工作流搭建和执行，最后你直接看结果也是可以的。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/1e877881587cd31dab841ffbbe7c2d4f)

## 最后
如果过程有任何问题，可以直接复制报错或者截图给到 workbuddy 解决。

深入了解使用的话可以去 B站上找相关教程，会给你介绍其每个模块的功能与作用。

ComfyUI 官方仓库：https://github.com/comfy-org/comfyui