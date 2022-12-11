---
title: Vite插件开发纪实：vite-plugin-monitor（下）
date: 2021-10-01
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# Vite插件开发纪实：vite-plugin-monitor（下）

## 前言
[上一篇](./vite-plugin-monitor2.md)介绍了Vite启动，HMR等时间的获取。

但各阶段详细的耗时信息，只能通过debug的日志获取

本文就实现一下debug日志的拦截

## 插件效果预览

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzA4MTY0NTkzNA==633081645934)

## --debug做了什么
项目启动指令
```sh
vite --debug
```
在源码中搜索 `--debug`，可以在[vite/packages/vite/bin/vite.js](https://github.com/vitejs/vite/blob/63c7a88cadfff1d9fb10f63415a7132bf5eec483/packages/vite/bin/vite.js#L14)文件中定位到目标代码

```js
const debugIndex = process.argv.findIndex((arg) => /^(?:-d|--debug)$/.test(arg))

if (debugIndex > 0) {
  let value = process.argv[debugIndex + 1]
  if (!value || value.startsWith('-')) {
    value = 'vite:*'
  } else {
    // support debugging multiple flags with comma-separated list
    value = value
      .split(',')
      .map((v) => `vite:${v}`)
      .join(',')
  }
  process.env.DEBUG = value
}
```

可以看到如果使用了`--debug`或者`-d`参数，`process.env`上挂载`DEBUG`变量标识开启了Debug 

## 定位打印日志方法
debug下每条日志都是以`vite:label`开头，比如
```sh
vite:load 1ms   [fs] /src/router/routes/index.ts
```
全局搜一下`vite:load`就定位到了如下的[代码](https://github.com/vitejs/vite/blob/63c7a88cadfff1d9fb10f63415a7132bf5eec483/packages/vite/src/node/server/transformRequest.ts#L23)，可以看到`createDebugger`是返回了一个可以打印日志的方法
```js
import {
  createDebugger,
} from '../utils'
const debugLoad = createDebugger('vite:load')
const isDebug = !!process.env.DEBUG
// ..code
isDebug && debugLoad(`${timeFrom(loadStart)} [fs] ${prettyUrl}`)
```

`createDebugger` 的源码如下，其返回一个自定函数，简单捋一下就能看出，负责打印的方法是`log(msg,...args)`
```js
import debug from 'debug'

export function createDebugger(
  namespace: ViteDebugScope,
  options: DebuggerOptions = {}
): debug.Debugger['log'] {
  const log = debug(namespace)
  const { onlyWhenFocused } = options
  const focus =
    typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace
  return (msg: string, ...args: any[]) => {
    if (filter && !msg.includes(filter)) {
      return
    }
    if (onlyWhenFocused && !DEBUG?.includes(focus)) {
      return
    }
    log(msg, ...args)
  }
}
```
其中`log`实例通过`debug`方法创建，但这个`debug`方法是一个第三方的库`visionmedia/debug`

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzA5MTM2MjM0Mg==633091362342)

这个方库虽小，能在`Vite`中被用上想必也不简单，[在线查看源码](https://github1s.com/visionmedia/debug/blob/HEAD/src/node.js)

## debug方法源码分析
入口文件比较简单，这里直接去看`./node.js`中的逻辑
```js
if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = require('./browser.js');
} else {
	module.exports = require('./node.js');
}
```

这部分代码一共只有**264**行，关键代码如下
```js
exports.log = log;

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

module.exports = require('./common')(exports);
```
**./common.js**中部分代码
```js
function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;

	function createDebug(namespace) {
		function debug(...args) {
			const self = debug;
			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}
		return debug;
	}
	return createDebug;
}

module.exports = setup;
```
到此能够确定日志的打印都是通过`process.stderr.write`方法输出的内容

这个方法的好处就是，输出内容不会直接换行

那么我们在插件中重新定义一下这个方法就能拦截到打印的内容

## debug日志拦截实现
定义插件入参
```ts
interface PluginOptions {
    /**
     * 是否在终端中输出原来的日志
     */
    log?: boolean
    /**
     * 默认回调
     */
    monitor?: MonitorCallback
    /**
     * debug回调
     */
    debug?: DebugCallback
}
```
直接在调用插件方法的时候进行`write`方法重写，具体实现逻辑如下
* 启用了`--debug`，传入了`monitor`或`debug`方法才重新定义write方法
* 将获取到的日志信息做简单解析，通过`monitor`方法传递给外部
* 原始参数传递给外部的debug方法

其中解析出的几个参数几个参数与原日志内容对应关系如下

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzA5MzM0NDMxNg==633093344317)
```ts
import type { Plugin } from 'vite';
import type { PluginOptions } from './types';

export default function Monitor(ops: PluginOptions = {}): Plugin {
  const { log, monitor, debug } = ops;
  // 如果debug方法且启动时添加了--debug参数
  if ((typeof debug === 'function' || typeof monitor === 'function') && process.env.DEBUG) {
    const { write } = process.stderr;
    Object.defineProperty(process.stderr, 'write', {
      get() {
        return function _write(...argv) {

          // log为true才执行原来的打印逻辑
          if (log && typeof argv[0] === 'string') {
            process.stdout.write(argv[0]);
          }
          const originStr = argv[0];

          // 解析日志的label与打印的时间信息
          const tag = (originStr.match(/vite:(.*?)\s/) || [])[1];
          const time1 = (originStr.replace(/\+\d+ms/, '').match(/(\d+)ms/) || [])[1];
          const time2 = (originStr.match(/\+(\d+)ms/) || [])[1];
          const time = +(time1 || 0) + +(time2 || 0);


          if (tag && monitor) {
            monitor(tag, time, {
              time1: +(time1 || 0),
              time2: +(time2 || 0),
              originValue: originStr,
            });
          }

          if (debug) {
            debug(...argv);
          }
        };
      },
    });
  }
  return {
    name: 'vite-plugin-monitor',
    apply: 'serve',
    },
  };
}
```

到此拦截日志的feature就完成了,最初定下目标也已完成

## 体验插件
>[插件源码](https://github.com/ATQQ/vite-plugin-monitor/tree/main/#readme)

安装依赖 
```sh
yarn add vite-plugin-monitor --dev
```

引入插件，修改**vite.config.js**文件
```js
import { defineConfig } from 'vite'
import vitePluginMonitor from 'vite-plugin-monitor'

export default defineConfig({
  plugins: [
    vitePluginMonitor({
      // log: false,
      monitor(label, time, originData) {
        const { time1, time2, originValue } = originVal
        console.log(originValue)
        console.log(label, time1, time2, `${time}ms`)
      },
      debug(str) {
        // 打印完整日志
        // process.stdout.write(str)
      },
    }),
  ],
})
```
启动指令中添加`--debug`
```sh
vite --debug
```
通过`monitor`与`debug`方法中就能拿到原始的日志和简单处理后的日志，在此处**加入自定义的埋点监控代码即可**

**一点补充：** 在`log`为`false`的时，并且定义了`monitor`或`debug`方法，那么原来的日志内容都将会被这两个方法拦截

## 小结
目前已经能够完全拦截到debug下的所有内容，但内容由于有彩色打印相关的字符，提取信息比较麻烦

下一步将对日志的提取再做一些格式化，确保能够解析出完整的日志内容

