---
description: 终端启动时总会卡顿一下，没去探究原因，看到咲奈的分享才知道是nvm在作祟
cover: https://img.cdn.sugarat.top/mdImg/MTY3NjE4NTM2MDkyOQ==676185360929
tag:
 - 技术笔记
---

# 安装nvm后终端启动变慢,更快的Node版本管理工具推荐

## 先看安装前后对比
安装前

![](https://img.cdn.sugarat.top/mdImg/MTY3NjE4NDI1OTY0OA==676184259648)


安装后

![](https://img.cdn.sugarat.top/mdImg/MTY3NjE4NDgwNjAzMA==676184806030)

可以看到有明显的卡顿

## 如何解决
将 NVM 初始化的逻辑放入函数中，使用时才调用

```sh
nvm() {// [!code ++]
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
}// [!code ++]
```

方法来源 [咲奈的平行时空](https://public.zsxq.com/groups/28851452458181.html)

![](https://img.cdn.sugarat.top/mdImg/MTY3NjE4NTM2MDkyOQ==676185360929)

**带来的影响**

emm 用Node的话需要手动执行一下`nvm` 进行初始化，不是很优雅

下面介绍几个可平替 NVM 的工具，非常的赞

## 使用其它更快的工具
### [volta](https://volta.sh/)
基于 Rust 实现的，除了Node版本外还支持其它的

安装
```sh
curl https://get.volta.sh | bash
```

安装 Node
```sh
# install latest
volta install node
# or
volta install node@16
```

### [fnm](https://github.com/Schniz/fnm)
也是一个 基于 Rust的 Node 包管理工具

安装
```sh
curl -fsSL https://fnm.vercel.app/install | bash
```

安装 Node
```sh
fnm install --latest

fnm install 14
```

### [pnpm](https://pnpm.io/zh/cli/env)
没错`pnpm` 可以安装Node包

```sh
pnpm env use --global latest
```

安装 v16 的Node.js

```sh
pnpm env use --global 16
```

## 最后
笔者试用了下最后选择了`volta`

不仅仅支持 node 版本管理，还支持其它全局包的管理

功能非常的多（比如 根据项目里Node版本要求，自动切换）

![](https://img.cdn.sugarat.top/mdImg/MTY3NjE4OTM5MTk2Mg==676189391962)