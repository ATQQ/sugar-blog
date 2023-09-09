---
outline: [2,3]
cover: https://img.cdn.sugarat.top/mdImg/MTY5MTMxNzA1MDQ0OA==691317050448
description: 本文简单介绍了如何通过`Shell`和`Node.js`实现复制当前分支名到剪贴板
tags:
 - CLI
 - 技术笔记
---
# 如何优雅的复制当前项目分支名

**省流版: `npx bcy`**

## 前言
在工作中，协作场景下，避免不了要告诉同事你当前的开发分支，**通常情况**下需要2步

**Step1 查看当前分支**
```sh
git branch
```

这里还有个case，分支多的话需要翻页查看，才能找到当前分支

![](https://img.cdn.sugarat.top/mdImg/MTY5MTI0NTYxOTQzMw==691245619433)

要准确获取需要加上`--show-current`参数

```sh
git branch --show-current
```

![](https://img.cdn.sugarat.top/mdImg/MTY5MTI0NTc5MDM2OQ==691245790369)

**Step2 鼠标右键复制当前分支**

---

本文将会介绍2种方式，实现1行代码直接复制分支

* Shell
* Node CLI

## 核心步骤
### 获取分支名
这个上面介绍了，可以通过`git branch --show-current`获取

在 `shell` 里，可以直接将结果存到变量里

```sh
# bcp.sh
branch=$(git branch --show-current)
echo $branch
```

![](https://img.cdn.sugarat.top/mdImg/MTY5MTMwNDE3MDkzNg==691304170936)


`Node.js` 里，可以通过`child_process`模块来执行命令

```js
const { execSync } = require('child_process');
const branch = execSync('git branch --show-current').toString().trim();
console.log(branch);
```

![](https://img.cdn.sugarat.top/mdImg/MTY5MTMwNDU1NTQ2Nw==691304555467)

### 复制到剪贴板
这一块就是调用系统指令执行了，不同操作系统的不一样

之前用过 [node-copy-paste](https://github.com/xavi-/node-copy-paste#readme) 这个库

大概介绍了一下各个操作系统所用的指令：MacOS(pbcopy)、Windows(clip)、Linux(xclip)

![](https://img.cdn.sugarat.top/mdImg/MTY5MTMwNDc4MTIwMQ==691304781201)

这里笔者用的是`MacOS`，所以直接用`pbcopy`指令

只需要在上面的基础上加上`| pbcopy`即可

```sh
branch=$(git branch --show-current)
echo $branch | pbcopy
# 或
git branch --show-current | pbcopy
```

运行后发现`git branch --show-current`获取的内容会有换行符，可以通过`tr`指令去掉

```sh
git branch --show-current | tr -d '\n' | pbcopy
```

Node.js 里，在`.trim()`后加上`.replace(/\n/g, '')`即可

```js
execSync('git branch --show-current').toString().trim().replace(/\n/g, '');
```

不过实际情况下，我们需要将这么长的指令封装起来，方便使用

*谁没事敲这么多，都可以手动CV好多遍了*
## 封装实现
### Shell
只需要使用`alias`指令即可

```sh
alias bcy='git branch --show-current | tr -d "\n" | pbcopy'
```

然后将这个指令加入到`~/.zshrc`或`~/.bashrc`里即可（可以使用 `echo $0`确定自己的终端默认的shell执行器）

可运行下面的shell脚本完成自动添加
```sh
echo 'alias bcy="git branch --show-current | tr -d \"\\n\" | pbcopy"' >> ~/.zshrc
```
重启终端，或者使用`source ~/.zshrc`使其生效

```sh
source ~/.zshrc
```

![](https://img.cdn.sugarat.top/mdImg/MTY5MTMwNzY2OTU1MA==691307669550)

当然我们也可以打印一些提示信息

```sh
alias bcy='branch=$(git branch --show-current); echo "当前分支：$branch"; echo $branch | tr -d "\n" | pbcopy'
```
对应的安装脚本如下
```sh
echo "alias bcy='branch=\$(git branch --show-current); echo \"当前分支：\$branch\"; echo \$branch | tr -d \"\\\\n\" | pbcopy'" >> ~/.zshrc
```

![](https://img.cdn.sugarat.top/mdImg/MTY5MTMwODMzMTk2NA==691308331964)

![](https://img.cdn.sugarat.top/mdImg/MTY5MTMxNzA1MDQ0OA==691317050448)
### Node CLI
上面介绍的是`shell`里的实现，这里介绍下`Node.js`里的实现

方便有 Node 环境，但不熟悉Shell的同学使用

脚本也很简单
```js
#!/usr/bin/env node
const { execSync } = require('child_process')
const ncp = require('copy-paste')

// 获取当前仓库分支
const branch = execSync('git branch --show-current')
  .toString()
  .trim()
  .replace(/\n/g, '')

console.log('当前分支:', branch)

ncp.copy(branch)
``` 

这个CLI通过npm包发布了，可以直接`npx bcy`使用

或者 `npm i bcy -g` 全局安装

![](https://img.cdn.sugarat.top/mdImg/MTY5MTMyMTU1NjY2MQ==691321556661)

*包名实在是难取，简单语义化一点的都被占用了，让GPT 辅助了一下*

![](https://img.cdn.sugarat.top/mdImg/MTY5MTI0NTI4NDAxNQ==691245284015)

最后用了搜了一圈不重复的只有`bcy`

## 总结

本文简单介绍了如何通过`Shell`和`Node.js`实现**复制当前分支名到剪贴板**

如果你有更好的实现方式，欢迎留言讨论

源码地址：[bcy](https://github.com/ATQQ/tools/tree/main/packages/cli/bcy)