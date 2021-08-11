---
title: 做一个CL版的时间管理工具（九）
date: 2021-08-10
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# 做一个CLI版的时间管理工具（九）

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

<!-- TODO：接着 -->
```js
const content = getFilesContent(filenames.length === 0 ? [recordFilepath] : filenames.map(filename => {
    return getFilePath(cwd, filename)
}))
```

## 小结
现在的代码就像shi⛰，下一期和大家一起优化一下

然后后续再做一个可视化的功能，将报告通过一个网页展示出来

## 其它

由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

<comment/>
<tongji/>