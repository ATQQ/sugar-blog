---
title: 分享一个最近 ViteCoding 项目部署工具：Kite
date: 2026-06-14 11:00:00
tags:
  - 技术笔记
  - 个人作品
  - AI
categories:
  - 技术笔记
description: 之前用 ssh/scp 推本地项目到服务器，索性做了一个本地构建 + 一键上传的工具，走 HTTP 协议更方便
---

# 分享一个最近 ViteCoding 项目部署工具：Kite

## 前言

我服务器上有几十个 Web 站点，因为服务器配置较低，都是在本地完成构建后通过 scp 推到服务器，每个项目里就维护了一个 `shell` 脚本。

大概下面这样：(zx 脚本)
```mjs
await $`scp ${compressPkgName} ${user}@${fullOrigin}:./`

await $`ssh -p22 ${user}@${fullOrigin} "tar -xf ${compressPkgName} -C ${destDir}"`
```

这个样子持续了差不多好多年，但始终感觉不优雅，最近刚好 AI 够强，就把一直想实现的一个部署的 CLI 实现了。

服务器只管收 + 解压 + 重启（带后端服务）。

于是有了 [Kite](https://github.com/ATQQ/Kite) —— 装一个 CLI 就能跑起 Web 管理端 + Server 后端 + 一键上传。


## 快速开始

```bash
npm install -g @kitecd/cli
kite serve
```

启动后浏览器打开 `http://127.0.0.1:5431` 就是管理后台。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/390df86e407fc423bb00aed24c3a5886)

```sh
Starting Kite Server...
  Runtime: bun v1.3.12
  Host: 127.0.0.1
  Port: 5431
  Web Dir: /Users/sugar/Documents/fe/Kite/packages/cli/dist/web
  DB Dir: /Users/sugar/.kite
  Admin Token: admin_fb3635137

🦊 Server is running on bun at http://127.0.0.1:5431
🔑 Login Token: admin_fb3635137
```

线上部署可以通过 pm2,使用 NG 反向代理站点。

```sh
kite serve --pm2
```


### 新建项目

只需要录入项目名和部署目即可

![](https://cdn.upyun.sugarat.top/mdImg/sugar/47c7a7f993dea3b4f8fa9cd988d3733a)

### 部署

项目概览页提供了部署的指令复制即可。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/ac1c41072606d0ff478f133bb42b37f8)


初始化项目，生成 `kite.config.json`。
```bash
kite init --project proj_669571accfa5 --out ./dist --server http://127.0.0.1:5431 --token kt_a6029f276c354caca86b65960804d22c
```

```sh
{
  "projectId": "proj_669571accfa5",
  "serverUrl": "http://127.0.0.1:5431",
  "outputDir": "./dist",
  "files": [
    "**/*"
  ]
}
```
部署，执行 `kite push` 即可。

`kite push` 会自动完成：合并配置 → 打包 `outputDir` → 上传到 Server → 依次执行 `preDeploy` / 解压 / `postDeploy`。

```bash
kite push
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/b7aaf9afff07bbde4f7a865943cdc09c)

### 多环境支持

如果一个项目需要推到多个服务器或者不同项目目录。

会自动扫描符合 `kite.config.xx.json` 的配置。 `kite push --env xx` 即可，或者交互式选择。

## 使用的技术栈
* 前端：Vue 3 + Vite + Pinia + Vue Router
* 后端：Bun / Node + Elysia + libSQL(Drizzle ORM)
* CLI: cac + ora + chalk

## GPT + MiMo 一起写出来的

MiMo 完成了大概 80% 的代码，15% 是 GPT。

>这个CLI服务端 支持 Bun 和 Node两个运行时，部分适配靠 GPT 搞定

流程：先使用 plan 模式把需求和实现的核心功能确定下来。

然后拆好 step ，让它挨着执行，然后配合给到的测试用例，验收一下。

然后就是 case by case 的修复问题。

## 最后

* 仓库：<https://github.com/ATQQ/Kite>
* 文档：<https://docs.kite.sugarat.top/>

下一个 VibeCoding 的新坑也开好了，猛猛的蹬。

*欢迎评论区交流 & 拍砖。*
