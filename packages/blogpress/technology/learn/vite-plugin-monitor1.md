---
title: Vite插件开发纪实：vite-plugin-monitor（上）
date: 2021-09-27
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# Vite插件开发纪实：vite-plugin-monitor（上）

## 背景
最近在webpack项目里接入了Vite（dev mode），为开发提效。效果是真的猛。

项目启动速度提升70%-80%，HMR直接碾压webpack dev server

为了更加精准的计算收益，就需要将Vite启动相关的指标进行上报（启动时间，HMR，页面加载等等时间）

为此就要通过开发插件收集这些信息，然后通过埋点上报sdk上报到数据分析的平台

## 遇到的问题
通过查阅[官方文档](https://vitejs.dev/guide/api-plugin.html)并未找到相关的钩子直接获取到这些指标

但在开发的时候添加 `--debug`就能很详细的看到所有资源的处理时间，HMR，详细的启动时间等等

```json
{
    "scripts": {
        "dev": "vite --debug",
    }
}
```
```sh
npm run dev
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYzMjcyMjY1NzQxMQ==632722657411)

为此只能通过一些hack的手段获取这些指标了，下面将展开详细的介绍

## 期望
通过向目标工程引入插件，通过特定的回掉函数即可获取到`debug`模式下反馈的各种信息

## 准备工作
比较详细的介绍一下开发步骤

### 初始化工程
创建插件目录
```sh
mkdir vite-plugin-monitor

cd vite-plugin-monitor
```
初始化`pkg.json`

```sh
npm init -y
```

安装必要依赖
```sh
yarn add -D vite typescript @types/node rimraf
```

添加必要的两个指令`dev`,`build`，配置入口文件`dist/index.js`
```json
{
    "main": "dist/index.js",
    "scripts": {
        "dev": "tsc -w -p .",
        "build": "rimraf dist && tsc -p ."
    }
}
```
其中`dev`环境下添加了`-w(--watch)`参数，当文件有变动时，以便实时的进行更新


`rimraf`的作用是替代`rm -rf`指令，且是跨平台的，windows下同样生效

插件使用`typescript`开发，更有助于插件后续的维护

其中`build`直接使用`typescript`提供的默认`tsc`指令，对ts直接进行转换

根目录创建 `tsconfig.json` 内容如下
```json
{
    "compilerOptions": {
      "target": "es2015",
      "moduleResolution": "node",
      "strict": false,
      "declaration": true,
      "noUnusedLocals": true,
      "esModuleInterop": true,
      "outDir": "dist",
      "module": "commonjs",
      "lib": ["ESNext","DOM"],
      "sourceMap": true,
    },
    "include": ["./src"]
  }
```
在 `src` 目录下进行开发，里面存放我们的源码

### 目录结构
最终目录如下
```sh
├── package.json
├── src
|  ├── index.ts     # 插件入口
|  ├── types        
|  |  └── index.ts  # 类型定义
|  └── utils
|     └── index.ts  # 工具方法
├── tsconfig.json
```

### 简单插件示例
根据插件开发文档，在`src/index.ts`文件下编写如下简单的代码;
* name：标识插件的名称
* apply：标识插件在哪个时期工作(serve|build)，默认都会调用
* config：这个钩子接收原始用户配置（命令行选项指定的会与配置文件合并）和一个描述配置环境的变量
```ts
import type { Plugin } from 'vite';

export default function Monitor(): Plugin {
  return {
    name: 'vite-plugin-monitor',
    apply: 'serve',
    config(userConfig, env) {
      console.log(userConfig);
      console.log(env)
      // 可以做进一步的修改，会自动合入当前的配置
      // return
    },
  };
}
```
一个打印Vite配置的插件就搞定了，下面就是测试我们开发的插件

### 本地测试插件
首先是转换我们的`ts`=> `js` ，执行前面配置的指令`yarn dev`，就会看见生成了一个dist目录，里面有转换后的代码

接着执行`npm link`在全局生成一个软连接，指向当前项目
```sh
npm link
```

在一个vite项目里的执行`npm link vite-plugin-monitor`(monitor根据实际情况替换)，向目标项目加入此依赖
```sh
npm link vite-plugin-monitor
```

接着就可以在Vite项目的`vite.config.js`配置文件中加入我们的插件了
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginMonitor from 'vite-plugin-monitor'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vitePluginMonitor()
  ]
})
```
接着通过配置的指令启动`vite`，就能看到我们插件的打印的配置文件内容了

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMjc1NTgxNDM4Nw==632755814387)

由于是通过软连接的方式引入的插件，那么在插件工程里的任意更改都会实时生效，也就避免了频繁的执行`yarn add file:localProjectDir`

## 小结
本篇主要介绍了`monitor`插件开发的背景，要解决的问题，目标以及开发插件所需的一些列准备工作

[下一篇文章](./vite-plugin-monitor2.md)将详细介绍功能的实现

查看：[仓库源码](https://github.com/ATQQ/vite-plugin-monitor)

