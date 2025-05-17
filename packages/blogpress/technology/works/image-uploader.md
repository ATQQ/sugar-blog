---
description: 微信群的二维码每周都要更新一次，比较麻烦。于是搞了个简单的上传/下发的 Web 应用。
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# 用AI做了个图片上传/下发应用

微信群的二维码每周都要更新一次，比较麻烦。于是搞了个简单的上传/下发的 Web 应用。

下面是优化前后流程，虽然看似步骤少了一步，但大大节省了时间。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/4c498d3401a80b9ada9957f2786bbb3c)


## 主要功能
![](https://cdn.upyun.sugarat.top/mdImg/sugar/581b0e0ca54787af904939f39097736c)

* 常见类型图片上传，支持删除，提供外链访问
* 支持上传前修改图片名，同名自动覆盖
* 秘钥登录，配置更简单

**Github: https://github.com/ATQQ/image-uploader**

**体验地址：https://imageupload.test.sugarat.top** (秘钥`testpwd`)

*https://imageupload.test.sugarat.top/images/user1/test.png*

## AI做了啥
### Web站点生成
>*https://bolt.new/~/sb1-58wfad6k*

使用 Bolt（https://bolt.new） 生成

Prompt 如下
```sh
实现一个Vue3 SSR的应用，通过填写一个指定的秘钥（服务器上可以配置多个秘钥）
就可以上传图片到服务器上，支持用户单选或者多选图片，上传后给用户返回图片链接，
链接构成 domain/images/秘钥对应账号名/图片名称

其中图片名称可以由用户可选指定，不指定就动态生成一个不重复的图片名

同时集成图片的自动压缩
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/ef0df190fb91153492782bee0261e95c)

哐哐的一顿输出，分分钟就好了。

*图片压缩功能生成得有问题，代码上就先给移除了😄*

项目最终就是 Vue Nuxt 技术栈。
### 镜像脚本生成
使用 Cursor 的 chat 功能，也是 kuakua 的就生成了！

![](https://cdn.upyun.sugarat.top/mdImg/sugar/b04766555bfc4759ba8a885f86a71745)

## 我做了什么
1. 代码逻辑的微调
2. 镜像脚本的微调，构建镜像上传
3. 部署服务器

上面的工作理论上AI都能搞定，复杂点的可以结合一下 MCP，但个人觉得重要的部分还是需要人工 Review 改造一下。

*细微的地方修改，Prompt 效率还是没有直接改 code 来得快。*

## 如何部署
### Docker
最简单的方式使用 Docker 镜像（当然也是AI生成的）

```sh
docker run -d \
  --name image-uploader \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e NODE_ENV=production \
  -e HOST=0.0.0.0 \
  -e PORT=3000 \
  -e SECRET_ACCOUNT_USER1=your-secret-key-here \
  --restart unless-stopped \
  sugarjl/image-uploader
```
*通过修改SECRET_ACCOUNT_XXX的值来设置秘钥 比如*
```sh
  -e SECRET_ACCOUNT_HELLO=a123456 \
```
### PM2
```sh
# 拉代码
git clone https://github.com/ATQQ/image-uploader.git

# Gitee 地址（Github 访问受阻）
git clone https://gitee.com/sugarjl/image-uploader.git

cd image-uploader

# 装依赖
npm install
# 构建
npm run build

# 启动
# 在 ecosystem.config.cjs env中添加或修改秘钥
pm2 start ecosystem.config.cjs
# 或者 启动时通过环境变量指定秘钥
SECRET_ACCOUNT_USER1=test pm2 start ecosystem.config.cjs
```

## 最后
有 AI 后，能快速验证的各种想法，分分钟就生成 demo ，效率杠杠的！

语言不再是开发的障碍。