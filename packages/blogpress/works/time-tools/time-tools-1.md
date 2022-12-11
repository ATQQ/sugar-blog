---
title: 做一个CL版的时间管理工具（一）
date: 2021-08-03
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（一）

## 背景
时间管理一直是一个令人头痛的问题

笔者用过许多款图形化时间管理/TODO 工具

没有一款非常满意且又不可替代的

常见的图形化软件（桌面终端/移动端）的简单操作流程如下：
* 打开软件（一顿点击操作）
* 功能选择（一顿点击操作）
  * 定位到目标功能
* 选择新增/删除/编辑
* 一顿输出
* 保存

感觉稍微有些繁琐

目前发现痛点也比较明显，大部分是统计TODO的形式：
* 一个TODO可能是多天多次断断续续完成的
* 一段时间会进行多种任务，任务过程中随时可能会被打断
  * 利用计时工具，难免会忘记计时，这样无法较准确的统计每个任务的具体耗时
* 周报/月报 都要输出技术/业务/其它的耗时 此时需要手动去统计
  * 时间短还好
  * 时间长的话费神费力
* 。。。还有一些其它的这里就不赘述了

## 方案
Coder 除了图形化编辑器用得多外，**其次应该就是终端工具**了

一般打开终端工具都是有快捷键的

设想通过一个简单的指令就能完成时间统计，时间记录，可视化数据生成，记录TODO，周报/月报/日报生成....more

## 期望

添加TODO
```sh
timec add <taskName>
```

完成TODO
```sh
timec fin <taskName>
```

开始TODO
```sh
timec start <taskName>
```

暂停
```sh
timec pause <taskName>
```

.... 还有很多想法指令，只差时间，这里不再赘述，做出来了再和大伙儿接着分享

## 开工
### 准备工作
初始化项目
```sh
mkdir timec

cd timec

npm init -y
```

安装依赖`commander`
```sh
yarn add commander
```
修改`package.json`内容，添加`bin`部分的内容
```json
{
  "name": "time-control",
  "version": "0.0.0",
  "description": "生成自己的时间管理报告",
  "main": "index.js",
  "directories": {
    "test": "test"
  },
  "bin": {
    "timec": "./bin/index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ATQQ/time-control.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ATQQ/time-control/issues"
  },
  "homepage": "https://github.com/ATQQ/time-control#readme",
  "dependencies": {
    "commander": "^6.2.1"
  }
}
```

创建`./bin/index.js`文件,键入demo内容
```js
#!/usr/bin/env node
console.log('hello world');
```

运行demo
```sh
npm link

# 执行
timec
```

输出结果

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNzkxMTcyMTM0Mg==627911721342)


### 初步路径
将内容组织成MD文档的形式

通过脚本将MD内容解析成一个`JSON对象`

最终统计数据，生成各种报告都了若指掌

### Markdown格式
```markdown
# 2021-08-01
## 任务1
* a组件 0.2
* b组件 0.3

## 任务2
* 熟悉代码 0.1
* 学习xx使用 0.2

## 其它
* 学习Vue 0.1
* 写笔记 0.1

# 2021-08-02
## 任务1
* a组件 0.2
* b组件 0.3

## 任务2
* 熟悉代码 0.1
* 学习xx使用 0.2

## 其它
* 学习Vue 0.1
* 写笔记 0.1
```
* 一级标题设置时间
* 耳机标题标识任务
* 剩下的就是描述具体的任务跟用时
  * 这里的用时并不固定单位，由使用者自己定义
    * 可以是小时/分钟/甚至一天的几分之几

生成的JSON结构如下
```json
[
  {
    "title": "2020-12-23",
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
      {
        "title": "任务2",
        "things": [
          {
            "time": "0.1",
            "content": "熟悉代码"
          },
          {
            "time": "0.2",
            "content": "学习xx使用"
          }
        ]
      },
      {
        "title": "其它",
        "things": [
          {
            "time": "0.1",
            "content": "学习Vue"
          },
          {
            "time": "0.1",
            "content": "写笔记"
          }
        ]
      }
    ]
  }
]
```

有了这个JSON结构我们就可以为所欲为了

## 其它
由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或先关注一下[仓库](https://github.com/ATQQ/time-control)

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

# 做一个CLI版的时间管理工具（一）

## 背景
时间管理一直是一个令人头痛的问题

笔者用过许多款图形化时间管理/TODO 工具

没有一款非常满意且又不可替代的

常见的图形化软件（桌面终端/移动端）的简单操作流程如下：
* 打开软件（一顿点击操作）
* 功能选择（一顿点击操作）
  * 定位到目标功能
* 选择新增/删除/编辑
* 一顿输出
* 保存

感觉稍微有些繁琐

目前发现痛点也比较明显，大部分是统计TODO的形式：
* 一个TODO可能是多天多次断断续续完成的
* 一段时间会进行多种任务，任务过程中随时可能会被打断
  * 利用计时工具，难免会忘记计时，这样无法较准确的统计每个任务的具体耗时
* 周报/月报 都要输出技术/业务/其它的耗时 此时需要手动去统计
  * 时间短还好
  * 时间长的话费神费力
* 。。。还有一些其它的这里就不赘述了

## 方案
Coder 除了图形化编辑器用得多外，**其次应该就是终端工具**了

一般打开终端工具都是有快捷键的

设想通过一个简单的指令就能完成时间统计，时间记录，可视化数据生成，记录TODO，周报/月报/日报生成....more

## 期望

添加TODO
```sh
timec add <taskName>
```

完成TODO
```sh
timec fin <taskName>
```

开始TODO
```sh
timec start <taskName>
```

暂停
```sh
timec pause <taskName>
```

.... 还有很多想法指令，只差时间，这里不再赘述，做出来了再和大伙儿接着分享

## 开工
### 准备工作
初始化项目
```sh
mkdir timec

cd timec

npm init -y
```

安装依赖`commander`
```sh
yarn add commander
```
修改`package.json`内容，添加`bin`部分的内容
```json
{
  "name": "time-control",
  "version": "0.0.0",
  "description": "生成自己的时间管理报告",
  "main": "index.js",
  "directories": {
    "test": "test"
  },
  "bin": {
    "timec": "./bin/index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ATQQ/time-control.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ATQQ/time-control/issues"
  },
  "homepage": "https://github.com/ATQQ/time-control#readme",
  "dependencies": {
    "commander": "^6.2.1"
  }
}
```

创建`./bin/index.js`文件,键入demo内容
```js
#!/usr/bin/env node
console.log('hello world');
```

运行demo
```sh
npm link

# 执行
timec
```

输出结果

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNzkxMTcyMTM0Mg==627911721342)


### 初步路径
将内容组织成MD文档的形式

通过脚本将MD内容解析成一个`JSON对象`

最终统计数据，生成各种报告都了若指掌

### Markdown格式
```markdown
# 2021-08-01
## 任务1
* a组件 0.2
* b组件 0.3

## 任务2
* 熟悉代码 0.1
* 学习xx使用 0.2

## 其它
* 学习Vue 0.1
* 写笔记 0.1

# 2021-08-02
## 任务1
* a组件 0.2
* b组件 0.3

## 任务2
* 熟悉代码 0.1
* 学习xx使用 0.2

## 其它
* 学习Vue 0.1
* 写笔记 0.1
```
* 一级标题设置时间
* 耳机标题标识任务
* 剩下的就是描述具体的任务跟用时
  * 这里的用时并不固定单位，由使用者自己定义
    * 可以是小时/分钟/甚至一天的几分之几

生成的JSON结构如下
```json
[
  {
    "title": "2020-12-23",
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
      {
        "title": "任务2",
        "things": [
          {
            "time": "0.1",
            "content": "熟悉代码"
          },
          {
            "time": "0.2",
            "content": "学习xx使用"
          }
        ]
      },
      {
        "title": "其它",
        "things": [
          {
            "time": "0.1",
            "content": "学习Vue"
          },
          {
            "time": "0.1",
            "content": "写笔记"
          }
        ]
      }
    ]
  }
]
```

有了这个JSON结构我们就可以为所欲为了

## 其它
由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或先关注一下[仓库](https://github.com/ATQQ/time-control)

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

