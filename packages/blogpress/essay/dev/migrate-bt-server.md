---
tag: 
 - 杂记
 - 迁移
---
# 记一次服务器迁移

服务器又要过期了，上一次的机器也是3年前的双十一购入的。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/5c3d1b1e6475eafcf0a6873b01edb761)

新买的配置比之前的带宽和核心数低一点，不过日常跑跑小demo服务&博客也差不多够用。

今年双十一的活动也还行，159 买一年送3个月。(300块 30个月也还不错)

![](https://cdn.upyun.sugarat.top/mdImg/sugar/8ed6e6d353a9cce38fed85e46abcb33c)

本文记录分享一下整个服务迁移的过程。（不一定是最佳实践 ❤️）

## 迁移前准备

### 盘点

1. 管理面板

原服务器使用[宝塔面板](https://www.bt.cn/new/index.html)做管理，这块了解到有 [1Panel](https://1panel.cn/) 这个平替产品。

时间比较紧迫，我还是选择沿用宝塔，下次搞个测试机体验一下 1Panel 再看情况替换。

2. 服务器软件

主要就常见的一些软件

* 数据库：MySQL，Redis，MongoDB
* 其它：Nginx，Node

这部分使用宝塔面板的软件管理一键安装配置即可。

3. 要迁移的服务

* 纯静态：博客，demo
* 带后端服务：前端 + Node.js 后端 + 数据库

### 配置新机环境

* 新机子 Web 服务器我选择了 Nginx1.25 （提示支持 HTTP3）。
* 数据库就按推荐的默认安装。
* Node.js 选择了最新的 Node22。

*上述软件的安装，只需要在宝塔上一键操作即可。*

过程中只遇到 MongoDB 有问题，需要介入解决一下。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/b0821b8b772a75d779dda83cb11135aa)

错误的原因，也是宝塔的安装脚本没有兼容腾讯云的这款机器，在论坛找到了解决办法。

https://www.bt.cn/bbs/thread-134959-1-1.html

安装完 Node.js 之后，顺便安装了 pm2 （用来管理 Node 进程），pnpm（安装依赖）。

```sh
npm i -g pnpm
npm i -g pm2
```

## 开始迁移

采用一个一个站点迁移的方式，逐步迁移到新服务器上。

### 暂停站点访问

① 将网站前端临时指向一个默认的提示页面，避免网站直接无响应，此时访问页面的用户也知道发生了什么。

创建临时页面地址：`/www/wwwroot/migrate/index.html`

内容如下：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>网站升级中...</title>
</head>
<body>
	<h1>网站升级中...</h1>
	<p>预计15分钟左右恢复正常，请耐心等待。</p>
</body>
</html>
```

修改网站 Nginx 目录配置为临时文件目录

![](https://cdn.upyun.sugarat.top/mdImg/sugar/6d162bf8abcd79047266d7e188b7a68d)

此时访问效果如下：

![](https://cdn.upyun.sugarat.top/mdImg/sugar/cd5eb499099f2c95a18103352cd3379e)

② 停止站点关联的后端服务

防止有用户没刷新停留在原页面，请求接口产生新的数据。

我这里采用直接停止对应后端服务的方式。

```sh
pm2 stop serviceName
```

如果是反向代理的接口也可以关闭反向代理的配置。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/d9bc43494d7e0c4db72bde83d474b9d1)

### 备份数据库

宝塔提供了一键备份的功能。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/95fd40cc72bbd73f9c13c670beada7c0)

备份完后，可以将其下载下来，后面在新服务器上进行导入。

### 创建新站点

这个就使用宝塔面板默认的创建功能即可。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/f5c6e794fed14ef29e5471b2e91cc0e6)

### 迁移站点配置和数据
① 同步前端资源

使用宝塔内置的压缩工具，将需要的资源压缩打包下载。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/3bdaf70a11209ebbff723b149d032cf3)

上传解压到新站点对应的目录下。

② 同步 Nginx 配置

我这块主要就是是反向代理和 SPA 的配置
```sh
location / {
  try_files $uri $uri/ /index.html;
}
```

③ SSL 证书

可以直接拷贝过来旧的证书。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/6780baa522e2c8372afd0eeb0d3c8702)

宝塔上操作也比较方便，CV 一下就可以了。

④ 数据库

创建同名数据库，账号和密码与之前的保持一致。

然后将备份的数据一键导入，包含 MongoDB 和 MySQL。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/0f798a01ce7c2a704c8d51678a31a156)

⑤ 后端服务资源

都是 Node.js 项目，将除 node_modules 外的资源压缩下载，导入到新机器上。

使用 pm2 启动服务。

```sh
pm2 start npm --name serviceName -- run start
```
:::tip
要注意的点就是，和之前启动的服务端口保持一致，这样反向代理配置也可以直接拷贝过来用。
:::


⑥ 配置反向代理

新服务到这里就在新服务器上跑起来了。

检查一下后端服务的启动日志是否正常，就可以做最后一步的域名转发配置了。

### 修改域名指向

最后一步了，修改域名的 DNS 解析设置，将域名指向到新服务器的 IP 地址。

大概10分钟左右就生效。

这样一个站点的迁移就搞定了。

## 其它坑
### .DS_Store 文件

之前有些文件是从 Mac 电脑压缩上传的，解压后会产生 `.DS_Store` 文件，迁移的过程中顺手移除了，存在外部可以访问到的风险。

搜了一段 Shell，一键删除，来源：https://www.cnblogs.com/xuyaowen/p/DS_store.html。

```sh
# 查询当前目录下所有.DS_Store 文件
find "." -name .DS_Store

# 删除当前目录下所有.DS_Store 文件
find "." -name .DS_Store | xargs rm
```

主要是腾讯云报告有安全问题说这个，顺手处理了。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/53ba8c2fb31cb69812946409fd4700e9)

### 图片跨域

发现看板娘的 图片加载不出来，一坨黑的！
![](https://cdn.upyun.sugarat.top/mdImg/sugar/0d752202cc0a4f523fcf911a4086543b)

再看有个跨域请求。
![](https://cdn.upyun.sugarat.top/mdImg/sugar/2d73116c922ce4971db1c1d10962c756)

琢磨了一下，少 CV 了一段针对图片的跨域配置！

*SDK 内部应该是用的 new Image() 加载图片，所以触发了跨域的限制。*

![](https://cdn.upyun.sugarat.top/mdImg/sugar/bed3a10c929fd42fe9af5c63cd2162e0)

### 升级 HTTP3
http3 基于 QUIC 协议，QUIC 又基于 UDP，所以 443 端口得先开放一下 UDP 协议。

然后再找个网站 https://http3.wcode.net/?q=https://sugarat.top 检测了一下。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/79e617c0ed7b6eaa71a784f2c8b75491)

就说支持了？？？ 我一看没生效啊！

![](https://cdn.upyun.sugarat.top/mdImg/sugar/dcff62f55d530ab4b3d5035a47085907)

然后就开始捣鼓了，看[官方文档](https://nginx.org/en/docs/http/ngx_http_v3_module.html)。

还没搞出来，正在折腾中！

## 最后

感觉 20 多个站点迁起来还挺费事的，下次迁感觉可以写个脚本自动化搞一搞，这次也算有经验了。