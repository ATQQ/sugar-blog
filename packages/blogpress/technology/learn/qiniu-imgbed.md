---
title: 3分钟使用OSS搭建个人的在线图床
date: 2021-06-07
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 使用免费的七牛云OSS(10G)搭建个人的在线图床
[代码](https://github.com/ATQQ/image-bed-qiniu)已经提前给大伙儿**码好了**(原生三大件，无框架代码),大伙儿只需要注册个七牛云账号,**改4行**代码即可

最终效果如下,非常简洁(麻雀虽小五脏俱全)

支持**复制粘贴**，**截图**，**手动选择**，**拖拽**等四种常见的上传方案

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fbcf37d23694a0a9a3b4a515a61a921~tplv-k3u1fbpfcp-zoom-1.image)
## 线上预览
* [线上demo](https://imgbed.sugarat.top/)
* [在线编码](https://stackblitz.com/edit/github-2scsen?file=README.md)

## 所需准备
>记得选择创建公开的存储空间

* [七牛云](https://portal.qiniu.com/)账号一枚
* [七牛云对象存储空间](https://portal.qiniu.com/bucket/create)(免费10G)
* 安装[Node.js](http://nodejs.cn/) 

## 快速上手

### 1.clone仓库
```sh
git clone https://github.com/ATQQ/image-bed-qiniu.git
```
### 2.安装依赖
```sh
yarn install
```

### 3.修改环境变量
根目录`创建.env.local`或者直接`修改.env`文件,加入以下内容

这4项均需自己配置
```sh
QINIU_ACCESS_KEY=AccessKey 
QINIU_SECRET_KEY=SecretKey
QINIU_BUCKET=Bucket # OSS空间名
QINIU_DOMAIN=domain # 图床域名(包含协议https/http)
```
下面通过截图展现了几个变量的获取位置

<details>
<summary>查看 bucket</summary>

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b906243abb94329a8efdfaba5e66a58~tplv-k3u1fbpfcp-zoom-1.image)

</details> 

<details>
<summary>查看 Access Key和Secret Key</summary>

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c60966aa203a41f49ba0cffdaad80141~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36299d27ec07496ebeb58021fc49ade7~tplv-k3u1fbpfcp-zoom-1.image)

</details> 

<details>
<summary>查看域名</summary>

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e678a09cee3c4ec4b087bba565d8bb8a~tplv-k3u1fbpfcp-zoom-1.image)

</details> 

### 4. 启动
开发环境预览
```sh
yarn dev
```

生产构建
```sh
yarn build
```
构建结果可直接进行进行部署

没有云服务的掘友,可采用免费的腾讯云Serverless部署

站内查看[Serverless部署静态资源站点的手把手教程](https://juejin.cn/post/6964015528662794254)

## 关键实现部分介绍
以**textarea**区域承载上述操作

```js
const pastePanel = document.getElementById('pastePanel');
```
### 读取剪贴板中的内容
* 监听目标Dom的`paste`事件
* 在回调函数中的`event.clipboardData.items`中获取剪贴板中的内容
* 其中`items`的每一个元素`item`有`kind`和`type`两个属性
* 通过`kind`属性筛选剪贴版中内容的类型，通过`type`判断值的[MIME 类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types)是否为图片
* 判断结果是我们所需要得图片文件之后调用`item.getAsFile`方法将内容转为`File`对象
* 调用上传方法即可
```js
/**
 * 监听粘贴事件
 */
pastePanel.addEventListener('paste', function (e) {
    console.log('paste');
    // 阻止触发默认的粘贴事件
    e.preventDefault();

    let { items } = e.clipboardData;
    for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image")) {
            //上传的文件对象
            let file = item.getAsFile();
            //文件名(加一个前缀相当于目录)
            let fileName = 'mdImg/' + btoa(Date.now()) + Date.now().toString().substring(1);
            //开始上传
            uploadFile(file, fileName);
        } else if (item.type === 'text/plain') {
            item.getAsString(str => {
                e.target.value += str;
            });
        }
    }
})
```

### 获取拖拽得文件
* 首先禁用document上的`drop`事件
* 监听目标Dom的`drop`事件
* 在回调函数中的`event.dataTransfer.files`中获取拖拽释放的内容
* 通过`file.type`判断文件的[MIME 类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types)是否为图片
* 调用上传方法
```js
// 禁用默认的拖拽触发的内容
document.addEventListener('drop', function (e) {
    e.preventDefault()
}, true)
document.addEventListener('dragover', function (e) {
    e.preventDefault()
}, true)

pastePanel.addEventListener('drop', function (e) {
    let { files } = e.dataTransfer;
    for (const file of files) {
        if (file.type.startsWith("image")) {
            //文件名(加一个前缀相当于目录)
            let fileName = 'mdImg/' + btoa(Date.now()) + Date.now().toString().substring(1);
            //开始上传
            uploadFile(file, fileName);
        }
    }
})
```
### 将内容写入剪贴板
这个就是最简单的一个写法，不考虑兼容性
```js
/**
 * 将结果写入的剪贴板
 * @param {String} text 
 */
function copyRes(text) {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', text);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
}
```




