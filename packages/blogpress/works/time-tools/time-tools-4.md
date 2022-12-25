---
title: 做一个CL版的时间管理工具（四）
date: 2021-08-05
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（四）

## 前言
[上一篇文章](./time-tools-3.md)主要阐述了：
* 批量markdown转json逻辑
* 合并多个md的中记录的内容，并按时间排序

本文将详细介绍的开发:
* 初始化项目模板指令：`timec init <projectName>`
* 初始化记录模板指令：`timec create <filename>`

## 功能开发
### 初始化模板项目
#### 简述
用户输入简单的指令，就可以自动创建出一个时间管理模板工程

模板工程结构如下
```sh
project
├── README.md
├── study
|  └── README.md
└── work
   └── README.md
```

#### 工作流程
1. 终端输入指令
2. 获取到指令执行目录（cmd）与用户输入的项目名称
3. 利用`existsSync`判断目录是否存在
   1. 目录不存在的，利用`fs.mkdirSync`创建目录
4. 通过`fs.writeFileSync`创建文件，将文件写入到用户的当前目录下
   1. 文件内容来源于指定静态资源目录（相对路径）

#### 实现
注册`init`指令：
1. 使用`commander.command`API注册
2. 从action回掉中拿到 设置的`<projectName>`参数
```js
/**
 * 初始化项目
 */
commander.command("init <projectName>")
    .alias('i')
    .description('init project')
    .action((projectName) => {
        if (initProject(cwd, projectName)) {
            console.log(`初始化 ${projectName} 成功`);
            return
        }
        console.log(`${projectName} 已存在`);
    })
```
接下来是具体的`initProject`逻辑:
* cmd：`process.cwd()`指令执行目录
* projectName：用户输入的项目名

1. 判断目标目录是否存在
   1. 不存在则创建
   2. 存在则抛出`已经存在`警告
2. 将模板文件的内容先读入
3. 通过`createDir`方法创建目录
4. 通过`createFile`方法将内容写到目标目录


```js
const path = require('path')
// 静态资源目录
const assetsDir = path.resolve(__dirname, 'assets')

const readmeContent = getFileContent(path.resolve(assetsDir, 'README.md'))
const demoContent = getFileContent(path.resolve(assetsDir, 'demo.md'))

/**
 * 初始化一个模板项目
 * @param {string} cwd 项目目录
 * @param {string} projectName 项目名称
 */
function initProject(cwd, projectName) {
    const dir = path.resolve(cwd, projectName)
    // 创建目录
    if (createDir(dir)) {
        createFile(path.resolve(dir, 'README.md'), readmeContent)

        createDir(path.resolve(dir, 'work'))
        createDir(path.resolve(dir, 'study'))

        createFile(path.resolve(dir, 'work', 'README.md'), demoContent)
        createFile(path.resolve(dir, 'study', 'README.md'), demoContent)
        return true
    }

    return false
}

/**
 * 创建一个不存在的目录
 * @param {string} path 
 */
function createDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true })
        return true
    }
    console.error(`${path} 已存在`);
    return false
}
```

这样初始化一个模板项目的流程就完成了

### 初始化记录模板
有模板项目就有模板文件

这部分主要阐述生成模板文件的流程

首先注册`create <filename>` 指令
```js
/**
 * 创建一个时间记录模板文件
 */
commander.command("create <filename>")
    .alias('c')
    .description('create template note file')
    .action((filename) => {
        if (createTemplateFIle(cwd, filename)) {
            console.log(`${filename} 创建成功`);
            return
        }
        console.log(`${filename} 已存在`);
    })
```
主要逻辑是`createTemplateFIle`方法里

这里的思路就比较简单，因为创建模板文件的目录默认是指令命令的目录

一行代码就搞定文件的写出
```js
/**
 * 初始化一个模板记录文件
 * @param {string} cwd 文件目录
 * @param {string} filename 文件名称
 */
function createTemplateFIle(cwd, filename) {
    return createFile(path.resolve(cwd, filename), demoContent)
}
```

### 本期效果
![图片](https://img.cdn.sugarat.top/mdImg/MTYyODE3NDI1NTI1Mg==timec4.gif)

## 其它
**下一期根据已有的功能整个周报生成**(鸽了一期)

由于每天空闲时间有限，本文就先到这

如果读者还感觉意犹未尽，敬请期待后续更新，或先关注一下[仓库](https://github.com/ATQQ/time-control)

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

