---
title: 做一个CL版的时间管理工具（11）
date: 2021-08-12
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（11）

## 前言
通过[前面10篇文章](https://juejin.cn/column/6973496830654939166)的介绍，咱们的第一版差不多迭代完毕

由于之前时间很紧，代码质量堪忧，这篇主要来做一下代码的优化工作介绍


## 代码优化
### 目录结构
当前的目录结构如下，所有的ccommand注册逻辑，业务逻辑均在`./bin/index.js`文件中

维护起来比较麻烦，首先咱们把里面的东西拆分一下
```sh
/time-control
├── README.md
├── bin
|  └── index.js
├── src
|  ├── output
|  ├── template
|  └── utils
└── yarn.lock
```

拆分后的目录结构如下，`src`增加一个`command`目录,目录下每个指令对应一个command文件

然后通过`index.js`文件将这些指令汇总，统一对外暴露
```sh
/time-control
├── src
|  ├── command
|  |  ├── command1.js
|  |  ├── command2.js
|  |  ├── index.js
```
具体示例如下

`src/command/command1.js`
```js
module.exports = function (param1,param2) {

}
```

`src/command/index.js`
```js
const command1 = require('./command1')

module.exports = {
    command1,
}
```
这样在`bin/index,js`文件中直接引入即可，例如初始化项目指令

这样业务逻辑和指令注册逻辑就分开了，维护也更加便捷
```js
const { initCommand } = require('./../src/command')
/**
 * 初始化项目
 */
commander.command("init <projectName>")
    .alias('i')
    .description('init project')
    .action(initCommand)
```

### 重复代码
指令的逻辑中，有很多重复代码，直接CV的，我们可以将这部分代码转成公共方法

`src/utils/index.js`:
* 例如下面几个简单，而使用地方又很多的
```js
// 获取命令执行路径
function getCWD(){
    return process.cwd()
}

// 获取配置文件
function getConfig(){
    return require(path.join(__dirname,'../../.config/record.json'))
}

// 获取输出文件的默认文件名
function getOutFilename(){
    return 'timec-res'
}
```

### 朴素代码
毫秒转时分秒，这个方法主要是格式化时间展示，旧的逻辑如下，非常的朴实无华，可读性也不是太高
```js
function mmsToNormal(mms) {
    let str = ''
    mms = (mms / 1000) >> 0
    const day = (mms / (24 * 60 * 60)) >> 0
    day && (str += `${day}天 `)
    mms -= day * 24 * 60 * 60
    const hour = (mms / (60 * 60)) >> 0
    hour && (str += `${hour}时 `)
    mms -= hour * 60 * 60
    const minute = (mms / 60) >> 0
    minute && (str += `${minute}分 `)
    mms -= minute * 60
    str += `${mms}秒`
    return str
}
```
如果只是展示时分秒的，可以直接调用已注册的format方法:
* 其中`+date.format('dd')`的目的是把获取到的日期转成数字
* 然后减去1即可得到过去的天数
* 时分秒就直接格式化即可
```js
function fn(mms){
  let str = `${+date.format('dd')-1}天${date.format('hh时mm分ss秒')}`
  return str
}
```
这样代码可以说优化到了一行的样子（除开format方法的具体实现）


## 小结
代码还在完善中，明天再大大优化一遍和大家分享

顺便接入一个生成页面的逻辑(计划是接入Vite)

## 其它

由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

