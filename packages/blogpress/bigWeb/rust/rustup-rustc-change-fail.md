---
tags: Rust
---
# 记一下 rustup 切换 rustc 版本不生效的问题

省流：homebrew 和 rustup 安装 rustc 的冲突，卸载 homebrew 安装的 `rustc` 即可解决。

```sh
brew uninstall rust
```

## 问题描述

准备尝鲜一下 [tauri](https://tauri.app/) 开发移动端应用，启动就卡在了第一步 `rustc` 版本不正确的问题。

按照官方文档安装 rustup 后，参照网上的经验 Rust: [使用rustup管理rustc版本](https://juejin.cn/post/7409958235279441970)
```sh
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

安装并设置稳定版
```sh
rustup install stable

rustup default stable
```

奇怪的是 `rustup toolchain list` 已经是当下最新的 1.82.0

但运行 `rustc -V` 还是 1.64.0。

尝试卸载这个版本，也会提示这个版本不存在。

```sh
rustup toolchain uninstall 1.64.0
```

## 解决
折腾了一会儿我想是不是很久之前使用其它方式安装过 rustc 导致上述操作不符合预期。

我用`which` 查看了一下 rustc 的执行位置。

```sh
which rustc
```

发现其目录是 homebrew 安装的 rustc，并不是 rustup 安装的 rustc。

恍然大悟，应该是环境变量先后的问题，使用 brew 卸载之前的版本后 rustc 位置就正常了。

```sh
brew uninstall rust
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/c6ff1b4d27d9aabddd15cb9aae704528)