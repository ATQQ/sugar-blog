---
title: 做一个CL版的时间管理工具（13）
date: 2021-08-16
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（13）

## 前言
在前一篇文章中加入了一个启动Web服务的指令`timec page`

本期就继续完善这个指令的效果
## 本期效果预览

## 功能开发
### Web侧
拟采用Vue3开发页面

安装项目依赖
```sh
yarn add vue@next @vue/compiler-sfc @vitejs/plugin-vue
```
快速创建一个基于Vite+Vue3的模板项目
```sh
npm init vite@latest my-vue-app --template vue
```

完成后的目录结构如下
```sh
my-vue-app
├── index.html
├── package.json
├── public
|  └── favicon.ico
├── src
|  ├── App.vue
|  ├── assets
|  ├── components
|  └── main.js
└── vite.config.js
```
我们将`vite.config.js`,`main.js`,`components`,`App.vue`,`index.html`这五部分的内容拷贝到我们项目的`src/page`目录下

拷贝完后的目录如下
```sh
├── App.vue
├── assets
|  └── logo.png
├── components
|  └── HelloWorld.vue
├── index.html
├── main.js
└── vite.config.js
```
接着改造一下`timec page`指令中的逻辑:
* 定位到`vite.config.js`文件的位置
* 使用`--config`指定配置文件的位置
* 在`spawn`调用的方法中传入设置配置文件的参数

```js
const cwd = path.resolve(__dirname, '../');
const viteConfigPath = path.join(cwd, 'src/page/vite.config.js');
const serveService = spawn('node_modules/.bin/vite', ['src/page', '--host', '--config', viteConfigPath], {
  cwd,
  stdio: 'inherit',
});
// 。。。code
```
到这一步前端工程的基本内容算搭好了，页面展示需要的数据，需通过Node相关的API才能获取，这里有两种方案：
1. 页面使用SSR（服务端渲染）方案
2. 添加一个后端服务，通过接口调用传递所需要的数据

项目采用第二种方案，下面展开介绍一下简单后端服务的搭建

### 服务端
这里使用自己DIY的玩具框架`flash-wolves`

安装依赖
```sh
yarn add flash-wolves
```
编写基本调用逻辑,在src/page下创建一个文件`server.js`
* 使用`Node`执行这3行代码，这样一个简单的后端服务就在3001端口启动了
```js
const { Fw } = require('flash-wolves');
const app = new Fw();
app.listen(3001);
```

编写2个接口：
1. 获取配置文件
2. 获取所有的数据（按天区分）

```js
app.get('/json', (req, res) => {
  const config = getConfig();
  const { recordFilepath } = config;
  if (fs.existsSync(recordFilepath)) {
    res.success(getJSON(getFileContent(recordFilepath)));
    return;
  }
  res.fail(500, 'not set default recordFilepath');
});

app.get('/config', (req, res) => {
  const config = getConfig();
  res.success(config);
});
```

**在什么时候启动这个服务？**

当然是和启动Web服务的时候一起启动

这就需要我们在`timec page`指令中添加启动后端服务的逻辑:
1. 同样使用`spawn`创建子进程启动后端服务
2. 在客户端服务关闭的时候，杀死这个后端服务的子进程
```js
const server = spawn('node', ['src/page/server.js'], {
  cwd,
  stdio: 'inherit',
});
serveService.on('close', (code) => {
  server.kill('SIGSTOP');
  process.exit(code);
});
```

**客户端如何访问这些接口？**：
1. 为了降低项目复杂性，这里直接调用fetch方法获取后端接口的数据
2. 单独建立一个文件`src/page/api.js`存放这些逻辑

```js
export function getConfig() {
  return fetch('http://localhost:3000/config');
}

export function getEveryDayData() {
  return fetch('http://localhost:3001/json').then((res) => res.json());
}
```

由于Web会受同源策略限制，这里在`Fw`实例化函数里加入以下逻辑开启CORS，解决跨域问题
```js
const app = new Fw((req, res) => {
  // 开启CORS
  const { method } = req;
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  // 跨域允许的header类型
  res.setHeader('Access-Control-Allow-Headers', '*');
  // 允许跨域携带cookie
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // 允许的方法
  res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  // 设置响应头
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  // 对预检请求放行
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
  }
});
```
这样简单的前后端逻辑就都写好了,下面就是一键启动
```sh
timec page
```

## 最后
由于每天空闲时间有限，本文就先到这，下一期将继续完善`timec page`指令

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

