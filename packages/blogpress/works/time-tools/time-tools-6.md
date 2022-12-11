---
title: 做一个CL版的时间管理工具（六）
date: 2021-08-07
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（六）

## 前言
[上一篇文章](./time-tools-5.md)主要阐述了生成一段时间内的报告指令：
* `timec -or --range <startTime>_<endTime> <filename1> <filename1> .....`

有时候期望直接导出的某一天，某一月，甚至某一年的数据，为此将会拓展几个日期相关的指令
* 某一天：`timec -or --day [date]`
* 某一月：`timec -or --month [month]`
  * 将默认为今年
* 某一年：`timec -or --year [year]`
* 某年某月：`timec -or -Y [year] -M [month]`
  * `--month` 与 `--year`组合使用
  * 其中`-M`，`-Y`分别是上述两个指令的缩写

除了这部分内容，本节也将会进入新的篇章，开始开发**使用指令管理任务与事务**

本文将会涉及任务相关的指令开发：`timec task [name]`

## 本期效果

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODM0OTA5MTk2NQ==Kapture%202021-08-07%20at%2023.10.56.gif)
## 功能开发
>本部分将会省略五官代码(前几篇文章已出现过)

### 日期相关指令
#### 具体到天
首先是指定到某一天:
* 通过`option`注册可选参数
* 通过`cmdObj`的day属性拿到用户传入的值

```js
.option('-D, --day [date]', 'One day')
// 省略actions code
const { day } = cmdObj
```
对输出报告的函数进行改造封装:
* 参数分别是`开始时间`与`结束时间`
  * 这样其余几个可选参数指令也可直接复用

```js
const output = (s, e) => {
  const outPutPath = getFilePath(cwd, `report-${outFileName}.md`)
  const json = getJSONByRange(content, s, e)
  if (json.length === 0) {
      console.log('没有符合条件的数据');
      return
  }
  const data = outPutReport(json)
  createFile(outPutPath, data, false)
  console.log(`导出成功`);
}
```

判断日期是否存在，存在则直接导出
* 开始与结束时间都是传入的日期

```js
if (day) {
    return output(day, day)
}
```
#### 具体到月
老规矩先注册相关指令
```js
.option('-M, --month [month]', 'One month')
```
如果只有月，那么默认年就是今年，起止时间分别是
* `nowYear-month-01`
* `nowYear-month-days`

**插播一条技巧**：如何快速获取某年某月的天数:
1. `Date`构造函数支持传入年,月,日三个参数的函数重载
2. 其中月是`从0开始计算`："1-12"分别对应"0-11"
3. 当日部分的参数传入0时，表示上月最后一天的日期
4. 此时再调用`getDate`方法获取日期，则获取到目标月份的天数
  
例如：2021-08月的天数：
* `new Date(2021,8,0)`
* 标识`2021年9月`开始的前一天日期，即`2021年8月31日`
* `getDate`返回结果即为`31`

```js
const days = new Date(year,month,0).getDate()
```

导出逻辑如下：
* 今年的年份通过`new Date().getFullYear()`获取
```js
if (month) {
    const year = new Date().getFullYear()
    return output(`${year}-${month}-01`, `${year}-${month}-${new Date(year, month, 0).getDate()}`)
}
```

#### 具体到年
如果是年，那么起止时间分别就是：
* `year-01-01`
* `year-12-31`

这个没得太多说法，轻车熟路写好
```js
.option('-Y, --year [year]', 'One year')
// ...more code
if (year) {
    return output(`${year}-01-01`, `${year}-12-31`)
}
```
#### 具体到某年某月
这个就是-M与-Y参数组合使用时的场景

只需要将上述两种导出方式的逻辑做一个合并即可，逻辑简单
```js
if (year && month) {
    return output(`${year}-${month}-01`, `${year}-${month}-${new Date(year, month, 0).getDate()}`)
}
```

几个日期相关的指令搞完，接着就开始整任务相关的指令
### 任务管理指令
指令格式如下

```sh
timec task [name]
```
`name`参数是可选的，有如下几种逻辑:
* 当name为空时，展示所有的任务，并标记正在进行中的任务
* 当name不存在时，将其添加进任务列表
* 当name存在时，将其设置为正在进行中的任务

理清逻辑后，进入开发

#### 初始化配置文件
在项目工程的根目录创建一个`.config/record.json`文件
```sh
/Users/sugar/Documents/fe-project/time-control
├── bin
├── src
├── test
├── .config
├────└──record.json
└── test2.md
```

配置文件结构如下：
```json
{
    "recordFilepath": "",
    "tasks": [],
    "defaultTaskIdx": -1,
    "thing": {
        "name": "",
        "startTime": "2021-01-01",
        "endTime": "2021-12-31",
        "pauseTime": "2021-12-26"
    }
}
```

这里将主要用到`tasks`与`defaultTaskIdx`两个属性，前者记录所有的任务，后者记录当前正在进行的任务

#### 注册指令
使用`commander.command`注册指令：
* 其中使用`[]`包裹的参数标识可选参数
```js
/**
 * 创建任务、切换任务、查看任务列表
 */
commander.command("task [name]")
    .alias('t')
    .description('check tasks/add task/checkout task')
    .action((name) => {
        // ...code 后文介绍
    })
```

配置文件的路径
* 通过`__dirname`与配置文件的相对路径定位配置文件
```js
const configPath = path.join(__dirname, '../.config/record.json')
```

通过`require`方法引入json配置文件
* 引入的内容就是一个对象，无需调用`JSON.parse`进行转换

```js
const config = require(configPath)
```

下面就到具体的业务逻辑代码
* 先判断是否传入任务名`name`
  * 没有，判断是否有任务，有则顺序打印，无则打印提示信息
* 如果任务名不存在，则加入任务列表`tasks`
  * 存在，则将这个任务设置为正在进行的任务，即更新`defaultTaskIdx`的值
* 最后更新配置文件的内容

```js
const { tasks, defaultTaskIdx } = config
const idx = tasks.findIndex(v => v === name)
if(!name){
    if(tasks.length===0){
        console.log('no tasks, you can use command add task');
        console.log('timec task [name]');
        return 
    }
    tasks.forEach((v,i)=>{
        let mark = '[ ]'
        if(i===+defaultTaskIdx){
            mark = '[*]'
        }
        console.log(mark,v);
    })
    return
}
if (idx === -1) {
    tasks.push(name)
    if(tasks.length===1){
        config.defaultTaskIdx = 0
    }
    console.log('add task success');
}else{
    config.defaultTaskIdx = idx
    console.log('now use task：',tasks[idx]);
}
writeFileSync(configPath,JSON.stringify(config))
```
这个指令就开发完了，时间仓促，代码质量可能不会太高

TODO：后续优化
### 小结
到目前为止已经支持如下指令：

![图片](https://img.cdn.sugarat.top/mdImg/MTYyODM0NzIwOTYxMw==628347209613)

这些指令都还不是最终版本，由于时间太紧凑，设计时间也较短，后期会不断完善

## 其它

由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

