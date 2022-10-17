---
title: NodeCLI工具原理解析
date: 2022-10-17
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# Node CLI工具原理解析

本文将主要介绍CLI相关周边知识，附带可执行demo，通过本文读者可以了解到`npm`注册全局指令的工作原理以及Node CLI的工作原理。

## 前言
>CLI(Command-Line Interface) 命令行界面

搞开发的同学，或多或少的都会接触到许多的命令行工具。

有生产力工具，也有有意思的小玩意、自动化任务处理等等。

命令行工具的安装方式就很多了。

`win`上大部分是通过软件安装包安装，安装同时会通过`环境变量`配置相关指令。

`linux`和`mac`上就比较丰富了，前者常用`yum`和`api-get`、mac 上就`brew`。

也有使用`wget`和`curl`拉取相关工具的`shell`脚本执行安装。

说了这么多工具，都不是本文要讲的工具，前端搬砖当然首选`node`，然后基于`npm`做包的分发。

*PS：文中的示例都以`mac`为主*

## 可执行shell
`unix`系上大部分可执行文件都是基于`shell`的脚本。

比如随手写个`hello world`

文件名`hello`,内容如下
```sh
echo "Hello world"
```
![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTkwNjg1MjMwNQ==665906852305)

此时我们直接执行是会提醒没有执行权限，我们为当前用户加1个可执行权限
```sh
chmod u+x hello
```
然后再当前目录执行，就看到输出结果了
```sh
./hello
```
![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTkwNzgzMTQ1OA==665907831458)

## 注册全局指令
为了使“指令”在全局任意位置都能被使用，就需要做相关操作了。

### 环境变量
相信大多数首次接触这个词的朋友都在`win`上深有体会。装`JDK`、`MySQL`时都避免不了有配置的操作。

如果想在其它目录直接执行`hello`就生效呢？那这就离不开环境变量配置了

咱们先看终端用的`shell`工具是什么。
```sh
echo $0
```
我这里使用的是`zsh`,其它的常见的还有`bash`

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTkwODA4MDA1NA==665908080054)

相应的配置文件分别是`.zshrc`和`.bashrc`

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTkwODIzNDg1Mw==665908234853)

### alias指令
**使用 alias指令设置别名**

指令格式
```sh
alias <别名>=<指令或可执行文件路径>
```

添加内容如下
```sh
alias hello=/Users/sugar/Documents/diy-cli/hello
```

立即生效配置
```sh
source ~/.zshrc
```

### export指令
**使用export命令添加添加相关目录**

指令格式
```sh
export PATH=$PATH:<路径 1>:<路径 2>:<路径 N>
```

添加内容如下
```sh
export PATH=$PATH:/Users/sugar/Documents/diy-cli
```

以上2种方案都能达到目标的效果

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTkwOTgzNDM0NQ==665909834345)

如果每个工具都单独配一条规则。那会导致相关配置文件非常的庞大，也不方便维护。

实际上我们在用`npm i -g`安装的全局包的时候，并没有手动配置。那么这个是如何做到的呢。这个就离不开下面将要说到的`符号链接`了

## 符号链接
>`软链接`类似于快捷方式，它可以指向任意文件系统中的一个文件或目录；硬链接也可以看作是文件或目录的快捷方式，但源文件删除了也不影响`硬链接`。

先通过`which npm`看一下npm所在位置

打印一下`$PATH`的值，可以看到`npm`指令对应文件所在目录就在其中

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTkxOTUwNzgzMQ==665919507831)

展开目录内容可以看到文件类型都是`l（软连接）`

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTkxOTgwODA1OQ==665919808059)

因此咱们可以小结出来 **通过向已添加到$PATH变量中的目录，直接创建短链可以实现指令的自动注册全局**

下面实践演示一下

### ln指令

**指令格式**
```sh
# 硬链接
ln source target
# 软连接
ln -s source target
```

接着上面之前的例子，再使用`export`完成对目录的添加后。咱们再随便建立个文件`hello2.sh`进行操作

内容如下
```sh
echo "Hello world2"
```

创建一个软链
```sh
ln -s <source>/hello.sh <target>/hello2
```
操作结果如下

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTkyMDk5MDQ3NA==665920990474)

前面代码都是简单的写的`shell`脚本

前端当然是羧`js`，咱们把代码改成js。

`hello.js`
```js
console.log('hello js')
```
按照前面的步骤，完成可执行权限添加和软链的创建。

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTkyMTQzOTg0Ng==665921439846)

结果可以预测是会报错的，默认会被当做`shell`脚本进行执行。

那么如何指定为使用`node`去执行这个文件？

这就是我们下文要说到的`hashbang`

## Hashbang
>`Hashbang`（也称为`Shebang`）是一个由井号和叹号构成的字符序列 #!，通常出现在文件开头，例如 `#!/usr/bin/env bash`

用于指定脚本的运行环境

于是，我们给前面的`hello.js`头部加上`#!/usr/bin/env node` 再次运行就成了

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTk3NjM5NTkyNQ==665976395925)

至此基本清楚了，如何将1个`js`脚本便捷的注册为1个全局可执行指令

## Node CLI
`node`官配包管理工具`npm`，通常每个项目中有一个`package.json`文件，用于描述项目的一些信息或者包含项目相关的配置内容

### 指令注册
其中`bin`属性用于设置`指令名称`和`执行脚本所在位置`
```json
{
    "name":"pkgName",
    "bin": {
        "command": "exec/filepath.js"
    }
}
```

使用`npm`安装依赖，会根据`bin`中的描述，创建1个`command`到`exec/filepath.js`的软链

软链所在目录区别于是否是`global`安装

这个目录可以通过`npm bin`指令查看

![图片](https://img.cdn.sugarat.top/mdImg/MTY2NTk3NzgzMzUyOQ==665977833529)

### 命令行参数


<comment/>