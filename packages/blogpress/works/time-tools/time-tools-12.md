---
title: 做一个CL版的时间管理工具（12）
date: 2021-08-15
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（12）

## 前言
初版的功能已经完成的差不多了，后续主要是优化一下体验和交互

本文将为插件接入`彩色打印`交互日志，加入启动web服务的指令（用于后续编写可视化的页面）

## 本期效果预览
>指令有些多，演示可能有些啰嗦

![图片](https://img.cdn.sugarat.top/mdImg/MTYyOTAzMzQyMjQ0OQ==timec12.gif)

## 功能开发
### 彩色日志
这个是直接引入了[chalk](https://github.com/chalk/chalk)这个第三方库

```sh
yarn add chalk
# or
npm i chalk
```

使用的时候非常简单，这里简单介绍一下，详细的可以直接去看[官方的示例](https://github.com/chalk/chalk/blob/main/readme.md)
```js
// 引入依赖
const chalk = require('chalk')

// 打印
console.log(chalk.yellow('hello'),chalk.red('world'))
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYyOTAzMzYyNTg5NQ==629033625895)

项目中进行简单的封装:
* 项目中不直接使用 `console.log`
* 对外暴露`print`方法代替`log`
* print方法额为添加三个默认的方法属性
  * success:绿色
  * fail:红色
  * advice:蓝色
```js
const { log } = console;

function print(...str) {
  log(...str);
}

Object.assign(print, {
  success(...str) {
    log(chalk.green('success:'), ...str);
  },
  fail(...str) {
    log(chalk.red('fail:'), ...str);
  },
  advice(...str) {
    log(chalk.blue('advice:'), ...str);
  },
});
```
使用示例如下
```js
const { print } = require('../src/utils');

print('default');
print.success('成功文案');
print.fail('失败提示');
print.advice('建议文案');
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYyOTAzMzkyMDI0Mg==629033920242)

利用封装的这三个方法，配合chalk的一些默认方法便完成了打印日志的改造

### 启动Web服务
这个功能的目的是通过一个指令，即可运行出一个Web页面

通过Web页面结合可视化库，更加详细生动的展示数据

添加一个新的指令`timec page`:

```js
commander.command('page')
  .description('Use Page show report')
  .action(() => {
      // ..code
  });
```
这里准备用[Vite](https://vitejs.dev/)来启动这个本地服务

```sh
yarn add vite
```

创建页面相关目录与文件
```sh
src
├── page
|  ├── index.html
|  └── main.js
```
index.html内容如下，一个很简单的内容
* 使用`<script type="module" src="js-url"></script>`引入js资源

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>🚀hello world🚀</h1>
    <h2>功能正在完善中</h2>
    <script type="module" src="./main.js"></script>
</body>
</html>
```
下面编写调用Vite启用服务的逻辑:
* 引入Node自带的[child_process](http://nodejs.cn/api/child_process.html)模块
* 使用`child_process.spawn(command[, args][, options])`方法运行shell指令（启动一个子进程）
  * 其中options中的cwd参数用于描述子进程的工作目录
  * 第一个参数是要执行的指令
  * 第二个参数是需要添加的参数
```js
const child_process = require('child_process');

const cwd = path.resolve(__dirname, '../');
const serveService = child_process.spawn('node_modules/.bin/vite', ['src/page', '--host'], {
  cwd,
  stdio: 'inherit',
});
serveService.on('close', (code) => {
  process.exit(code);
});
```
安装`Vite`后就会在`node_modules/.bin/vite`下创建一个可执行文件，当然这个可执行文件里会有如下一行注释代码

```sh
#!/usr/bin/env node
```

接着就是指定`index.html`的目录，执行`./node_modules/.bin/vite --help`可看到如下提示信息
```sh
Usage:
  $ vite [root]

Commands:
  [root]           
  build [root]     
  optimize [root]  
  preview [root]
  ....
```
咱们直接第一个参数指定文件所在目录即可，加上`--host` option后将会提供一个局域网的地址访问，像下面这样

![图片](https://img.cdn.sugarat.top/mdImg/MTYyOTAzNjc5Nzg4OA==629036797888)

同一局域网的其它设备也可通过这个地址访问这个页面的信息

### 其它
直接使用`child_process.spawn`在windows上会有[一些兼容性问题](https://github.com/moxystudio/node-cross-spawn)

项目中使用[cross-spawn](https://github.com/moxystudio/node-cross-spawn)来替代直接使用`child_process.spwan`

```sh
yarn add cross-spawn
```

更新上面的启动代码
```js
const spawn = require('cross-spawn');

commander.command('page')
  .description('Use Page show report')
  .action(() => {
    const cwd = path.resolve(__dirname, '../');
    const serveService = spawn('node_modules/.bin/vite', ['src/page', '--host'], {
      cwd,
      stdio: 'inherit',
    });
    serveService.on('close', (code) => {
      process.exit(code);
    });
  });
```
## 最后
由于每天空闲时间有限，本文就先到这，下一期将继续完善`timec page`指令

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

