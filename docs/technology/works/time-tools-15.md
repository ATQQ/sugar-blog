# 做一个CLI版的时间管理工具（15）

## 前言
在前一期文章中完善了一个生成Web页面浏览事务进展的`timec page`指令

但在日`常使用工具中发现发现了两个痛点：
1. 由于事务繁多，经常会忘记结束一个事情，就开始了下一个事情
2. 在切换任务的时候需要完整的输入任务名才能进行任务的切换

当然还有一些其它的痛点，本期着重**解决第1个痛点**

## 定时提醒Feature开发
定时提醒，并自动执行`timec thing -s`保存，使用一个提示音进行提示

预期指令`timec remind`
* `-c,--cycle [time]`:设置提醒的周期，单位分钟，默认40分钟提醒一次
```sh
timec remind [option]
```

### 注册指令
使用`commander.command`注册`remind`指令，使用`.option`方法设置一个可选参数`cycle`, 第二个参数传入默认值`'40'`
```js
commander.command('remind')
  .description('Open auto remind music')
  .option('-c,--cycle [time]', 'Set the duration of the reminder cycle（minute）', '40')
  .action(remindCommand);
```
## 最后
由于每天空闲时间有限，本文就先到这，下一期将继续完善`timec page`指令

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

<comment/>
<tongji/>
