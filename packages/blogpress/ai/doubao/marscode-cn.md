---
sidebar: false
---
# 使用豆包 MarsCode IDE 搭建 VitePress博客并使用 GitHub 部署

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

**使用终端操作**，删除原来的项目文件。

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

### 创建 GitHub 仓库
>GitHub 地址：https://github.com

[ATQQ/marscode-blog-preview](https://github.com/ATQQ/marscode-blog-preview)

![](https://cdn.upyun.sugarat.top/mdImg/sugar/3a2fdcf9c9f267a1d7f28c404ef5741d)


### 修改配置

可以参考示例项目 `README.md` 中内容，轻松搞定。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/e0c376a13d2750fcf572b47ae00db0ab)

1. 修改 GitHub 配置

将 GitHub Pages 部署调整为 `GitHub Actions`

![](https://cdn.upyun.sugarat.top/mdImg/sugar/660008a054e5b92e44ee820b745d4105)

2. 修改 VitePress 配置

修改 `docs/.vitepress/config.mts` 里的构建配置

`base` 改为 `"/仓库名/"` 即可

![](https://cdn.upyun.sugarat.top/mdImg/sugar/5d1ae11df04fe9c16d9f1d741ac86942)

### 推送代码
只差最后一步了，将代码推送到 GitHub 仓库就完成了。

1. 创建并提交至本地仓库

按顺序执行下面 3 条命令即可。
```sh
git init

git add .

git commit -m "first commit"
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/a729823f786871ea5761b22ded9a808b)

2. GitHub 授权

生成SSH密钥对(一路回车就行)
```sh
ssh-keygen -t rsa -b 4096 -C "你的github邮箱"
```

将自动生成`id_rsa`和`id_rsa.pub`

复制生成的公钥内容

![](https://cdn.upyun.sugarat.top/mdImg/sugar/03ae0217087aad0eb9613658ab1be01b)

将其添加到 GitHub 个人设置的 SSH 秘钥中。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/bfa8a5044c85cd1880e60bb498b716e0)

3. 关联并推送到 GitHub

你可以在空仓库页面看到如下的提示，咱们按顺序执行即可。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/2360d47775bd07f674116fe794ee276a)

*切换为 ssh 地址视图，截图是 https 地址*

```sh
# 添加远程仓库地址
git remote add origin git@github.com:ATQQ/marscode-blog-preview.git
# 修改分支名
git branch -M main
# 推送分支 main 到远程仓库
git push -u origin main
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/8e8c6ff16fd5161e7aecd8597ad8c0ff)

访问仓库的 Actions 查看结果（[示例项目 > Action 执行结果](https://github.com/ATQQ/marscode-blog-preview/actions/runs/9802748151)）。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/72ac8a626de255f28b45e9858ccdde5d)

访问 https://atqq.github.io/marscode-blog-preview/ 即可查看到部署后的博客。

## 更新内容

只需修改/创建 `markdown` 文档内容即可，然后通过 git 进行推送即可，会自动触发 GitHub Actions 自动部署。

下面也演示一下：

先修改一点内容，

![](https://cdn.upyun.sugarat.top/mdImg/sugar/46fc1821c980694aaad06f6e56f1046a)

再提交推送。
```sh
git add .
git commit -m "docs: update index.md"
git push
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/fd4941615d651d061040492606f8efdd)

推送后触发日志。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/f299b7d870cf2df6ac78c5fab40cebaa)

再次访问页面就是新的内容了。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/c37c9ca0f405eb1d0646a4753e37bbfc)