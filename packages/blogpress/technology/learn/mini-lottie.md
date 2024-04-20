---
tags: 技术笔记
---
# 小程序中使用 lottie 动画 | 踩坑经验分享

本周被拉去支援紧急需求（赶在五一节假日前上线的，双休需要加班😱），参与到项目中才知道，开发的项目是微信小程序技术栈的。由于是临时支援，所以我挑选了独立性大，业务属性相对轻薄的模块介入。

其中有个营销活动（领红包🧧😁）的弹窗动画就要用到 lottie 动画。

本文就分享一下在小程序中使用 lottie 过程中遇到的问题与解决办法。

## 关于 lottie

[lottie](https://airbnb.io/lottie/#/README) 是 Airbnb 开源的一个动画库，用于在端上直接播放 AE ( Adobe After Effects)动画。

通过 [bodymovin](https://github.com/airbnb/lottie-web/tree/master/build/extension) AE 插件将动画文件导出为 json 文件，lottie SDK 通过可以通过 JSON 文件直接播放动画。

具体 demos 效果可以上 [LottieFiles](https://lottiefiles.com/) 网站查看。

## 如何使用 AE 导出JSON文件
完成 AE 软件安装后，参照 [Lottie Web GitHub 官方文档](https://github.com/airbnb/lottie-web/tree/master?tab=readme-ov-file#plugin-installation) 完成 `bodymovin` 插件的安装。

打开动画文件后，只需两步操作

① window 中选择 Bodymovie

![](https://img.cdn.sugarat.top/mdImg/sugar/e887b3af9200905af6a3484300de1d3b)

② 导出需要的动画资源

![](https://img.cdn.sugarat.top/mdImg/sugar/ddb3ce4d7c88df65ee50cca915817fa7)


## 小程序中使用

可以使用小程序官方封装的 [lottie-miniprogram](https://github.com/wechat-miniprogram/lottie-miniprogram) 库。

>快速验证的话可以打开微信开发者工具，在点击👉🏻 [demo代码片段](https://developers.weixin.qq.com/s/2TYvm9mJ75bF) 进行创建。

① 安装依赖

```sh
npm install --save lottie-miniprogram
```
② 使用

**tip：开发者工具中验证的话，渲染模式需要选择 webview ，[Skyline](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html) 目前还不支持调试 canvas**

index.wxml
```html
<canvas id="lottie-canvas" type="2d"></canvas>
```

index.js
```js
import lottie from 'lottie-miniprogram'

Page({
  onReady() {
    this.createSelectorQuery().select('#lottie-canvas').node((res) => {
      // 取得 canvas 节点
      const canvas = res[0].node

      // 设置 cavnas 画布尺寸
      canvas.width = 600
      canvas.height = 600

      lottie.setup(canvas)

      const context = canvas.getContext('2d')
      const lottieInstance = lottie.loadAnimation({
        loop: true, // 循环播放
        autoplay: true, // 自动播放
        // 本地使用 http-server 启动服务后，指定本地资源地址
        path: 'http://127.0.0.1:8080/lottie-demo-sources/data.json',
        // animationData: {/* lottie json 格式内容 */},
        // assetsPath: '静态资源目录，通常与 animationData 配合使用',
        rendererSettings: {
          context,
        },
      })
    }).exec()
  }
})
```

我这个 demo 的效果（网上找的动画素材）如下。

![](https://img.cdn.sugarat.top/mdImg/sugar/fe89db8f5a79940b2c2167062f1b321f)

## 问题&解决
### expression 表达式
报错信息如下，这是遇到的第一个问题。

![](https://img.cdn.sugarat.top/mdImg/sugar/63b1e8a0370b0ffdd017de7ceb918465)

细看了一下文档，有特别说明，expression 表达式特性是不支持的，因此需要再导出 JSON 文件时禁用相关特性。

![](https://img.cdn.sugarat.top/mdImg/sugar/c8f32eb3368a511c84cf1e7803687d5c)

解决办法：导出JSON文件时，禁用掉表达式特性即可。

![](https://img.cdn.sugarat.top/mdImg/sugar/60104c2927d61dcb75be50fbd363f45d)

当然禁用后，JSON 文件大小会有所增加。

比如我这个 demo 从 40kb 增加到了 240kb（当然动画不一样，增长的大小会有所不同。有些前后可能只有1-2kb的变化）。

### 模糊

由于需要全屏展示，动画文件的尺寸不确定，手动只设置 canvas 尺寸会有模糊的问题。

这个通过掘金搜索了一下就得到了 [lottie动画模糊问题的解决方法](https://juejin.cn/post/7171273016762974216#heading-7)。

微调一下上面的代码，就可以解决模糊问题。

```js
const canvas = res[0].node
canvas.width = 600
canvas.height = 600

// 下面是新增的代码
const dpr = wx.getSystemInfoSync().pixelRatio
canvas.width = canvas.width * dpr
canvas.height = canvas.height * dpr
context.scale(dpr, dpr)

lottie.setup(canvas)
```

### 全屏动画
弹窗的动画需要全屏展示，因此需要设置 `canvas` 宽高为页面宽高。

index.wxss
```css
#lottie-canvas{
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
}
```

index.js，使用 `wx.getSystemInfoSync` 获取设备的信息
```js
const { windowWidth, windowHeight, pixelRatio } = wx.getSystemInfoSync()
canvas.width = windowWidth * pixelRatio
canvas.height = windowHeight * pixelRatio
```
![](https://img.cdn.sugarat.top/mdImg/sugar/3dd8a0483aba8a07d9a85692197e5ce5)

## 最后
时间匆忙，介绍的不是非常的详细，感兴趣的同学可以评论区交流。

`demo` 完整源码见 [GitHub：lottie-demo](https://github.com/ATQQ/demos/tree/main/miniprogram/lottie-demo)

