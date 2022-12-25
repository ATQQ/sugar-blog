---
title: 做一个CL版的时间管理工具（五）
date: 2021-08-06
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（五）

## 前言
[上一篇文章](./time-tools-4.md)主要阐述了两个指令的开发：
* 初始化项目模板指令：`timec init <projectName>`
* 初始化记录模板指令：`timec create <filename>`

本节将主要介绍：**自动生成一段时间内的报告**

期望效果的指令为：`timec -or --range <startTime>_<endTime> <filename1> <filename1> .....`

## 本期效果
![图片](https://img.cdn.sugarat.top/mdImg/MTYyODI2NDU4MDE2Ng==time-control5.gif)

## 功能开发

### 一定时间范围内的报告生成
可用于周报，日报，月报的统计数据生成，方便自己复盘一周所做的事情

#### 指令注册
>注意：省略了前几篇里已经出现过的指令逻辑

轻车熟路，使用option方法注册新的可选参数：
* -r：代表要输出报告
* -R：代表要输出的事件范围
```js
// 导出
commander.arguments('<filenames...>') // 多个文件/目录
    .option('-o, --output', 'Export analysis results')
    .option('-r, --report', 'Export the result as a md report')
    .option('-R, --range [startDate_endDate]', 'A time period')
    // .action
```

再添加简单的判断逻辑：
* `-r`对应的是`report`属性，为`true`表明启用了这个option
* `-R`对应`range`属性，其值为`string`类型
  * 开始与结束时间使用下划线`_`分割
* 主要关注`getJSONByRange`与`outPutReport`这两个方法的实现
* 内容的读取逻辑(`content`)，在前几篇的文章已经详细介绍过了，这里就不再赘述

```js
    .action((filenames, cmdObj) => {
        const { output,report } = cmdObj
        // 导出
        if (output) {
            let outFileName = 'res'

            if(report){
                const {range} = cmdObj
                if(range){
                    const [startTime,endTime] = range.split('_')
                    // createFile(getFilePath(cwd, `report-${outFileName}.md`),outPutReport(getJSONByRange(content,startTime,endTime)),false)
                    // 方便观察调用结构，展开如下
                    const outPutPath = getFilePath(cwd, `report-${outFileName}.md`)
                    const json = getJSONByRange(content,startTime,endTime)
                    const data = outPutReport(json)
                    createFile(outPutPath,data,false)
                }
            }
        }
    })
```
#### 范围内的json获取
这个逻辑相对简单：
1. 先调用`getJSON`方法将传入的内容转为json对象
   * 其中每一项数据的`title`为`yyyy-mm-dd`的日期
2. 先调用`sort`方法对数据按时间从小到大排序
3. 在使用`filter`方法对数据按照传入的起止时间进行过滤筛选
4. 最后便产生了所需要的结果

```js
function getJSONByRange(fileContent, startTime, endTime) {
    let jsonSchema = getJSON(fileContent)
    // 从小到大排
    jsonSchema = jsonSchema.sort((a, b) => {
        const d1 = new Date(a.title)
        const d2 = new Date(b.title)
        return d1 - d2
    }).filter(v => {
        const d = new Date(v.title)
        const s = new Date(startTime)
        const e = new Date(endTime)
        return d >= s && d <= e
    })
    return jsonSchema
}
```
#### JSON转报告内容
期望的报告内容格式如下
```markdown
# 开始时间 - 结束时间
**总耗时** xxx

## 任务名
>耗时：yyyy
* 事件1
* 事件2
* 事件3

## 任务名
>耗时：yyyy
* 事件1
* 事件2
* 事件3
```

结构定下来后，咱们开始对json数据进行操刀

JSON数据结构如下（复习一下）
```json
[
  {
    "title": "2021-08-03",
    "tasks": [
      {
        "title": "任务1",
        "things": [
          {
            "time": "0.2",
            "content": "a组件"
          },
          {
            "time": "0.3",
            "content": "b组件"
          }
        ]
      },
    ]
  },
] 
```

首先使用一个数组存放每一行的数据的结果（最终md的每一行）
```js
const res = []

// 记录总耗时
let sumTime = 0
```

开始结束时间分别为`json`对象的第一项和最后一项的title
```js
const startDate = jsonSchema[0].title
const endDate = jsonSchema[jsonSchema.length-1].title
// 时间
res.push(`# ${startDate} 至 ${endDate}`)
```

确定时间之后，就是任务的归类

>后面大部分操作都是使用`Array.prototype.reduce`，不熟悉的同学可以MDN查询一下

先将所有任务收进同一个数组里：
* 遍历然后用`concat`链接这些数组
```js
// 过滤出所有的tasks
const allTasks = jsonSchema.reduce((pre,current)=>{
    return pre.concat(current.tasks)
},[])
```

合并相同任务(task)的事务(things)

合并前
```json
[
  {
    "title": "任务1",
    "things": [
      {
        "time": "0.2",
        "content": "a组件"
      },
    ]
  },
    {
    "title": "任务1",
    "things": [
      {
        "time": "0.3",
        "content": "b组件"
      }
    ]
  },
]
```

合并后
```json
[
  {
    "title": "任务1",
    "things": [
      {
        "time": "0.2",
        "content": "a组件"
      },
      {
        "time": "0.3",
        "content": "b组件"
      }
    ]
  }
]
```
确定好前后的结构后，逻辑代码就容易书写了:
* 如果`pre`为空数组则直接存入
* 遍历已经存入的内容，判断是否存在相同的任务
  * 不存在，则加入`pre`
  * 存在，则将其things加入`pre.things`

```js
// 合并相同的任务
const tasks = allTasks.reduce((pre,current)=>{
    if(pre.length===0){
        pre.push(current)
        return pre
    }
    let sameTask = pre.find(v=>v.title===current.title)
    if(!sameTask){
        pre.push(current)
        return pre
    }
    sameTask.things.push(...current.things)
    return pre
},[])
```

结构整理完毕，接着就是内容的生成了:
* 使用`for...of` 遍历每一个任务
* 内部使用`Array.prototype.map`遍历事务
  * 遍历的同时将任务时间计算出来
* 一个任务遍历完，先添加任务耗时，再添加事务列表
* 最后，将所有任务使用的总时间利用数组的`splice`方法，将其插入结果第二项

到此，生成范围报告的逻辑就完成了
```js
for (const taskItem of tasks) {
    res.push('')
    res.push(`## ${taskItem.title}`)
    let taskTime = 0
    let things = taskItem.things.map(thing=>{
        const {time,content} = thing
        taskTime += (+time)
        return `* ${content}`
    })
    res.push(`>耗时：${taskTime.toFixed(2)}`)
    res.push(...things)
    sumTime += taskTime
}
res.splice(1,0,`**总耗时** ${sumTime.toFixed(2)}`)
```

[本部分的完整代码地址](https://github.com/ATQQ/time-control/pull/2/files)

## 其它

由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或先关注一下[仓库](https://github.com/ATQQ/time-control)

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

