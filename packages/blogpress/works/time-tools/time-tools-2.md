---
title: 做一个CL版的时间管理工具（二）
date: 2021-08-03
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（二）

## 前言
[上一篇文章](./time-tools-1.md)已经介绍了项目的背景与期望通过这个项目的达到的目的

搭建了项目的初始工程

本文就继续进行功能的拓展

## 功能开发
### MD转JSON
最简单的markdown格式如下
```md
# 2021-08-03
## TaskName
* 摸鱼 0.6
```

其对应的JSON结构如下
```json
[
  {
    "title": "2021-08-03",
    "tasks": [
      {
        "title": "TaskName",
        "things": [
          {
            "time": "0.6",
            "content": "摸鱼"
          }
        ]
      }
    ]
  }
]
```
* 最外层是数组
  * 一个md中会存在多个1级标题，所以最外层数据结构使用数组
* 第二层
  * title对应一级标题
  * tasks存放由二级标题及其子内容构成的任务列表，用数组存放
* 第三层
  * title对应二级标题的内容
  * things由其子列表的每一行内容构成
    * 每一行内容对应一个基本事件单元
    * 基本事件单元包含**事件内容**和**事件耗时**两部分

转换过程如下：

将md内容读入，按行解析
```js
const lines = fileContent.split('\n')
```

判断是否以`# 一级标题`开头，如果是则为新的一天

为其添加title，tasks属性
```js
const resData = []
let item = null
for (const line of lines) {
       // 判断是否新的一天
       if (line.startsWith('# ')) {
           // 存储旧的
           if (item) {
               resData.push(item)
           }
       const title = line.replace(/#|\s/g, '')
        item = {
            title,
            tasks: []
        }
    }
}
```

紧接着判断是否以`## 二级标题`开头,如果是则将其作为task加入tasks列表
```js
// 判断是否是任务
if (line.startsWith('## ')) {
    const title = line.replace(/#|\s/g, '')
    let task = {
        title,
        things: []
    }
    item.tasks.push(task)
}
```

判断是否以`* `开头，如果是则将其作为一件thing加入things列表
```js
if (line.startsWith('* ')) {
    const task = item.tasks.pop()
    const { things } = task
    const rTime = /((0.\d*)|(\d*))?$/
    const time = line.match(rTime)[0] || '0'
    let step = -1, text = ''
    const content = (step = (text = line.replace(/\*|\s/g, '')).lastIndexOf(time)) === -1 ? text : text.slice(0, step)
    const thing = {
        time,
        content
    }
    things.push(thing)
    item.tasks.push(task)
}
```
这样如此循环直到 遇到下一个 `# 一级标题`

[完整代码链接](https://github.com/ATQQ/time-control/blob/fe95ec18de9d5ac51a0fc5d320cd6a1f55eab90e/src/utils/index.js#L7)

### 添加指令
编辑`bin/index.js`文件

添加两个options`output`,`json`

当同时键入了 `--output`,`--json`两个参数时才执行导出json的操作
```js
#!/usr/bin/env node
const json = require('../package.json');
const commander = require('commander');
const { getFilesContent, getFilePath, createFile } = require('../src/utils');
const { outputJson } = require('../src/output');

// 命令执行目录
const cwd = process.cwd()

// 设置版号
commander.version(json.version)

// 导出
commander.arguments('<filenames...>') // 多个文件/目录
    .option('-o, --output', 'Export analysis results')
    .option('-j, --json', 'Export result as json description file')
    .action((filenames, cmdObj) => {
        const { output, json } = cmdObj

        // 导出
        if (output) {
            let outFileName = 'res'
            // 后续逻辑

            // 获取所有文件的内容
            const content = getFilesContent(filenames.map(filename => {
                return getFilePath(cwd, filename)
            }))
            if (json) {
                createFile(getFilePath(cwd, `${outFileName}.json`), outputJson(content), false)
            }
        }
    })

commander.parse(process.argv)
```
添加完成后执行`timec --help`查看添加的指令如下


![图片](https://img.cdn.sugarat.top/mdImg/MTYyODAwMTc1NDY4OQ==628001754689)

对应执行指令为
```sh
timec -oj filepath1 filepath2 ....
```

* 其中`process.cwd()`能够获取到执行指令的目录
* `filenames`参数获取到的内容是除开options部分的参数
* cmdObj包含的是options参数的内容，值类型为布尔类型
  * `--output`对应output参数
  * `--json`对应json参数的内容
  * 以此类推


## 其它
由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或先关注一下[仓库](https://github.com/ATQQ/time-control)

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

