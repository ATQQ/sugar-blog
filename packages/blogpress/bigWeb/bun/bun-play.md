---
cover: https://img.cdn.sugarat.top/mdImg/MTY3MzUzNzQ5ODY5NQ==673537498695
description: 解决安装 Bun 的网络问题，bun 管理 npm 镜像源切换，monorepo 依赖的处理
tags: Bun
---
# Bun 使用实践&经验分享

## 前言

最近在搞一个新项目：AI 给取的名：`echo-trails`

>“echo” 可以象征着记忆的回响，过去的经历像回声一样在这些 “trails” 上徘徊，每当走过，就能听到记忆的声音。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/d44bf0073b3c1b0d35ea75bacfae2c36)

*搞完再放出来开源，感兴趣的可以猜猜是什么项目！*

想着新项目就用一下当下比较新的技术栈，运行时这部分就选了 [Bun](https://bun.sh/) "all-in-one toolkit"。

下面就分享一下遇到的问题和解决方案。

## 安装 Bun 镜像源切换

第一个问题就是安装 Bun 咯。

官方给到了一键安装的 Shell，但有众所周知的网络原因，安装不一定顺利。

```sh
curl -fsSL https://bun.sh/install | bash
```

**当然如果你已经有 Node.js 环境的话，可以直接用 npm 安装，就不用看这一节了：**

```sh
npm install -g bun
```

笔者的话本地有🪜，安装还相对比较顺利，但在服务端的话就一直超时，下面讲讲怎么解决的：

① 安装脚本的获取

访问 `https://bun.sh/install` 将脚本保存下来，比如就叫 `bun_install.sh`。

如果这一步访问就卡主可以去官方 GitHub 仓库获取安装脚本：[src/cli/install.sh](https://github.com/oven-sh/bun/blob/aa60ab3b6542117d4d95288495779fc604166c7c/src/cli/install.sh)

② 修改获取安装包的镜像源

阅读 Shell 脚本发现，[125 - 129 行](https://github.com/oven-sh/bun/blob/aa60ab3b6542117d4d95288495779fc604166c7c/src/cli/install.sh#L125-L129) 有如下代码：

```sh
if [[ $# = 0 ]]; then
    bun_uri=$github_repo/releases/latest/download/bun-$target.zip
else
    bun_uri=$github_repo/releases/download/$1/bun-$target.zip
fi
```
可以看到默认从 GitHub Releases 下载安装包。

咱们只需要把这个变量的值改成镜像源上的地址即可

```sh
# 在上述脚本代码后加入
bun_uri=镜像源地址
```

这里可以使用淘宝的二进制文件镜像源：https://registry.npmmirror.com/binary.html

比如 [bun-v1.1.36](https://registry.npmmirror.com/binary.html?path=bun/bun-v1.1.36/)

![](https://cdn.upyun.sugarat.top/mdImg/sugar/5f5e81ea4814192b26a51ffec327c3d6)

该选择哪个文件呢？

结合脚本上下文，可以看到确认版本的核心逻辑如下
```sh
platform=$(uname -ms)

case $platform in
'Darwin x86_64')
    target=darwin-x64
    ;;
'Darwin arm64')
    target=darwin-aarch64
    ;;
'Linux aarch64' | 'Linux arm64')
    target=linux-aarch64
    ;;
'MINGW64'*)
    target=windows-x64
    ;;
'Linux x86_64' | *)
    target=linux-x64
    ;;
esac
```
咱们只需要运行 `uname -ms` 命令，然后根据输出选择对应的安装包即可。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/08771c1316caba9550bfea08de3d470c)

*又学到一手！*

找到对应版本后，复制对应地址回填即可。

```sh
bun_uri=https://registry.npmmirror.com/-/binary/bun/bun-v1.1.36/bun-linux-x64.zip
```
最后手动执行安装脚本
```sh
bash bun_install.sh
```

## npm 镜像源切换

参考文章 [Override the default npm registry for bun install](https://bun.sh/guides/install/custom-registry)

创建`bunfig.toml`文件，内容如下：

```toml
[install]
# 设置为淘宝源
registry = "https://registry.npmmirror.com"
```

然后 `bun install` 就快起来了。

## monorepo

Bun 官方也内置了 monorepo workspace 管理的方案，[Configuring a monorepo using workspaces with Bun](https://bun.sh/guides/install/workspaces)。

只需要在 package.json 中配置 `workspaces` 字段，指定子包目录即可。
```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

同样也支持 `workspace` 协议

```json
{
  "name": "stuff-b",
  "dependencies": {
    "stuff-a": "workspace:*"
  }
}
```
## 最后

后面遇到了其它坑也持续在这里记录一下。