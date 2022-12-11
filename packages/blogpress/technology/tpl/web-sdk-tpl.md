---
title: 模板工程搭建：Web-SDK/Library
date: 2021-10-05
tags:
 - 技术笔记
 - 工程模板
categories:
 - 技术笔记
---
# 模板工程搭建：Web-SDK/Library

此系列会与时俱进的不断更新

包含Node/Web SDK，单组件，组件库，Eslint插件，Webpack插件，Vite插件，MonoRepo等等工程化相关能力的模板建设

## 前言
在Web开发中，通常会把一些常用的方法，一个技术产品做成一个SDK或者Library（库）的形式，方便调用方直接接入使用

其中库/SDK又分为框架相关和框架无关的，本文主要介绍**框架无关的 Web JS SDK/Library**工程模板搭建，下文统称为`Lib（库）`

## 一点定义
产品定位是SDK还是工具库，取决于构建产物的功能与适用范围，两者之间的定位不绝对，工具库在不断的迭代过程中也可变为一个SDK
### SDK（软件开发工具包）
包含一些列功能的库，这些功能通常由多个库或者sdk组合提供

如一个获取天气的SDK，可能包含定位sdk，网络请求库，资源处理库，数据库操作sdk等

### Lib（库）
库是功能的集合，如`chalk`,`loadsh`,`debug`等等常用工具库，包含了一系列的工具方法或者某一类功能的方法集合

## 库运行环境
通常是在浏览器或者Webview控件中

## 使用方法
### CDN
>静态资源通常使用`OSS`存储，通过`CDN`下发，所以通常叫做`通过CDN引入资源`

在`html`模板中通过`script`引入库的js资源，某些还需引入相应的css资源
```html
<link rel="stylesheet" href="//cdn.example.com/path/sdk-version/sdk-name/style.css">
<link rel="stylesheet" href="//cdn.example.com/path/sdk-version/sdk-name.css">

<script src="//cdn.example.com/path/sdk-version/sdk-name/index.js"></script>
<script src="//cdn.example.com/path/sdk-version/sdk-name/index.min.js"></script>

<script src="//cdn.example.com/path/sdk-version/sdk-name.js"></script>
<script src="//cdn.example.com/path/sdk-version/sdk-name.min.js"></script>
```

### NPM Package
现代前端开发通常都会使用前端构建工具

因此除了通过CDN引入外，就是通过`包管理工具`将库的依赖安装到项目中，然后在源码中进行引入使用
```js
import pkgName, { methodName } from 'pkgName'
import 'pkgName/dist/style.css'
```
## 准备工作
### 项目初始化
```sh
mkdir web-lib-template

cd web-lib-template

npm init  -y
```
### Git初始化
```sh
git init
```

`.gitignore`内容
```sh
node_modules
dist
```
### 安装依赖
这里使用新一代的包管理工具 [pnpm](https://www.pnpm.cn/)

安装pnpm指令
```sh
npm install -g pnpm
```

装依赖
```sh
pnpm add -D typescript rimraf vite eslint tslib core-js @rollup/plugin-typescript @microsoft/api-extractor
```

* `@microsoft/api-extractor`：汇总产物中的类型定义
* `@rollup/plugin-typescript`：用于构建阶段TS的转换
* `core-js`：用于js polyfill支持
* `tslib`：为TS提供一些辅助方法，Runtime library for TypeScript helper functions
* `eslint`：代码规范
* `vite`：开发阶段测试，与库的最终构建（Rollup提供构建能力）
* `rimraf`：替代`rm -rf`指令用于清理不需要的资源
* `typescript`：TS支持


### typescript配置
创建`tsconfig.json`配置文件

只包含一些基础配置信息，其中
* `declarationDir`：标识类型定文件的输出目录
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["ESNext", "DOM"],
    "moduleResolution": "Node",
    "strict": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "noImplicitThis": false,
    "noImplicitAny": false,
    "declaration": true,
    "declarationDir": "./dist",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "downlevelIteration": true,
  },
  "include": [
    "src/**/*",
   ],
  "exclude": [
    "node_modules"
  ]
}
```

### 初始化src源码目录
```sh
src
├── constants
|  └── index.ts
├── index.ts
├── lib
|  └── pkg.ts
├── styles
|  ├── index.css
|  └── second.css
├── types
|  └── index.ts
└── utils
   └── index.ts
```
一点说明
* `文件 src/index.ts`：主要用于模块内容的导出
* `目录 src/lib`：主要用于存放库的核心源码
* `目录 src/types`：TS定义文件
* `目录 src/styles`：样式文件
* `目录 src/constants`：常量
* `目录 src/utils`：工具方法

简单添加一些源码，完整请移步[GitHub](https://github.com/ATQQ/web-lib-template)

`src/index.ts`
```ts
export { default } from './lib/pkg';
export type { DataItem } from './types/index';
```

## 构建相关配置
### Vite配置
`vite.config.js`文件
* Vite构建能力由Rollup提供，因此大部分Rollup插件可以直接复用
```js
const path = require('path');
const typescript = require('@rollup/plugin-typescript');
const { defineConfig } = require('vite');

const libName = 'LibName';
const bundlePrefix = 'index';

// 入口
const entry = path.resolve(__dirname, 'src/index.ts');

module.exports = defineConfig({
  plugins: [
    typescript({
      target: 'es5',
      include: ['src/**/*.ts'],
      esModuleInterop: true,
      module: 'esnext',
    }),
  ],
  build: {
    sourcemap: true,
    outDir: 'dist',
    minify: 'esbuild',
    lib: {
      entry,
      name: libName,
      formats: ['umd', 'cjs', 'es'],
      fileName: (format) => {
        if (format === 'umd') {
          return `${bundlePrefix}.min.js`;
        }
        return `${bundlePrefix}.${format}.js`;
      },
    },
    rollupOptions: {
      input: entry,
      output: {
        exports: 'auto',
      },
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
```
`build`下的配置释义
* outDir：构建输出目录
* lib
  * entry：构建入口文件`src/index.ts`
  * name：库的名称，挂载在`globalThis`上的名称
  * formats：产物包含的格式，这里指定了常见的4种
  * fileName：针对不同格式，修改一下产物的名称

### 完善pkg.json

`package.json`
```json
{
  "main": "dist/index.cjs.js",
  "module": "dist/index.es.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build:dev": "vite build -w",
    "build": "rimraf dist && vite build",
  },
}
```
1. 添加构建相关指令
   * 其中 `build:dev`主要用于开发调试，监听文件变更，有变更自动进行重新构建
2. 表明入口文件信息
   * `main`：设置cjs规范的文件
   * `module`；设置ESM规范的文件

### 执行构建
```sh
npm run build:dev
```
### 产物说明
构建产物如下

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzUzMjA5MTQ4MQ==633532091481)

* *.cjs.js：构建工具引用
* *.es.js：支持ESM的构建工具使用
* index.min.js：CDN引入使用，其中UMD兼容AMD，commonJS，全局引用等等方式

### 注意事项
针对`index.min.js`（CDN引入使用）的一点说明

入口文件除类型导出外，如果只包含`export default VarName1`，那么`globalThis.LibName`就等于`VarName1`

```ts
export type { DataItem } from './types/index';
export default function Demo1() {}

// 编译后
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.LibName = factory());
})(this, function() {
  "use strict";
  function Demo1() {
  }
  return Demo1;
});
```

如果包含其它导出`export const vaeName2`，那么`globalThis.LibName`就等于`VarName1.default`

```ts
export type { DataItem } from './types/index';
export default function Demo1() {}
export function Demo2() {}

// 编译后
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.LibName = {}));
})(this, function(exports2) {
  "use strict";
  function Demo1() {
  }
  function Demo2() {
  }
  exports2.Demo2 = Demo2;
  // 关键代码
  exports2["default"] = Demo1;
  Object.defineProperty(exports2, "__esModule", { value: true });
  exports2[Symbol.toStringTag] = "Module";
});
```

如果的确需要有导出多个，那么建议
* 方式1：都是具名的导出
* 方式2：通过default导出一个对象，里面包含LibName

```ts
// 方式1
export function fun1(){}
export const var1 = 1
export class LibName{

}

// 方式2
class LibName{

}
export default {
  fun1(){},
  var1:1,
  libName
}
```
## 开发测试
### PKG
在工程中执行如下指令，在全局创建一个软链接（执行一次即可）
```sh
npm link
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzUwMzk3NDAzOA==633503974038)

在要测试的项目中引用
```sh
npm link pkgName
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzUwNDM0NDkwMQ==633504344901)


运行示例

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzUwNDYyMDY3Mg==633504620672)
### CDN
本地在./dist目录下起一个Server服务，推荐使用`http-server`

```sh
# 安装http-server
npm i -g http-server
```

在 dist目录下执行`http-server`

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzUwNDkzMDA5Nw==633504930097)

测试页面中引入
```html
<script src="http://127.0.0.1:8080/index.min.js"></script>
<script>
  new LibName('test').sayHello()
</script>
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzUzMjk5MTk0MA==633532991940)

### Vite
vite本身就是一个支持ESM的Server，在项目中测试使用完全没问题他

根目录创建一个`index.html`,在其中加入以下代码
```html
<body>
    <script type="module">
        import PkG from './src/index.ts'
        new PkG().sayHello()
    </script>
</body>
```

`pkg.json`中加入启动指令
```json
{
  "scripts": {
    "serve": "vite",
  },
}
```

启动
```sh
pnpm serve
```
## CSS资源处理
css资源的处理方式有很多种，下面介绍几种常见的

测试样式
```css
h1{
  font-size:48px;
  color:red;
}
```
### 外部样式表
直接在入口文件`src/index.ts`中引入
```ts
import './styles/demo.css';
```
`build`产物包含一个`style.css`文件，里面即为书写的样式

于是此种方式引入sdk的话，还需要额外引入一个css资源

### style 标签
可以算作**css in js**的一种

先编写2个工具方法
* h：简化创建标签
* addStyleDom：向指定Dom下插入`style`标签
```ts
/**
 * 创建HtmlElement
 * @param tag 标签名
 * @returns
 */
export function h(tag: string) {
  return document.createElement(tag)
}

/**
 * 通过style标签向目标DOM添加css样式
 * @param target 目标DOM
 * @param style 样式
 */
export function addStyleDom(target: HTMLElement, style: string) {
  const styleDom = h('style')
  styleDom.textContent = style
  target.append(styleDom)
}
```

```ts
import style from './styles/demo.css';
import { addStyleDom } from './utils';

addStyleDom(document.documentElement, style);
```

于是此种方式会将css内容写入到js代码中，在运行时自动通过style节点插入到文档节点中

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzc1NzUzNDYzNg==633757534636)

### scss/less支持
Vite内置对这两个预处理语言的支持，只需要安装相应的依赖就行
```sh
pnpm add -D less sass
```

使用
```ts
import './styles/demo.scss';
import style from './styles/demo.less';
```
## 发布
要让别人使用，那就得将npm包发布上线

### NPM
线上[npm](https://www.npmjs.com/)注册一个账号，调用`npm login`进行登录

```sh
npm login
```

发布前记得先build，然后commit暂存区的代码，清理工作区的变动
```sh
npm run build
```

接着升级版本
```sh
npm version patch
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzc1ODgzNzI3OA==633758837278)

发布
```sh
npm publish
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzg0NTE0MDEzMQ==633845140131)

### CDN资源
简单一点就使用[UNPKG](https://unpkg.com/),可以读取发布到npm上的静态资源

为了速度更快的话可以将资源上传到大陆的`OSS`上，再通过`CDN`下发

```js
<script src="https://unpkg.com/tpl-web-lib@0.0.1/dist/index.min.js"></script>
```

## Demo
### 效果
会向你的页面中心位置添加一个`tag`

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzg1NDMyNjkzNw==633854326937)
### npm
```sh
# npm
npm i tpl-web-lib

# yarn
yarn add tpl-web-lib

# pnpm
pnpm add tpl-web-lib
```

```ts
import libName from 'tpl-web-lib'
new libName()
```
### cdn
```html
<script src="https://unpkg.com/tpl-web-lib@latest/dist/index.min.js"></script>
<script>
    new LibName()
</script>
```

## 总结
文章比较详细的介绍了整个搭建过程，笔者水平有限，如有错误还请斧正

经过一些思考（文章篇幅与相关性），关于一些工程通用的能力，如`eslint`，`api-extractor`，`prettier`，`jest`，`husky`等等将会在后续文章中专门介绍

>文中所涉及[源码仓库](https://github.com/ATQQ/web-lib-template)地址：https://github.com/ATQQ/web-lib-template


