---
title: 做一个CL版的时间管理工具（十）
date: 2021-08-11
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（十）

## 前言
[上一篇文章](./time-tools-9.md)主要详细介绍了工具的使用，到目前为止已经支持了不少指令了

本期主要做一些优化工作，新增一个指令
* `timec report [option] [filenames...]`：导出报告
  * 可以不传入任何可选的参数，直接使用咱们配置的自动记录事务的文件地址
  * 这个指令主要是将导出报告的指令抽离出来

## 功能优化
### 报告导出
注册一个新的`command`,将原有的option移动下来

其中当`[param]`后面带有`...` => `[param...]`时，标识这个参数类型是一个数组，即可以获取输入的多个值
```js
commander.command("report [filenames...]")
    .description('Automatic generation of time management reports')
    .option('-D, --day [date]', 'One day')
    .option('-M, --month [month]', 'One month')
    .option('-Y, --year [year]', 'One year')
    .option('-R, --range [startDate_endDate]', 'A time period')
    .action((filenames, cmdObj) => {
      // ...code
    }
```

从配置文件中获取到记录文件的位置

如果没有输入文件名且没有指定默认记录文件，那么抛出提示信息
```js
const config = require(configPath)
const { recordFilepath } = config

if (filenames.length === 0 && !existsSync(recordFilepath)) {
    console.log(`${recordFilepath} is not exist`);
    console.log('you can use "timec upPath <recordFilepath>" set it');
    return
}
```

如果没有输入文件，就读取配置的文件中的内容
```js
const content = getFilesContent(filenames.length === 0 ? [recordFilepath] : filenames.map(filename => {
    return getFilePath(cwd, filename)
}))
```

后续的逻辑不变，跟原来的一致，这里额外添加了一个兜底逻辑

当没有指定输出时间范围的时候，输出`1970-2970`（手动滑稽）的数据
```js
// ...more code
if (month) {
    const year = new Date().getFullYear()
    return output(`${year}-${month}-01`, `${year}-${month}-${new Date(year, month, 0).getDate()}`)
}

// 兜底(上下1000年,希望代码还在)
output('1970-01-01','2970-01-01')
```

#### 使用

直接导出默认全部的数据
```sh
timec report
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODY4ODMwNjgyNg==628688306826)


导出某天
```sh
timec report -D 2021-08-11
```

导出今年某月
```sh
timec report -M 8
```

导出某年
```sh
timec report -Y 2021
```
导出一段时间
```sh
timec report -R 2021-08-01_2021-08-11
```

### 导出MD/JSON
这部分逻辑原来和上述部分逻辑耦合在一起，这里也将其拆分出来

预期的指令`timec output [option] [filenames...]`

逻辑跟上述相同，默认会以配置中的`defaultFilepath`作为输入文件
```js
commander.Command('output [filenames...]')
    .option('-j, --json', 'Export result as json description file')
    .option('-m, --markdown', 'Export the result as a markdown file')
    .option('-t, --time', 'Export the result with time')
    .action((filenames, cmdObj) => {
        // ...code 添加跟上述一样的逻辑
    })
```
后续逻辑基本一致
1. 判断是否有输入文件
2. 判断是否配置了默认输入文件
3. 获取文件内容
4. 判断使用的option
5. 调用对应的逻辑
```js
// 1.
if (filenames.length === 0 && !existsSync(recordFilepath)){
  // code
}

// 2.
// 获取所有文件的内容

// 3.
// 判断输入的option
const { json, markdown, time } = cmdObj
if(json){

}
// ...
```

优化后的指令如下

导出json
```sh
timec output -j
```

导出md
```sh
timec output -m
```

option可以组合使用

使用自定义的输入文件
```sh
timec output -mj ./file1 ./file2
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODY4OTE3MzkxMg==628689173912)

## 小结
目前的指令如下`timec --help`

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODY4OTY0MDQzMA==628689640430)

现在的代码就像shi⛰，下一期和大家一起优化一下

整洁代码就要来了

然后后续再做一个可视化的功能，将报告通过一个网页展示出来

## 其它

由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

