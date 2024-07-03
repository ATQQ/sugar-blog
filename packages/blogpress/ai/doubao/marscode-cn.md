---
sidebar: false
---
# 使用豆包 MarsCode IDE 搭建 VitePress博客，使用 GitHub 部署

>我正在参加[「豆包MarsCode初体验」](https://juejin.cn/post/7384997062416252939)征文活动

## 创建MarsCode项目

>还没有注册登录的可以访问 https://www.marscode.cn/introduction-of-ide 登录并进入IDE界面
![](https://cdn.upyun.sugarat.top/mdImg/sugar/c331c475497e3e35eb54debcb1edcb22)

在左上角和右上角都有创建项目的入口。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/9cb29ef6e068d57e8185b5784ec09ce2)

选择 Node.js 项目进行创建。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/a6d82c0919e1ed834e47cac0965521e2)

创建后可以看到项目列表里只是一个基础的 node.js 项目。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/a3ff12727f02a087c1ab2f57ca420fb5)

接下来就可以导入我们的 VitePress 项目。

## 拉取 VItePress 博客项目模板

我们使用终端操作，删除原来的项目文件。

```sh
# 查看当前项目 目录
pwd

# 移动到上一级目录
cd ../

# 删除原来的项目文件
rm -rf VitePress-boke
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/4827468b7b6f7cdb991c405d20bcebad)

接下来需要创建一个同名的 `VitePress` 项目。

VitePress 博客模板可以使用笔者的主题 [@sugarat/theme](https://theme.sugarat.top/)

![](https://cdn.upyun.sugarat.top/mdImg/sugar/42cd40b377f3dbf0654a467736b12161)

```sh
# 一键创建
npm create @sugarat/theme VitePress-boke
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/ba5726ac199a5f3551d7cfd67bbfb1b2)

根据操作提示，完成前三步就可以启动。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/c5d34dee9f0c06198d8cd0a83241a8c1)

点击右侧工具栏中的 `Webview` 就可以预览看到效果。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/3a2784328291b06d96e6d8c873c0198d)

所有文章内容默认都在 `docs` 目录下。

开发模式(`npm run dev`)下，修改会立即生效，自动热更新到页面上。

生产模式使用 `npm run build` 打包。

如果你没有自己的服务器，又想部署一个站点供其它人访问，就可以使用 `GitHub Pages`，当然弊端就是访问速度不稳定，下面演示一下。

## 部署到GitHub Pages