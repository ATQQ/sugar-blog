---
title: 做一个CL版的时间管理工具（九）
date: 2021-08-10
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（九）

## 前言
[上一篇文章](./time-tools-8.md)主要阐述了自动记录事务的逻辑

通过[前面8篇文章](https://juejin.cn/column/6973496830654939166)的介绍，这个工具目前已经能够进行初步的使用

本文将从头到尾的介绍一下已经开发的核心功能的使用

## 使用
### 安装
1. 需要电脑上安装Node
2. 如果依赖找不到，请先将npm源切换为官方源

```sh
npm config set registry https://registry.npmjs.org/
```
安装
```sh
npm install -g time-control
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNTM4NTM2Mg==628605385362)

### 查看支持的指令

通过8天的不懈努力，可以看到我们已经开发出了很多的指令，下面将演示一下核心的几个：
* 自动记录
* 生成周报/日报/月报（时间报告）

```sh
timec --help
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNTY3NDEyOA==628605674128)

### 项目初始化
创建一个用于记录的项目
```sh
timec init timeLog
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNjAzNjY5OQ==628606036700)

### 创建文件
创建一个用于自动写入内容的文件
```sh
timec create auto.md
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNjE1MTM1OQ==628606151359)

创建的模板文件会有一些内容，可以手动清除一下

### 设置文件路径
设置自动记录文件的路径
```sh
timec upPath ./auto.md 
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNjM0MDE3Mw==628606340173)


### 任务管理
查看正在进行中的任务
```sh
timec task 
```

创建新的任务
```sh
timec task <name>
```

切换任务,这里和创建任务一样的指令与参数

如果任务已存在就选择使用这个任务
```sh
timec task <name>
```

删除已存在的任务
* 加上`-d`option就代表是移除这个任务
```sh
timec task -d <name>
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNjUzOTc3NA==628606539774)

### 事务管理

开始一个新的事务
```sh
timec thing <name>
```

查看当前进行中的事务
```sh
timec thing
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNjg0MDEzMQ==628606840131)


结束当前事务
* 加上`-s`参数即可
* 结束事务，会自动将刚刚进行的事务记录到文件中
```sh
timec thing -s
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNzAyMDIxNg==628607020216)

不切换事务，直接开始新的事务
* 将进行中的直接结束，然后将结果写入文件中
* 然后开始新的事务
```sh
timec thing <name>
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNzIyMjE2Nw==628607222167)

注：事务记录的数字是，事务的耗时，单位是小时（hours）保留5位小数

事务相关的操作到这就演示完毕了

有了事务记录的数据，下面就是生成报告了

下面将介绍到户导出功能

### 多样化导出
#### 导出为JSON

开发者们可以用这串json，自己进行个性化的分析
```sh
timec -oj <filepath>
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNzQ0ODc3Mg==628607448772)

#### 导出Markdown

加上`-t`选项可为md文件加上详细的耗时，包含`事务`，`任务`，`天`维度
```sh
timec -omt <filepath>
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNzU2MzYzMQ==628607563631)

#### 生成日报
指定要查看的日期和分析的文件即可：
* 生成的报告包含，一天的总耗时，某个任务的总耗时
```sh
timec -or -D <date> <filepath>
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNzczNjE2Nw==628607736167)

#### 生成月报
通过`-M`指定要查看的月份即可
```sh
timec -or -M <month> <filepath>
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwNzg5NzAxNA==628607897014)

#### 一段时间的报告
可以用这个生成周报，任意时间范围的报告

```sh
timec -or -R <startTime_endTime> <filepath>
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODYwODAxNjQ2Ng==628608016466)

## 小结
核心的功能基本都详细介绍完毕，演示过程中发现了一些bug，留到下期进行优化

数据展示这一块后续也将为大家带来丰富的功能，灵感还在，只差时间

## 其它

由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

