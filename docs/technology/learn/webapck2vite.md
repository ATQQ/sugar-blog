---
title: webpack项目接入Vite的通用方案介绍(上)
date: 2021-10-19
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# webpack项目接入Vite的通用方案介绍(上)

## 愿景
希望通过本文，能给读者提供一个存/增量项目接入Vite的点子，起抛砖引玉的作用，减少这方面能力的建设成本

在阐述过程中同时也会逐渐完善[webpack-vite-serve](https://github.com/ATQQ/webpack-vite-serve)这个工具

读者可直接fork这个工具仓库，针对个人/公司项目场景进行定制化的二次开发

## 背景
在当下的业务开发中处处可见[webpack](https://webpack.docschina.org/concepts/)的身影，大部分的业务项目采用的构建工具也都是它。

随着时间的推移，存量老项目体积越来越大，开发启动(dev)/构建(build) 需要的时间越来越长。针对webpack的优化手段越来越有限。

于是乎某些场景出现了用其它语言写的工具，帮助构建/开发提效。如[SWC（Rust）](https://github.com/swc-project/swc),[esbuild（Go）](https://github.com/evanw/esbuild)

当然上述工具并不是一个完整的构建工具，不能取代webpack直接使用，只是通过plugin，为webpack工作提效

当下另一种火热的方案是`bundleless`，利用浏览器原生支持`ES Module`的特性，让浏览器接管"打包"工作，工具只负责对浏览器请求的资源进行相应的转换，从而极大的减少服务的启动时间，提升开发体验与开发幸福感

比较出名的两个产品就是[snowpack](https://github.com/snowpackjs/snowpack)与[Vite](https://github.com/vitejs/vite)

本文的主角就是`Vite`：**下一代前端开发与构建工具**

由于`Vite`的周边还处于建设期，要完全替代webpack，还需要一定时日，为了保证**存量**线上项目的稳定性，`Vite`作为一个**开发时可选的能力**接入是比较推荐的一个做法。

```sh
# webpack devServer
npm run dev

# Vite devServer
npm run vite
```
## 目标

**为webpack项目开发环境提供最简单的Vite接入方案**

待接入项目只需要做极小的变动就能享受到`Vite`带来的开发乐趣

## 方案
1. 做一个CLI工具，封装Vite启动项目的能力
2. 将Vite相关的配置全部收敛于插件内，自动将webpack配置转化为Vite配置
3. 对外提供一些可选参数，用于手动指定配置文件的位置

## demo效果
### Vue SPA
![图片](https://img.cdn.sugarat.top/mdImg/MTYzNTE2OTU0MzgyMA==vue.gif)

### React SPA
![图片](https://img.cdn.sugarat.top/mdImg/MTYzNTA3MDM3NDkyMQ==react-demo2.gif)

在最简单的Demo工程中，Vite的启动/HMR速度也是明显比webpack快不少的

其它常见项目类型的demo也会逐渐的完善到源码仓库中
## 实现
### 1. 初始化工程
>完整的工程结构移步[仓库](https://github.com/ATQQ/webpack-vite-serve)

注册一个启动方法`start`

`src/bin.ts`
```ts
#!/usr/bin/env node
import { Command } from 'commander';
import { startCommand } from './command';
program.command('start')
  .alias('s')
  .action(startCommand);

program.parse(process.argv);
```
```ts
export default function startCommand() {
  console.log('hello vite');
}
```

`package.json`中添加指令
* 其中`wvs`为自定义的指令
* `npm run dev`：利用`typescript`依赖提供的指令，监听文件变动，自动将其转换`js`文件
```json
{
  "bin": {
    "wvs": "./dist/bin.js"
  },
  "scripts": {
    "dev": "tsc -w -p .",
    "build": "rimraf dist && tsc -p ."
  },
}
```
项目根目录执行`npm link`,注册指令
```sh
npm link
```

测试
```sh
wvs start
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDk3MzczODk5MQ==634973738991)

紧接着我们用[Vue-CLI](https://cli.vuejs.org/zh/)和[Create React App](https://www.html.cn/create-react-app/)分别创建两个webpack的SPA应用进行接下来的实验

```sh
vue create vue-spa
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDk3NTExNTUwMQ==634975115501)

```sh
npx create-react-app react-spa
```
### 2. 收敛Vite启动
`Vite`的启动比较简单，只需要执行`vite`这个指令就行s

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDk3NDE2ODQ1MQ==634974168451)

在我们的CLI工具里使用[spawn](http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options)创建子进程启动`Vite`
* 其中`cwd`用于指定子进程的工作目录
* [stdio](http://nodejs.cn/api/child_process.html#child_process_options_stdio)：子进程的标准输入输出配置
```ts
import { spawn } from 'child_process';

export default function startCommand() {
  const viteService = spawn('vite', ['--host', '0.0.0.0'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  viteService.on('close', (code) => {
    process.exit(code);
  });
}
```

这里为了方便调试，咱们全局安装一下`Vite`
```sh
npm i -g vite
```

在启动模板`public/index.html`里添加一个`<h1>Hello Vite</h1>`

在demo项目里运行`wvs start`

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDk3NjY4MTkwNw==634976681907)

打开对应地址
```sh
# vue
http://localhost:3000/
# react
http://localhost:3001/
```
得到了如下的结果，提示找不到页面（意料之中）

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDk3NzEzMjIyNQ==634977132225)

通过文档得知,Vite会默认寻找`index.html`作为项目的入口文件

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDk3NzQyOTA2MQ==634977429061)

这就带来了第一个要处理的问题，多页应用下可能有多个模板文件

**如何根据访问路由动态的指定这个`x.html`的入口**？ 

在解决问题之前，咱们再简单完善一下启动指令，为其指定一个vite.config.js 配置文件

通过`vite --help`，可以看到通过`--config`参数指定配置文件位置

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDk3ODE2Mjk4OQ==634978162990)

```ts
export default function startCommand() {
  const configPath = require.resolve('./../config/vite.js');
  const viteService = spawn('vite', ['--host', '0.0.0.0', '--config', configPath], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}
```
这里指向配置文件的绝对路径

config/vite.ts
```ts
import { defineConfig } from 'vite';

module.exports = defineConfig({
  plugins: [],
  optimizeDeps: {},
});
```

### 3. html模板处理
拓展Vite的能力就是定制各种的插件，根据[插件文档](https://cn.vitejs.dev/guide/api-plugin.html)

编写一个简单的`plugin`，利用`configServer`钩子，读取浏览器发起的资源请求

```ts
import type { PluginOption } from 'vite';

export default function HtmlTemplatePlugin(): PluginOption {
  return {
    name: 'wvs-html-tpl',
    apply: 'serve',
    configureServer(server) {
      const { middlewares: app } = server;
      app.use(async (req, res, next) => {
        const { url } = req;
        console.log(url);
        next();
      });
    },
  };
}
```
在上述的配置文件中引入
```ts
import { htmlTemplatePlugin } from '../plugins/index';
module.exports = defineConfig({
  plugins: [
    htmlTemplatePlugin(),
  ]
});
```
再次启动服务观察

* 访问`http://localhost:3000`,终端中输出`/`
* 访问`http://localhost:3000/path1/path2`,终端中输出`/path1/path2`
* 访问`http://localhost:3000/path1/path2?param1=123`,终端中输出`/path1/path2?param1=123`


在 devTools面板内容中可以看到，第一个资源请求头上的`Accept`字段中带有`text/html,application/xhtml+xml`等内容，咱们就以这个字段表明请求的是`html`文档

![图片](https://img.cdn.sugarat.top/mdImg/MTYzNDk4Mjg0OTU1OQ==634982849559)

再次修改一下处理资源请求的代码
```ts
import { readFileSync } from 'fs';
import path from 'path';
import { URL } from 'url';

function loadHtmlContent(reqPath) {
  // 单页默认 public/index.html
  const tplPath = 'public/index.html';
  // 可以根据请求的path：reqPath 作进一步的判断
  return readFileSync(path.resolve(process.cwd(), tplPath));
}

// 省略了前面出现过的代码
app.use(async (req, res, next) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const htmlAccepts = ['text/html', 'application/xhtml+xml'];
  const isHtml = !!htmlAccepts.find((a) => req.headers.accept.includes(a));
  if (isHtml) {
    const html = loadHtmlContent(pathname);
    res.end(html);
    return;
  }
  next();
});
```
再次在demo中启动服务，访问就能正确看到`Hello Vite`

在终端中会发现一个报错
```sh
UnhandledPromiseRejectionWarning: URIError: URI malformed
```
打开模板可以发现是由于有一些其它的内容，里面包含一些变量，这部分在webpack中是由 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)插件处理 
```html
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
<link rel="icon" href="<%= BASE_URL %>favicon.ico">
<title>
  <%= htmlWebpackPlugin.options.title %>
</title>
```
这里编写一个简单的方法对模板先做一些简单处理（这个方法只处理了当前遇到的这种情况）
```ts
/**
 * 初始化模板内容（替换 <%= varName %> 一些内容）
 */
function initTpl(tplStr:string, data = {}, ops?:{
  backup?:string
  matches?:RegExp[]
}) {
  const { backup = '', matches = [] } = ops || {};
  // match %Name% <%Name%>
  return [/<?%=?(.*)%>?/g].concat(matches).reduce((tpl, r) => tpl.replace(r, (_, $1) => {
    const keys = $1.trim().split('.');
    const v = keys.reduce((pre, k) => (pre instanceof Object ? pre[k] : pre), data);
    return (v === null || v === undefined) ? backup : v;
  }), tplStr);
}
```
如果模板中还有复杂的ejs语法可以使用 `ejs` 库做进一步处理
```ts
import ejs from 'ejs';

/**
 * ejs渲染
 */
function transformEjsTpl(html:string, data = {}) {
  return ejs.render(html, data);
}
```
当然如果还有其它未考虑到的case，可根据特定情况，再对模板做进一步的处理

下面将上述编写的方法集成到插件中
```ts
export default function HtmlTemplatePlugin(): PluginOption {
  return {
    configureServer(server) {
      const { middlewares: app } = server;
      app.use(async (req, res, next) => {
        // 省略代码
        if (isHtml) {
          const originHtml = loadHtmlContent(pathname);
          // 调用插件中的transformIndexHtml 钩子对模板做进一步处理
          const html = await server.transformIndexHtml(req.url, originHtml, req.originalUrl);
          res.end(html);
          return;
        }
        next();
      });
    },
    transformIndexHtml(html) {
      // data可以传入模板中包含的一些变量
      // 可以再此处获取webpack配置，做自动转换
      return initTpl(html, {
        PUBLIC_URL: '.',
        BASE_URL: './',
        htmlWebpackPlugin: {
          options: {
            title: 'App',
          },
        },
      });
    },
  };
}
```
到此再次在demo中运行，页面跑起来了，终端中也无报错，页面的模板到此算是处理完毕

有了初始的模板，就意味着我们已经为`Vite`提供了页面的入口，但其中还没有处理的`js/ts`的依赖即 `entry`

下面将介绍往模板中插入entry
### 4. 指定entry入口
入口文件名(entryName)通常为`(main|index).js|ts|jsx|tsx`
* 单页应用（SPA）中entryBase通常为：`src`
* 多页应用（MPA）中entryBase通常为：`src/pages/${pageName}`

利用`transformIndexHtml`钩子往模板中插入`<script type="module" src="entryFile"></script>`
```ts
export default function pageEntryPlugin(): PluginOption {
  return {
    name: 'wvs-page-entry',
    apply: 'serve',
    transformIndexHtml(html, ctx) {
      return html.replace('</body>', `<script type="module" src="${getPageEntry(ctx.originalUrl)}"></script>
        </body>
        `);
    },
  };
}
```
这里以SPA为例
```ts
function getPageEntry(reqUrl) {
  // SPA
  const SPABase = 'src';
  return getEntryFullPath(SPABase);
}
```
`getEntryFullPath` 实现如下
* 先判断目录是否存在
* 读取目录，遍历文件利用正则`/(index|main)\.[jt]sx?$/`判断文件是否为目标文件
```ts
const resolved = (...p) => path.resolve(getCWD(), ...p);
const getEntryFullPath = (dirPath) => {
  if (!existsSync(resolved(dirPath))) {
    return false;
  }
  // main|index.js|ts|jsx|tsx
  const entryName = /(index|main)\.[jt]sx?$/;
  const entryNames = readdirSync(resolved(dirPath), { withFileTypes: true })
    .filter((v) => {
      entryName.lastIndex = 0;
      return v.isFile() && entryName.test(v.name);
    });
  return entryNames.length > 0 ? path.join(dirPath, entryNames[0].name) : false;
};
```
将这个插件加入到配置里
```ts
import { pageEntryPlugin } from '../plugins/index';
module.exports = defineConfig({
  plugins: [
    pageEntryPlugin(),
  ]
});
```

启动demo查看效果，抛出了一堆错误
```sh
wvs start
```

下面是针对框架特定的处理
#### React
1. **React: the content contains invalid JS syntax**

React中将带有jsx语法的js文件后缀改为jsx,关于直接在js中使用jsx语法的处理方案，见文章：[解决Vite-React项目中.js使用jsx语法报错的问题](https://juejin.cn/post/7018128782225571853)

2. **Uncaught ReferenceError: React is not defined**

在 react组件顶部引入`React`,或引入`@vitejs/plugin-react`插件，同下3处理方案
```ts
import React from 'react';
```

3. **HMR支持**

引入[@vitejs/plugin-react](https://github.com/vitejs/vite/tree/main/packages/plugin-react)插件
```ts
import react from '@vitejs/plugin-react'

module.exports = defineConfig({
  plugins: [
    react(),
  ]
});
```
#### Vue
需要添加插件处理.vue文件

引入[@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)插件
```ts
import vue from '@vitejs/plugin-vue'

module.exports = defineConfig({
  plugins: [
    vue(),
  ]
});
```
同时 `@vitejs/plugin-vue` 需要 `vue` (>=3.2.13)

由于前面采用的是`npm link`创建软连接进行的调试，配置文件中会在开发目录下去查找Vue依赖，不会在指令运行目录下查找，会不断的抛出上述问题

这里在demo项目里本地安装我们的依赖，然后在package.json添加相关指令
```sh
yarn add file:webpack-vite-service-workspace-path
```
```json
{
  "scripts": {
    "vite": "wvs start -f vue"
  },
}
```

`Vue`项目中并没有`React`相关依赖，所以在Vue项目中不能引入`@vitejs/plugin-react`插件

可以在指令入口添加框架相关参数判断处理一下，只引入对应框架的插件
```ts
// src/bin.ts
program.command('start')
  .option('-f, --framework <type>', 'set project type [vue/react]')
  .action(startCommand);

// src/command/start.ts
export default function startCommand(options:{[key:string]:string}) {
  const { framework = '' } = options;
  process.env.framework = framework.toUpperCase();
}

// src/config/vite.ts
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';

const extraPlugins: any[] = [
  process.env.framework === 'REACT' ? [react()] : [],
  process.env.framework === 'VUE' ? [vue()] : [],
];
module.exports = defineConfig({
  plugins: [
    htmlTemplatePlugin(),
    pageEntryPlugin(),
    ...extraPlugins,
  ],
});
```
到此最关键的两个步骤就算完成了
### 5. 其它工程能力
目前针对webpack常见的能力，社区已经有了许多插件和方案，下面只做简单介绍

这些插件当然也有些场景可能处理不了，还是期望广大开发者，勇于实验，然后向插件作者提交PR/issues

* Sass/Less：在依赖中安装`Sass/Less`即可
* 组件库按需引入：[vite-plugin-style-import](https://www.npmjs.com/package/vite-plugin-style-import)
* process.env：[vite-plugin-env-compatible](https://github.com/IndexXuan/vite-plugin-env-compatible)
* window.xx/xx undefined：使用`transformIndexHtml`钩子开发插件，在模板中提前引入这个方法的`polyfill`或者兜底处理
* ...

## 总结
企业：大部分是拥有自己的研发框架，在研发框架中只需要加入一个Vite启动的CLI指令，这样对接入方的影响与使用成本是最小的

个人：喜欢折腾/不想改动原来的代码，可以按上述流程自己接一下，新项目可以直接使用Vite官方模板开发

总之：**开发中使用`Vite`还是很香的**

由于篇幅与时间都有限，文中部分地方只介绍了实现思路，并没粘贴完整代码，完整代码可在[源码仓库](https://github.com/ATQQ/webpack-vite-serve)中查看，也可`fork`直接进行二次开发

`webpack`向`vite`配置的转换这部分的内容将放在下期做介绍
<comment/>
<tongji/>