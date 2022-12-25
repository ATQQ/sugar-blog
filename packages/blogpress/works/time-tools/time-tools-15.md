---
title: 做一个CL版的时间管理工具（15）
date: 2021-08-23
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
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

具体逻辑如下:
1. 将`cycle`参数转为整数
2. 然后使用定时器`setTimeout`，在`cycle*oneMinute`毫秒后,播放音频与自动记录
```js
const spawn = require('cross-spawn');

// 提醒周期（minute）
  const time = +cmdObj.cycle;
  const oneMinute = 1000 * 60;
  const loop = () => {
    setTimeout(() => {
      playRemindAudio(loop);
      // 自动记录一下
      const cwd = getCWD();
      const { thing } = getConfig();
      spawn('timec', ['thing', thing.name], {
        cwd,
        stdio: 'inherit',
      });
    }, time * oneMinute);
  };
  loop();
```
其中自动记录的方法比较简单，通过`spawn`执行`timec thing [newthing]`指令即可进行自动的事件记录

`playRemindAudio`中包含的就是播放预设音频的逻辑
### 播放声音
这个算是知识盲区，以前从来没有使用Node.js原生的API播放过音频

#### 系统指令
首先想到的方案就是通过`spawn`调用系统的指令播放音频

```js
spawn('mpg123', ['url.mp3');
```
这个是调用[mpg123](https://mpg123.org/)系统指令

linux操作系统安装指令如下
```sh
sudo apt-get install mpg123
```
调用系统指令播放音乐，比较有局限性，常见操作系统有3种，不一定所有操作系统都支持一样的指令

如果使用此种方式就需要调研目标平台，装机就默认支持的指令

#### 现存NPM包
这个问题肯定不是开发者第一次遇见，肯定是有前辈们遇到过，通过搜索引擎检索，pick了下述两个：
* [play](https://github.com/Marak/play.js#readme)
* [audio-play](https://www.npmjs.com/package/audio-play)

首先是第一个,API 比较简单，通过[查看源码](https://github.com/Marak/play.js/blob/d3ca7a04d1bd58c3ad72df3088f92985742e41cc/lib/play.js#L54)，实际上他也是调用系统指令播放
```js
const play = require('play/lib/play');

play.sound('filepath.wav');
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyOTczMTE1Mjk1MA==629731152950)

其次是`audio-play`,需要配合`audio-loader`使用
```js
const audioPlay = require('audio-play');
const audioLoad = require('audio-loader');
audioLoad('filepath.wav').then((v) => {
  audioPlay(v);
});
```
在`mac`上测试播放正常，在linux上依旧无法正常播放

#### 使用系统蜂鸣器
这个就比较简单，执行下面代码即可，但是在我的linux上测试仍然无效，emmmm裂开了
```js
process.stdout.write('\x07')
```

#### TODO
整理一篇Node.js播放音频的干货实践文章，目标3端通用一个API

## 最后
由于每天空闲时间有限，本文就先到这，下一期将继续完善`timec page`指令

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

