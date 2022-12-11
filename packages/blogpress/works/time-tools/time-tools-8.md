---
title: 做一个CL版的时间管理工具（八）
date: 2021-08-09
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（八）

## 前言
[上一篇文章](./time-tools-7.md)主要阐述了删除任务与事物管理相关的指令开发

本文将着重介绍上文没讲解完的部分`writeRecord`方法，将记录的事物自动输出到配置的文件中

## 本期效果
>演示过程中发现了一个bug，赶紧修复一下

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODUyMTgxOTI4Mw==628521819283)


## 功能开发
### 自动记录事务
首先补齐打印事务耗时的逻辑
* 从获取的配置文件中解构出事务对象`thing`,包含两个属性
  * name
  * startTime
* 使用`new Date(startTime)`转换开始日期
* 调用`mmsToNormal`计算当前时间与开始时间的差值
```js
const { thing } = config
const s = new Date(thing.startTime)
console.log(`事务耗时:${thing.name} ${mmsToNormal(Date.now() - s)}`);
```

`mmsToNormal`方法非常朴素，将一个毫秒表示的时间换成`天，时，分，秒`
* 其中数字取整采用位运算符`>>`,右移0位
* 逐级取值

```js
function mmsToNormal(mms) {
    mms = (mms / 1000) >> 0
    const day = (mms / (24 * 60 * 60)) >> 0
    mms -= day * 24 * 60 * 60
    const hour = (mms / (60 * 60)) >> 0
    mms -= hour * 60 * 60
    const minute = (mms / 60) >> 0
    mms -= minute * 60
    return `${day}天 ${hour}时 ${minute}分 ${mms}秒`
}
```
在结束当前事务和直接开始新的事务的时候都会打印这个任务的耗时，然后将其结果写入到md中

开始新任务的逻辑如下：
* 打印耗时
* 输出记录到文件中
* 更新事务的值为最新的事务
* 更新配置

```js
console.log(`事务耗时:${thing.name} ${mmsToNormal(Date.now() - s)}`);
writeRecord(recordFilepath, task, thing.name, thing.startTime)

thing.name = name
thing.startTime = new Date().getTime()
writeFileSync(configPath, JSON.stringify(config))
```

下面开始介绍`writeRecord`的实现,接收4个参数
* filePath：输出目标文件的路径
* task：当前进行中的任务名
* thing：当前进行中的事务名
* startTime：事务开始时间

```js
function writeRecord(filePath, task, thing, startTime){
    // ...code
}
```

通过`getJSON`与`getFileContent`方法合力将输出目标文件转为`json`

将开始时间转为`Date`对象，调用`Date.prototype.format`方法获取事务开始时间的日期

其中`format`方法的逻辑来源与[网上大神写的正则](https://blog.csdn.net/meizz/article/details/405708)

事务持续时间保留5位小数
```js
const json = getJSON(getFileContent(filePath))
const date = new Date(startTime)
const title = date.format('yyyy-MM-dd')
const hours = ((Date.now() - date.getTime()) / 3600000).toFixed(5)
```

导出json使用的是`outPutMarkdown`方法，默认导出结果不会带`时间`，例如
```md
# 时间
## 任务名
* content
* 事务2
```
通过修改获取的json，将content内容加上时间，加上时间后的输出结果

```md
# 时间
## 任务名
* content time
* 事务2 0.02
```

修改原数据`content`加上`time`的逻辑如下：
* 通过reduce方法遍历所有的tasks
* 通过map方法将所有task中的things读取出来
* 调用flat方法展开数组
* 再遍历每一个thing，为其content加上时间
```js
const things = json.reduce((pre, v) => {
    const { tasks } = v
    const things = tasks.map(v => v.things).flat(2)
    return pre.concat(things)
}, [])
things.forEach(t => {
    const { content, time } = t
    t.content = `${content} ${time}`
})
```
下面开始核心逻辑

遍历`json`判断事务对应的日期是否已经存在

不存在则为当天的首个数据，直接向json对象中插入这个完整的对象即可
```js
const dayIdx = json.findIndex(v => v.title === title)

if (dayIdx === -1) {
    const item = {
        title,
        tasks: [
            {
                title: task,
                things: [
                    {
                        content: `${thing} ${hours}`,
                        time: '0'
                    }
                ]
            }
        ]
    }
    json.push(item)
    return writeFileSync(filePath, outPutMarkdown(json, false))
}
```
如果不是当天首个事务，接着就判断是否是一个新的任务

遍历这一天数据中的每一个任务，判断任务名是否和当前的任务一致
* 如果是，则将这个任务及事务相关数据插入到这一天的数据中
* `dataItem`表示这一天的数据

```js
const dataItem = json[dayIdx]
const taskIdx = dataItem.tasks.findIndex(v => v.title === task)
// 新的任务
if (taskIdx === -1) {
    dataItem.tasks.push({
        title: task,
        things: [
            {
                content: `${thing} ${hours}`,
                time: '0'
            }
        ]
    })
    return writeFileSync(filePath, outPutMarkdown(json, false))
}
```
最后就是直接将事务插入到旧的任务当中
```js
const taskItem = dataItem.tasks[taskIdx]
taskItem.things.push({
    content: `${thing} ${hours}`,
    time: '0'
})

return writeFileSync(filePath, outPutMarkdown(json, false))
```

到此`timc thing [option] [name]`指令基本开发完毕
* `--stop,-s`:结束当前事务

## 其它

由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

