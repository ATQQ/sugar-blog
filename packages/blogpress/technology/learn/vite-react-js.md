---
title: 解决Vite-React项目中js使用jsx语法报错的问题
date: 2021-10-12
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 解决Vite-React项目中js使用jsx语法报错的问题

## 背景
在做存量项目接入Vite测试时发现，存量（老）项目中很多是直接在js中书写jsx语法，使用Vite启动时就会抛出一堆问题`Failed to parse source`。

不嫌麻烦可以跑个脚本**批量修改文件类型，这是一个解决办法**。

为了刨根知底，同时为了存量项目最低成本的接入Vite使用，尽力避免修改业务代码。得寻找其它办法解决一下。

报错截图如下

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDAxNjYxMzEyNg==634016613126)

## 复现问题

初始化demo项目
```sh
# npm 6.x
npm init vite@latest my-react-app --template react-ts

# npm 7+, extra double-dash is needed:
npm init vite@latest my-react-app -- --template react-ts

# yarn
yarn create vite my-react-app --template react-ts
```

目录如下
```sh
├── index.html
├── package.json
├── src
|  ├── App.css
|  ├── App.tsx
|  ├── favicon.svg
|  ├── index.css
|  ├── logo.svg
|  ├── main.tsx
|  └── vite-env.d.ts
├── tsconfig.json
└── vite.config.ts
```
启动
```sh
npm run dev
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDAxNTk3NjAwNQ==634015976005)

页面正常，接下来将`App.tsx`修改为`App.js`

将会得到上述的报错

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDAxNjA0ODYwMw==634016048603)

## 原因
1. Vite在启动时会做[依赖的预构建](https://cn.vitejs.dev/guide/dep-pre-bundling.html#the-why)
2. `预构建`，`运行时`默认都只会对`jsx`与`tsx`做语法转换。不会对js做jsx的语法转换。

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDAxNjg3ODYwMg==634016878602)

## 解决方案
1. 修改依赖预构建的配置
2. 使用babel插件`@babel/plugin-transform-react-jsx`，让Vite在运行时对js文件转换

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDAxNzQyNDM2Mg==634017424362)

按照文档描述在配置文件添加一点配置
```js
export default defineConfig({
  build:{
    rollupOptions:{
      input:[]
    }
  },
  optimizeDeps: {
    entries: [],
  },
})
```

通过阅读`@vite/plugin-react`的[文档](https://github.com/vitejs/vite/tree/main/packages/plugin-react),发现其支持传入babel插件

```sh
npm i @babel/plugin-transform-react-jsx
```

添加插件
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
      babel: {
        plugins: ['@babel/plugin-transform-react-jsx'],
      },
  })],
})
```

再次启动验证,发现一个报错

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDAxNzg4NjY4OQ==634017886689)

原因是没有在App.js中引入`React`,咱们引入一下
```js
import React,{ useState } from 'react'
```
大功告成

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDAxODAxNTMxMw==634018015313)


## 总结
两种处理方案
1. 文件后缀 js => jsx
2. 修改依赖预构建配置，再添加babel插件`@babel/plugin-transform-react-jsx`

第二种方法会一定程度影响项目的启动速度。读者可以根据实际项目情况pick方案

## 最后
欢迎大家在评论区共享/交流在开发过程中接入Vite时遇到的一些问题与总结的经验

* [源码地址](https://github.com/ATQQ/demos/tree/main/vite-react-js)

