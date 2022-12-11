---
title: 模板工程搭建：Vue-Cli搭建Vue3/TS/uni-app小程序工程(上)
date: 2021-06-22
tags:
 - 技术笔记
 - 工程模板
categories:
 - 技术笔记
---
# 模板工程搭建：Vue-Cli搭建Vue3/TS/uni-app小程序工程(上)

## 前言

通过vue-cli创建的项目，更易维护，可以使用非HbuilderX编辑器进行编码，通过终端直接执行编译命令

HbuilderX没有Linux版本（不含wine），但有大神移植了linux版本下的微信开发工具:
* [cytle/wechat_web_devtools](https://github.com/cytle/wechat_web_devtools)
* [dragonation/wechat-devtools](https://github.com/dragonation/wechat-devtools)

因此linux环境下可以使用

这样三种常见操作系统都可以正常的进行开发调试

## 初始化项目模板
使用uni-app官方提供的vue3基础模板

### 安装vue-cli
```sh
npm install -g @vue/cli
```
### 初始化vue3工程 
```sh
vue create -p dcloudio/uni-preset-vue#vue3 uni-vue3-ts-template
```

赖心等待一会儿，即会出现如下选择

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDM2NTIzMjc2MA==624365232760)

这里选择TS版本

此时还会出现一个选择`@dcloudio/uni-mp-360`的选项，选择第一个（最新的版本）即可

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDM2NTM3MDMwMQ==624365370301)

等待一会儿就初始化完毕了，目录结构如下

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDM2NjE1MDY4MA==624366150680)

### 基础模板
包含`jest`，`babel`，`postcss`，`typescript`等基本配置文件

咱先运行试试：
```sh
yarn install
```

小程序模板还是使用的webpack构建
### 运行到微信端
```sh
# dev
yarn dev:mp-weixin

# prod
yarn build:mp-weixin
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDM2NjcxODY5MQ==624366718691)

开发启动速度比使用HbuilderX启动项目要快不少

然后将编译结果`dist/dev/mp-weixin`导入微信开发者工具即可运行

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDM3MDAwMjk4NQ==624370002985)


## Sass支持
模板默认是没有支持Sass的

安装`sass-loader`与`node-sass`,需要指定版本，版本高了无法运行
```sh
yarn add sass-loader@10.0.1 node-sass@4 --dev
```
## compiler-sfc
emm 经过实验，目前编译到小程序端 还不支持，后续观望一下

## Vant UI
### 微信小程序
开发微信小程序则选用[Vant Weapp](https://vant-contrib.gitee.io/vant-weapp/#/home)
```sh
yarn add @vant/weapp
```

在 src目录下创建 wxcomponents 文件夹

拷贝`node_modules/@vant` 到 wxcomponents中

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDM3NjI0ODcyMg==624376248723)

`src/App.vue`中引入样式文件
```html
<style>
    /*每个页面公共css */
    /* vant - weapp */
    @import '/wxcomponents/@vant/weapp/dist/common/index.wxss';
</style>
```


在`src/pages.json`中全局注册引用的组件
```json
{
	"globalStyle": {
		"usingComponents": {
			"van-button": "/wxcomponents/@vant/weapp/dist/button/index"
		}
	}
}
```

使用
```html
 <van-button type="primary">测试</van-button>
```

效果

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDM3NjU4NTkwNg==624376585906)

## 未完待续
* eslint
* vuex
* axios
* 。。。and more
## 资料汇总
* [uni-vue3-ts：模板仓库](https://github.com/ATQQ/uni-vue3-ts-template)
* [uni-app 项目小程序端、H5 端支持 vue3 介绍](https://ask.dcloud.net.cn/article/37834)

