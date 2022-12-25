---
title: Node中require与fs.readFile读取JSON文件的对比
date: 2021-08-19
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# Node中require与fs.readFile读取JSON文件的对比

## 背景
在做[时间管理工具](https://github.com/ATQQ/time-control)出现了一个问题

[代码](https://github.com/ATQQ/time-control/blob/2ce91222ac937dc10205d1153cee181985d87a5a/src/utils/index.js#L188)中使用require读取JSON文件，服务端启动后发现当JSON文件发生改动后，返回的仍然是原来的JSON内容

本着打破砂锅问道低的精神，就展开了资料查阅探究，趁机学习一波新知识

## 原因
结论先行，`require`引入的模块会被Node缓存，下面用一个简单的demo实验一下


### 示例
**test-module.js**
```js
console.log('1');

module.exports = {
    name:'0'
}
```

```js
const m1 = require('./test-module')
m1.name = '2'
const m2 = require('./test-module')
console.log(m2.name);
```
运行后的输出结果输出如下
```sh
1
2
```

从这就可以得出结论Node会缓存引入的模块，name如何查看已经被缓存的模块

### 查看缓存
通过[require.cache](http://nodejs.cn/api/modules/require_cache.html)即可获取被缓存的模块：
* 返回一个对象
```js
const m1 = require('./test-module')
console.log(require.cache);
```

输出内容如下(这里就贴一张截图)
![图片](https://img.cdn.sugarat.top/mdImg/MTYyOTM4NTA0MDE2MQ==629385040161)

### 删除缓存
既然`require.cache`返回内容是一个普普通通的对象，name可以通过`delete`关键字进行移除

```js
const m1 = require('./test-module')
m1.name = '2'
console.log(m1.name);

delete require.cache[`${__dirname}/test-module.js`]
const m2 = require('./test-module')
console.log(m2.name);
```
内容输出如下
```sh
1
2
1
0
```

原因捋完后，咱们就开始进入主题

进行`读取JSON`文件的对比分析

## 读取JSON对比
* require可以省略`.json`后缀
* fs.readFile读取不能省略后缀
test.json
```json
{
    "name":"xm"
}
```
测试demo
```js
const d1 = require('./test.json')
console.log(d1); // { name: 'xm' }
const d2 = require('./test')
console.log(d2); // { name: 'xm' }
```

## 其它差异
### 编码
* require只能按`utf-8`格式读取
* fs.readFile`Sync`可以**设置编码格式**

### 异步同步
* require是同步读取
* 通过`fs`既可以同步读取也可以异步读取

## 小结
* `require`支持缓存
* `require`只能按UTF-8读取内容
* `require`是同步的
* `require`读取JSON文件可以省略`.json`后缀

## 最后
本文内容比较精简，对于兼职学Node的同学可能会漏掉此部分知识

后续将继续更新`时间管理工具`的实践内容

