---
title: 做一个CL版的时间管理工具（七）
date: 2021-08-08
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（七）

## 前言
[上一篇文章](./time-tools-6.md)主要阐述了多种日期的数据导出与任务管理相关的指令开发

本文将会涉及指令：
1. 删除指定任务:`timec task -d [name]`
   1. 添加了一个`option`参数`-d`，标识要移除这个任务
2. 设置记录默认输出位置:`timec upPath <recordFilepath>`
   1. 用户后续通过指令添加/完成事务均会在此记录
3. 开始/结束具体的事务：`timec thing -s [name]`
   1. 其中`-s`标识，是否暂存任务状态的可选参数

## 本期效果
TODO： 补一张图

## 功能开发
### 删除任务指令
这个功能只需在昨天开发的任务管理指令的基础上添加一个可选指令即可
* 首先使用`option`方法注册`--del`可选参数
* 通过解构从`cmdObj`上拿到`del`的值
```js
commander.command("task [name]")
    .option('-d, --del', 'Delete task or thing')
    .action((name, cmdObj) => {
        const { del } = cmdObj
        // ...code
    }
```

如果del的值为true，表明设置了del这个option
* 使用splice方法，从任务数组中删除这一项
* 删除后更新配置文件
  * 如果任务被清空了，那么将`defaultTaskIdx`置为-1
  * 否则以当前任务列表的第一项，作为正在进行的任务

```js
const idx = tasks.findIndex(v => v === name)

if (del) {
    tasks.splice(idx, 1)
    console.log(`del ${name} success`);
    config.defaultTaskIdx = tasks.length ? 0 : -1
    if (config.defaultTaskIdx === 0) {
        console.log('now use task：', tasks[config.defaultTaskIdx]);
    }
}

writeFileSync(configPath, JSON.stringify(config))
```
删除任务的功能，就简简单单的搞定了

### 设置记录默认输出位置

#### 功能背景
在未引入通过指令记录所做任务的耗时时

需要手动将这些记录添加到记录文件中

期望后续能通过指令，就自动计算事务耗时，然后将记录自动写到目标文件中

如果目标文件的地址是拼在参数中，难免在每次使用的时候稍显麻烦

为了避免这个小麻烦，就将目标文件的路径存到配置文件中

#### 指令开发
其中存储位置对应配置文件中的`recordFilepath`属性
```json
{
    "recordFilepath":"/Users/sugar/Documents/fe-project/time-control/test.md"
}
```

通过`commander.command`注册指令，设置为`upPath <recordFilepath>`
* emm这个命名感觉有点奇怪，暂时没想到更好的命名方式，后续在优化阶段统一更新

```js
/**
 * 更改默认记录文件的位置
 */
commander.command("upPath <recordFilepath>")
    // .alias('urp')
    .description('update config recordFilepath')
    .action((recordFilePath) => {
        // ...code
    })
```

通过指令执行目录`cwd`与传入的文件相对路径`recordFilePath`得到输出文件所在位置的绝对路径

然后将这个绝对路径赋值给配置文件的`recordFilePath`属性

通过`fs.existsSync`方法，判断这个文件是否存在，如果不存在就自动创建

最后通过`fs.writeFileSync`更新配置文件
```js
const config = require(configPath)
const fullPath = path.resolve(cwd, recordFilePath)
config.recordFilepath = fullPath
if (!existsSync(fullPath)) {
    // 自动创建空文件
    createFile(fullPath, '', false)
}
writeFileSync(configPath, JSON.stringify(config))
console.log('set recordFilePath success：', fullPath);
```

设置输出文件路径的指令开发到这就完毕了


### 事务管理指令开发
期望通过简单的`timec thing -s [name]`,即可完成事务的添加，结束，自动写入到文件

其中`--stop`option是可选的，标识结束这个工作，将其写入到文件之中去

首先注册指令，然后从配置文件中取出相关的配置项目

其中`thing`属性的结构如下
```json
{
    "name":"abc",
    "startTime":"2021-08-08 22:18:19"
}
```
分别存放当前进行中的事务名和事务开始时间

```js
commander.command("thing [name]")
    .option('-s, --stop', 'stop a thing ')
    .description('update config recordFilepath')
    .action((name, cmdObj) => {
        const config = require(configPath)
        const { thing, recordFilepath, tasks, defaultTaskIdx } = config
        const task = tasks[defaultTaskIdx]
        
    })
```

首先做一些判断，避免引发错误
1. 判断是否设置了写出文件路径
2. 判断是否设置了任务

如果没有设置，抛出响应提示信息
```js
const s = new Date(thing.startTime)

if (!existsSync(recordFilepath)) {
    console.log(`${recordFilepath} is not exist`);
    console.log('you can use "timec upPath <recordFilepath>" set it');
    return
}
if (!task) {
    console.log('not set task');
    console.log('you can use "timec task [name]" set it');
    return
}

```

如果没有传入事件名称`name`，表示使用查询功能，打印当前事务的基本信息
* 名称
* 开始时间
* 已经持续了多久（暂时毫秒代替），TODO：后续优化

如果设置了结束的标志`stop`，则将这个事务的记录写入到文件之中去，更新配置文件

```js
      
if (!name) {
    if (!thing.name) {
        console.log('Events not in progress');
        return
    }
    const { stop } = cmdObj
    if (stop) {
        writeRecord(recordFilepath, task, thing.name, thing.startTime)
        thing.name = ''
        thing.startTime = ''
        writeFileSync(configPath, JSON.stringify(config))
        return
    }
    console.log('------');
    console.log(`-name:     ${thing.name}`);
    console.log(`-start:    ${s.format('yyyy-MM-dd hh:mm:ss')}`);
    // TODO：时分秒
    console.log(`-duration: ${Date.now() - s} mss`);
    console.log('------');
    return
}
```

具体的输出到文件的方法`writeRecord`逻辑稍微有些复杂，今日时间实在有限，明日再详细分析

## 其它

由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

