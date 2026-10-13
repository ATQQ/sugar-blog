---
description: 只使用 Node.js 的标准库，不安装任何外部依赖，写一个命令行工具
---
# 译：使用现代的 Node.js 构建简单的CLI工具
>原文地址： https://evertpot.com/node-changelog-cli-tool/
><br/>作者： [Evert Pot](https://evertpot.com/)
><br/>发布时间：2023-02-13

**只使用 Node.js 的标准库，不安装任何外部依赖，写一个命令行工具。**

## 前言

作者是多个开源项目的维护者，长久以来都是手动维护项目的变更日志（`changelog`）。

下面是项目 [a12n-server](https://github.com/curveball/a12n-server/) 的变更日志示例：

```md
0.22.0 (2022-09-27)
-------------------

Warning note for upgraders. This release has a database migration on the
`oauth2_tokens` table. For most users this is the largest table, some
downtime may be expected while the server runs its migrations.

* #425: Using a `client_secret` is now supported with `authorization_code`,
  and it's read from either the request body or HTTP Basic Authorization
  header.
* The service now keeps track when issuing access tokens, whether those tokens
  have used a `client_secret` or not, which `grant_type` was used to issue them
  and what scopes were requested. This work is done to better support OAuth2
  scopes in the future, and eventually OpenID Connect.
* Fixed broken 'principal uri' in introspection endpoint response.
* OAuth2 service is almost entirely rewritten.
* The number of tokens issued is now displayed on the home page.
* Large numbers are now abbreviated with `K` and `M`.
* #426: Updated to Curveball 0.20.
* #427: Typescript types for the database schema are now auto-generated with
  `mysql-types-generator`.
```

内容使用`markdown`编写的。你可能会想：Git不是有 `commit` 日志吗？为什么要费力手写这个呢？

原因是它们的受众不一样。我希望让用户关注到相对重要的变更事项，并同时注意到变化对用户带来的影响。

我觉得写一个命令行工具来做这些事会更方便，维护多个项目（如此多的变更）也更容易一些。所以，[我就做了 changelog-tool](https://github.com/evert/changelog-tool)！如果你想知道这背后涉及了哪些技术选择，请接着往下阅读。

## 目标&特色

工具已支持的功能：
* 重新格式化日志（有点像美化）（ `changelog format` ）;
* 通过命令行添加一行日志（ `changelog add --minor -m "New feature"` ）;
* 自动设置发布日期（ `changelog release` ）;
* 将特定版本的日志导入标准输出，以便其他工具可以使用（例如与GitHub发布集成）。

我还有一些非功能性的需求：
* 使用最新的 `Node.js` 特性;
* 使用最新的 `JavaScript` 标准和特性（ESM）;
* 避免非必要的外部依赖；
* 低维护成本。

想立即找到这个工具吗？它是开源的，你只需访问 [Github](https://github.com/evert/changelog-tool)。

## 原理解析
### ESM & Typescript ESM

`ESM` 模块现在使用起来已经非常丝滑了。这是习惯上的一个小改变，但我一般建议是将文件保存为 `.mjs` 来使用 `ESM`。

下面是 `parse.mjs` 的前几行代码：

```js
import { readFile } from 'node:fs/promises'
import { Changelog, VersionLog } from './changelog.mjs'

/**
 * @param {string} filename
 * @returns {Promise<Changelog>}
 */
export async function parseFile(filename) {
  return parse(
    await readFile(filename, 'utf-8')
  )
}
```

CommonJS -> ESM 的过渡并非没有痛苦，但对于像这样的新项目来说，它是非常理想的选择。（顶层 `await` 🎉）

我还选择不使用 `Typescript` 编写代码，取而代之的是使用 `JSDoc` 注释（上面是 `@param` 和 `@returns` 注释）。

当然不是每个人都知道不写 `.ts` 文件也可获得和 `Typescript` 一样的体验。 Typescript 也可以严格地检查 `Javascript` 文件。

这样做的好处是项目不需要构建步骤了。甚至在开发过程中不需要用到 `Typescript`，降低了上手门槛。

这是我的简化后的 `tsconfig.json` 配置文件：

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "rootDir": "./",
    "allowJs": true,
    "checkJs": true,

    "moduleResolution": "node",

    "noEmit": true,
    "strict": true,
    "useUnknownInCatchVariables": false

  }
}
```

如果您想了解更多信息，`Typescript` 文档有一个页面详细介绍了[支持的 JSDoc 注释](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)。

### 命令行参数解析

CLI 工具需要支持解析命令行选项参数(option)。从 Node 18.3（向后移植到了 Node 16.17）开始，Node 内置了一个参数解析的方法。

下面是代码示例：

```js
import { parseArgs } from 'node:util'

const { positionals, values } = parseArgs({
  options: {
    help: {
      type: 'boolean',
      short: 'h',
      default: false,
    },
    all: {
      type: 'boolean',
      default: false,
    },
    message: {
      type: 'string',
      short: 'm'
    },
    patch: { type: 'boolean' },
    minor: { type: 'boolean' },
    major: { type: 'boolean' },
  },
  allowPositionals: true,
})
```

这段配置代码添加了诸如 `--major` 这些参数的解析支持，这样就可以使用 `--message "hello!"` 指定消息，也可以使用 `-m "Hi"` 简写的方式替代。

它能完成所有工作吗？不！在一些复杂的工具中，还会用到彩色打印，自动创建帮助信息等，但这样就需要引入许多额外的第三方依赖。

就我而言，已经够用了。

可以查看 [Node.js 对应文档](https://nodejs.org/api/util.html#utilparseargsconfig)了解更详细的内容。

### 测试

大多数人可能会使用 `Jest` 或 `Mocha` 作为测试框架，但从 Node 18（也向后移植到 16）开始，Node 内置了运行测试用例的能力。

它的API类似于 `Mocha` 和 `Jest` ，包含 `it` 、 `test` 、 `describe` 、 `before` 等关键字。

下面是一个单侧的示例：

```js
// @ts-check
import * as assert from 'node:assert'
import { test } from 'node:test'
import { parse } from '../parse.mjs'

test('Parsing changelog metadata', async () => {
  const input = `Time for a change
=========

0.2.0 (????-??-??)
------------------

* Implemented the 'list' command.
* Added testing framework.

0.1.0 (2023-02-08)
------------------

* Implemented the 'help' and 'init' commands.
*
`

  const result = await parse(input)

  assert.equal('Time for a change', result.title)
  assert.equal(2, result.versions.length)

  assert.equal(null, result.versions[0].date)
  assert.equal('0.2.0', result.versions[0].version)
  assert.equal('2023-02-08', result.versions[1].date)
  assert.equal('0.1.0', result.versions[1].version)
})
```

要执行测试，只需运行 `node --test` 指令即可。无需额外配置，它将自动扫描遵循规范的目录和单测文件。

Node 18 测试输出有点简陋，它是 `TAP` 格式，如下所示：

```
TAP version 13
# Subtest: /home/evert/src/changelog-tool/test/parse.mjs
    # Subtest: Parsing changelog metadata
    ok 1 - Parsing changelog metadata
      ---
      duration_ms: 1.713409
      ...
    # Subtest: Parsing changelog entries
    ok 2 - Parsing changelog entries
      ---
      duration_ms: 0.2595
      ...
    # Subtest: Preface and postface
    ok 3 - Preface and postface
      ---
      duration_ms: 0.193591
      ...
    1..3
ok 1 - /home/evert/src/changelog-tool/test/parse.mjs
  ---
  duration_ms: 70.901055
  ...
1..1
# tests 1
# pass 1
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 81.481441
```

坦白说，用了这个之后我不确定是否还会继续再使用 `Mocha`。毕竟我已经用了十多年了，还是有许多不错的功能，我认为除了 Node 已经支持的外 `Mocha` 里还有一些我需要的功能。

一些链接:
* [node:test package](https://nodejs.org/api/test.html);
* [node:assert package](https://nodejs.org/api/assert.html);
* [Mocking in node](https://nodejs.org/api/test.html#mocking).

### 带注释的 package.json

我想以我配置的 `package.json` 来结束这篇文章，这样你就可以看到前面内容是如何联系到一起的。（如果 npm 支持 JSON5，​​这样我就可以将我的注释保留在包中 😭）。

```json
{
  // 包的名称
  "name": "changelog-tool",

  // 包的版本号
  "version": "0.5.0",

  // 这将显示在NPM搜索结果中
  "description": "A CLI tool for manipulating changelogs",

  // 这告诉Node这是一个ESM包
  // 当然不是严格需要的，如果我们在每个地方都是使用 .mjs
  "type": "module",

  // 如果需要在编码的时候使用此包中的方法（不是 CLI 中），则需要在这里指定导出的模块入口文件
  "main": "index.mjs",

  "scripts": {
    // 运行测试用例
    "test": "node --test",

    // 我喜欢让 Typescript 在终端中运行，以便有任何问题即时的警告我
    "watch": "tsc --watch"
  },

  // 方便更好的在 npmjs.org 上发现此包
  "keywords": [
    "changelog",
    "markdown"
  ],

  // 作者信息
  "author": "Evert Pot (https://evertpot.com/)",

  // 做任何你想做的事（MIT协议基本没有约束）
  "license": "MIT",

  "engine": {
    // 警告尚未升级的用户
    "node": ">16"
  },

  "bin": {
    // 当人们安装这个包时，可以通过 `npx changelog` 执行。
    // 如果全局安装了这个包，就会有一个 `changelog` 命令
    "changelog": "./cli.mjs"
  },
  "devDependencies": {
    // 唯一的 2 个依赖项。如果你想？甚至不需要这些包
    "@types/node": "^18.11.19",
    "typescript": "^4.9.5"
  }
}
```

## 总结

我喜欢创造新事物并深思熟虑地做出每一个决定。

结果是我更有可能最终得到一些简约、维护成本低的东西，并且让我对所使用的工具有更深入的理解。

未来我可能会再次做出这些选择。Node 的测试工具快速又简单，ESM 也非常Nice，还不需要引入构建，对于我这种规模的项目来说，感觉非常合适。

**我希望这能鼓励将来的人从空目录来开始他们的下一个项目，而不是复制大型项目模板。**

[Github 上的 changelog-tool 项目](https://github.com/evert/changelog-tool)。

*最后一句话确实挺值得思考的，现在好像无论做什么项目，都想先找个模板然后才开始🤔*