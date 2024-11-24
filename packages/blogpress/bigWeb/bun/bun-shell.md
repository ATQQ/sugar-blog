---
description: JavaScript 是世界上最流行的脚本语言。那么为什么在 `JavaScript` 中执行 `Shell` 脚本很困难呢？Bun 又是怎么解决这个问题的？
date: 2024-01-29
tags: Bun
---

# 译：使用 Bun 执行 Shell 脚本
>原文地址（Bun Blog）： https://bun.sh/blog/the-bun-shell 
><br/>作者： [jarredsumner](https://twitter.com/jarredsumner)
><br/>发布时间：2024-01-20

## 前言
`JavaScript` 是世界上最流行的脚本语言。

那么为什么在 `JavaScript` 中执行 `Shell` 脚本很困难呢？

```ts
import { spawnSync } from 'child_process'

// 代码比想象中要稍微复杂一些
const { status, stdout, stderr } = spawnSync('ls', ['-l', '*.js'], {
  encoding: 'utf8',
})
```

你也可以使用内置的 API 来执行类似的操作：

```ts
import { readdir } from 'fs/promises';

(await readdir('.', { withFileTypes: true })).filter(a =>
  a.name.endsWith('.js'),
)
```

但是，还是没有 shell 脚本简单：
```sh
ls *.js
```
## 为什么现有的 shell 无法在 JavaScript 中运行

`bash` 和 `sh` 等这些 `shell` 工具已经存在几十年了。

但是，为什么它们在 `JavaScript` 中不能很好的工作？

`macOS (zsh)`、`Linux (bash)` 和 `Windows (cmd)` 的 shell 都有所不同，具有不同的语法和不同的命令。每个平台上可用的命令都不同，甚至相同的命令也可能有不同的可选参数和行为。

迄今为止，`npm` 的解决方案是依靠社区用 `JavaScript` 实现来填补缺失的命令。

### rm -rf 不适用于 Windows

[rimraf](https://www.npmjs.com/package/rimraf) 是 `rm -rf` 指令的跨平台实现，每周下载 6000 万次：

![](https://img.cdn.sugarat.top/mdImg/sugar/4be77f54128dc01fe235bf46be65dfd0)

### `FOO=bar <script>` 设置环境变量在 Windows 上不生效

不同平台上设置环境变量的方式略有不同。如果不使用 `FOO=bar` 这种方式，那就是使用 [cross-env](https://www.npmjs.com/package/cross-env) 

![](https://img.cdn.sugarat.top/mdImg/sugar/654ccf7364bc395e6699f33dbe05bc8c)

### which 在 Windows 上是 where

于是另一个周下载量 6000w 的包诞生了：

![](https://img.cdn.sugarat.top/mdImg/sugar/ba91ab9eb9713c5484c09a6bd62f96a5)

## shell 启动时间也有一点长
创建一个 `shell` 执行需要多久？

在 Linux x64 Hetzner Arch Linux 机器上，大约需要 7ms：

```sh
$ hyperfine --warmup 3 'bash -c "echo hello"' 'sh -c "echo hello"' -N

Benchmark 1: bash -c 'echo hello'
  Time (mean ± σ):       7.3 ms ±   1.5 ms    [User: 5.1 ms, System: 1.9 ms]
  Range (min … max):     1.7 ms …   9.4 ms    529 runs

Benchmark 2: sh -c 'echo hello'
  Time (mean ± σ):       7.2 ms ±   1.6 ms    [User: 4.8 ms, System: 2.1 ms]
  Range (min … max):     1.5 ms …   9.6 ms    327 runs
```

如果只是想运行单个命令，但是启动 `shell` 可能比运行命令本身花费更长的时间。如果需要在循环中运行许多命令，那么成本就会升高。

你可以尝试嵌入 `shell`，但这样就复杂了，而且它们的许可证可能与你的项目不兼容。

## 这些 polyfill 真的必要吗？

在 2009 - 2016 年的里，`JavaScript` 还相对较新且处于实验阶段时，依靠社区来填补缺失的功能是很合理的。但现在已经是 2024 年了。`JavaScript` 已在广泛的使用于服务端开发了。如今，`JavaScript` 生态系统对需求的理解与 2009 年时完全不同了。

我们其实可以做得更好。

## 介绍一下 Bun Shell

`Bun Shell` 是 `Bun` 提供的一种新的实验性的嵌入式语言和解释器，支持使用 `JavaScript` 和 `TypeScript` 编写跨平台运行的 `shell` 脚本。

```ts
import { $ } from 'bun'

// 直接在终端里输出
await $`ls *.js`

// 转为字符串变量
const text = await $`ls *.js`.text()
```
同时允许你使用 `JavaScript` 变量：

```ts
import { $ } from 'bun'

const resp = await fetch('https://example.com')

const stdout = await $`gzip -c < ${resp}`.arrayBuffer()
```

出于安全问题考虑，所有模板变量都将被转义：

```ts
const filename = 'foo.js; rm -rf /'

// 将会执行指令 `ls 'foo.js; rm -rf /'`
const results = await $`ls ${filename}`

console.log(results.exitCode) // 1
console.log(results.stderr.toString()) // ls: cannot access 'foo.js; rm -rf /': No such file or directory
```

使用 `Bun Shell` 感觉就像普通的 `JavaScript`。允许你将标准输出放入 `buffers` 中：

```ts
import { $ } from 'bun'

const buffer = Buffer.alloc(1024)

await $`ls *.js > ${buffer}`

console.log(buffer.toString('utf8'))
```

你也可以将输出结果直接写入文件：
```ts
import { $, file } from 'bun'

// 当做文件输出
await $`ls *.js > ${file('output.txt')}`

// 或者文件路径字符串
await $`ls *.js > output.txt`
await $`ls *.js > ${'output.txt'}`
```

你还可以将输出结果通过管道运算符传递给其它命令：

```ts
import { $ } from 'bun'

await $`ls *.js | grep foo`
```

你甚至可以使用 `Response` 作为标准输入：

```ts
import { $ } from 'bun'

const buffer = new Response('bar\n foo\n bar\n foo\n')

await $`grep foo < ${buffer}`
```

可使用 `cd`、`echo` 和 `rm` 等内置命令：

```ts
import { $ } from 'bun'

await $`cd .. && rm -rf node_modules/rimraf`
```

它可在 `Windows`、`macOS` 和 `Linux` 上运行。我们实现了许多常用命令和功能，如`通配符`、`环境变量`、`重定向（redirection）`、`管道（piping）`等。

它被设计为简单 `shell` 脚本的替代品。在 `Windows` 版 `Bun` 中，它将为 `bun run` 中的 `package.json` “脚本”提供支持。

为了更有趣一点，您还可以将它用作独立的 shell 脚本解释器：

```sh
echo "cat package.json" > script.bun.sh
bun script.bun.sh
```

## 如何安装？

`Bun Shell` 内置于 `Bun` 中。如果已经安装了 `Bun v1.0.24` 或更高版本，那么你就可以使用它：

```sh
bun --version
1.0.24
```

如果你没有安装`Bun`，可以使用`curl`安装：
```sh
curl -fsSL https://bun.sh/install | bash
```

或者使用 npm :
```sh
npm install -g bun
```

## 使用实践
创建 `test.ts` 文件，写入如下代码
```ts
import { $ } from 'bun'

await $`echo hello world`

const files = await $`ls *.js *.mjs`.text()

console.log(files.split('\n'))
```

运行脚本
```sh
bun test.ts
```

[运行结果](https://app.warp.dev/block/VLbnk6T4x6rCSVZT2uwWs7) 如下

![](https://img.cdn.sugarat.top/mdImg/sugar/1ad4e2f3727b32803ee4ce3b458ee21f)