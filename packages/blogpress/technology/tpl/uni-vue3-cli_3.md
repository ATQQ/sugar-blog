---
title: 模板工程搭建：Vue-Cli搭建Vue3/TS/uni-app小程序工程(下)
date: 2021-06-23
tags:
 - 技术笔记
 - 工程模板
categories:
 - 技术笔记
---
# 模板工程搭建：Vue-Cli搭建Vue3/TS/uni-app小程序工程(下)

## 前言
前两期:
* [上](./uni-vue3-cli_1.md)
* [中](./uni-vue3-cli_2.md)

已经搭建了一个包含了`Vue3`,`TS`,`Sass`,`Vant Weapp`,`Vuex4`,`Axios`,`Eslint`等特性的[uni-vue3-ts](https://github.com/ATQQ/uni-vue3-ts-template)工程化模板

本节将为模板接入更多的特性：
* less
* [tailwindcss](https://tailwindcss.com/)

## less
模板默认是没有支持less的

安装`less-loader`与`less`即可

需要指定版本，版本过高不支持低版本的webpack也无法顺利运行
```sh
yarn add less-loader@^7 less@^3.13.1 --dev
```
## tailwindcss
直接在 HTML 进行编写class即可实现页面样式生成

也就是前段时间刚出来时，社区讨论很激烈的一个东西

个人是不太喜欢这个东西，会导致样式与页面内容耦合度过高，仿佛回到了bootstrap时代

emm但如果拿来写一些简单的示例demo还是可以

优势就是对于不复杂的组价能直观的看到标签对应的最终样式，不用去样式文件中检索查看

下面介绍一下在uni-app中使用，咱根据[文档](https://tailwindcss.com/docs/guides/vue-3-vite)摸索前进

### 安装依赖
* tailwindcss
* postcss
* autoprefixer
* postcss-class-rename

```sh
yarn add tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9 postcss-class-rename --dev
```
依赖安装完后就简单配置一下

### 配置
根目录下创建`tailwind.config.js`文件,兼容小程序部分的配置来源于文末的参考资料

```js
module.exports = {
  purge: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  separator: '__', // 兼容小程序，将 : 替换成 __
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // 兼容小程序，将带有 * 选择器的插件禁用
    preflight: false,
    space: false,
    divideColor: false,
    divideOpacity: false,
    divideStyle: false,
    divideWidth: false,
  },
};
```

修改`postcss.config.js`文件内容，最终配置如下
```js
const path = require('path');

module.exports = {
  parser: require('postcss-comment'),
  plugins: [
    require('postcss-import')({
      resolve(id, basedir, importOptions) {
        if (id.startsWith('~@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3));
        }
        if (id.startsWith('@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2));
        }
        if (id.startsWith('/') && !id.startsWith('//')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1));
        }
        return id;
      },
    }),
    // 新增
    require('tailwindcss'),
    require('autoprefixer')({
      remove: process.env.UNI_PLATFORM !== 'h5',
    }),
    // 新增
    require('postcss-class-rename')({
      '\\\\.': '_', // 兼容小程序，将类名带 .和/ 替换成 _
    }),
    require('@dcloudio/vue-cli-plugin-uni/packages/postcss'),
  ],
};
```

在 App.vue中加入引入 `tailwindcss`的代码

```html
<style>
/* tailwindcss */
@import 'tailwindcss/tailwind.css';
</style>
```

### 页面中使用
这里参考[文档](https://tailwindcss.com/docs/text-color)用了几个简单的属性

```html
<view>
  <text class="text-xl font-bold text-red-500">tailwindcss</text>
</view>
```

渲染结果如下

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDQ0NDIzMjQyMg==624444232422)

## 最后
到这一个包含了常见特性的uni-app 开发小程序的工程化模板就算结束了，如果还要有推荐的特性欢迎评论交流

## 资料汇总
* [uni-vue3-ts：模板仓库](https://github.com/ATQQ/uni-vue3-ts-template)
* [PostCSS 7 compatibility build](https://tailwindcss.com/docs/installation#post-css-7-compatibility-build)
* [uni-app 使用 tailwindcss](https://wyz.xyz/d/150-uni-app-tailwindcss)

