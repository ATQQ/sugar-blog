---
isTimeLine: true
title: 网络层面优化
date: 2020-04-14
tags:
 - 大前端
 - 性能优化
categories:
 - 大前端
---
# 网络层面优化

## DNS解析
* 浏览器DNS缓存
* [DNS预解析](./dnsPre.md)
## TCP连接
* [长连接](https://blog.csdn.net/yanglianzhuang/article/details/87966866),HTTP/2中的多路复用
* 预连接
* 接入 [SPDY](https://baike.baidu.com/item/SPDY/3399551?fr=aladdin) 协议
## Http请求/响应
* 减少请求次数
* 减少单次请求所花费的时间

## webpack 优化
### 构建过程提速
**babel-loader**
*  使用include 或 exclude避免不必要的转译
*  开启缓存

```js
{
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader?cacheDirectory=true',
    options: {
      presets: ['@babel/preset-env']
    }
  }
}
```

**处理第三方库**

[DllPlugin](https://www.webpackjs.com/plugins/dll-plugin/) 是基于 Windows 动态链接库（dll）的思想被创作出来的。这个插件会把第三方库单独打包到一个文件中，这个文件就是一个单纯的依赖库。这个依赖库不会跟着你的业务代码一起被重新打包，只有当依赖自身发生版本变化时才会重新打包。

**将 loader 由单进程转为多进程**

webpack 是单线程的，当存在多个任务，只能排队一个接一个地等待处理。[Happypack](https://github.com/amireh/happypack) 会充分释放 CPU 在多核并发方面的优势，把任务分解给多个子进程去并发执行，大大提升打包效率。

```js
const HappyPack = require('happypack');

exports.module = {
  rules: [
    {
      test: /.js$/,
      // 1) replace your original list of loaders with "happypack/loader":
      // loaders: [ 'babel-loader?presets[]=es2015' ],
      use: 'happypack/loader',
      include: [ /* ... */ ],
      exclude: [ /* ... */ ]
    }
  ]
};

exports.plugins = [
  // 2) create the plugin:
  new HappyPack({
    // 3) re-add the loaders you replaced above in #1:
    loaders: [ 'babel-loader?presets[]=es2015' ]
  })
];
```

### 构建结果体积压缩
[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer),文件结构可视化，找出导致体积过大的原因

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

### 拆分资源

### 删除冗余代码
* 使用``Tree-Shaking``插件
## Gzip 压缩
### 开启Gzip
在request headers中加入
```js
accept-encoding:gzip
```
压缩后通常能帮我们减少响应 70% 左右的大小

