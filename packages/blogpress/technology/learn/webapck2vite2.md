---
title: webpack项目接入Vite的通用方案介绍-草稿
date: 2021-11-14
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# webpack 项目接入Vite的通用方案介绍-草稿

## 愿景
希望通过此系列文章，能给读者提供一个存/增量项目接入Vite的点子，起抛砖引玉的作用，减少这方面能力的建设成本

在阐述过程中同时也会逐渐完善[webpack-vite-serve](https://github.com/ATQQ/webpack-vite-serve)这个工具

读者可直接fork这个工具仓库，针对个人/公司项目场景进行定制化的二次开发

## 前言
在[上一期的文章](./webapck2vite.md)中，大概介绍了webpack项目接入Vite的处理思路，大体就是以下步骤：
* html模板处理
* entryJs处理
* [webpack配置](https://www.webpackjs.com/configuration/)向[vite配置](https://cn.vitejs.dev/config/)迁移
* 替代webpack插件的vite插件

这些内容的处理都是可以通过[vite插件](https://cn.vitejs.dev/guide/api-plugin.html)实现

## webpack-vite-serve介绍
这段时间就在不断完善这个库的功能，下面先简单介绍一下其使用，再阐述一些插件的实现原理

目标：**为webpack项目提供一键接入Vite的能力**

### 安装依赖
```sh
npm install webpack-vite-serve -D
# or
yarn add webpack-vite-serve -D
# or
pnpm add webpack-vite-serve -D
```

### 添加启动指令
```sh
# devServer
wvs start [options]
# build
wvs build [options]
```
### 可选参数
* `-f,--framework <type>`：指定使用的业务框架 (vue，react)，自动引入业务框架相关的基础插件
* `-s,--spa`：按照单页应用目录结构处理 `src/${entryJs}`
* `-m,--mpa`：按照多页应用目录结构处理 `src/pages/${entryName}/${entryJs}`
* `-d,--debug [feat]`：打印debug信息
* `-w,--wp2vite`：使用 [wp2vite](https://github.com/tnfe/wp2vite) 自动转换webpack文件

### 其它说明
项目遵循常规的 单页/多页应用 项目的目录结构即可

vite配置通过官方的`vite.config.[tj]s`配置文件拓展即可
### 效果
![图片](https://img.cdn.sugarat.top/mdImg/MTYzNjg3MzM4NzQzMQ==636873387431)

在线体验demo地址：已创建[stackblitz](https://stackblitz.com/edit/atqq-webpack-vite-serve-mstatq?devtoolsheight=33&file=README.md)

如由于网络原因无法访问，可clone仓库访问其中demo体验

## MPA支持
### Dev-页面模板
首先是`devServer`环境的页面模板处理

根据请求路径获取`entryName`
* 使用`/`拆分请求路径得到`paths`
* 遍历寻找第一个`src/pages/${path}`存在的`path`,此path即为`entryName`

```ts
function getEntryName(reqUrl:string, cfg?:any) {
  const { pathname } = new URL(reqUrl, 'http://localhost');
  const paths = pathname.split('/').filter((v) => !!v);
  const entryName = paths.find((p) => existsSync(path.join(getCWD(), 'src/pages', p)));
  if (!entryName) {
    console.log(pathname, 'not match any entry');
  }
  return entryName || '';
}
```

寻找模板文件，按照如下顺序探寻
* `src/pages/${entryName}/${entryName}.html`
* `src/pages/${entryName}/index.html`
* `public/${entryName}.html`
* `public/index.html`

```ts
function loadHtmlContent(reqPath:string) {
  // 兜底页面
  const pages = [path.resolve(__dirname, '../../public/index.html')];

  // 单页/多页默认 public/index.html
  pages.unshift(resolved('public/index.html'));

  // 多页应用可以根据请求的 路径 作进一步的判断
  if (isMPA()) {
    const entryName = getEntryName(reqPath);
    if (entryName) {
      pages.unshift(resolved(`public/${entryName}.html`));
      pages.unshift(resolved(`src/pages/${entryName}/index.html`));
      pages.unshift(resolved(`src/pages/${entryName}/${entryName}.html`));
    }
  }
  const page = pages.find((v) => existsSync(v));
  return readFileSync(page, { encoding: 'utf-8' });
}
```

### Dev-entryJs
多页应用的`entryJs`就按约定读取`src/pages/${entryName}/${main|index}`文件

```ts
function getPageEntry(reqUrl) {
  if (isMPA()) {
    const entryName = getEntryName(reqUrl);
    return !!entryName && getEntryFullPath(`src/pages/${entryName}`);
  }
  // 默认SPA
  const SPABase = 'src';
  return getEntryFullPath(SPABase);
}
```

## Build
vite构建的入口是`html`模板，可以通过`build.rollup.input`属性设置
```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'src/pages/index/index.html',
        second: 'src/pages/second/second.html',
      },
    },
  },
});
```
按照如上配置，构建产物中的html目录将会如下
```sh
* dist
  * src/pages/index/index.html
  * src/pages/second/second.html
  * assets
```
不太符合通常的习惯，常规格式如下
```sh
* dist
  * index.html
  * second.html
  * assets
```
所以需要通过插件`处理构建入口文件`和`调整构建后的产物位置`

### 插件结构
```ts
export default function BuildPlugin(): PluginOption {
  let userConfig:ResolvedConfig = null;
  return {
    name: 'wvs-build',
    // 只在构建阶段生效
    apply: 'build',
    // 获取最终配置
    configResolved(cfg) {
      userConfig = cfg;
    },
    // 插件配置处理
    config() {
      
    },
    resolveId(id) {

    },
    load(id) {

    },
    // 构建完成后
    closeBundle() {
      
    },
  };
}
```
通过`configResolved`钩子获取最终配置，配置提供给其它钩子使用

### 获取entry
首先获取`src/pages`下所有的entry
```ts
const entry = [];
if (isMPA()) {
  entry.push(...getMpaEntry());
} else {
  // 单页应用
  entry.push({
    entryName: 'index',
    entryHtml: 'public/index.html',
    entryJs: getEntryFullPath('src'),
  });
}
```
entry的定义为
```ts
interface Entry{
  entryHtml:string
  entryName:string
  entryJs:string
}
```
获取逻辑如下
* 先获取所有的`EntryName`
* 在遍历获取每个entry对应的`entryJs`与`entryHtml`
```ts
export function getMpaEntry(baseDir = 'src/pages') {
  const entryNameList = readdirSync(resolved(baseDir), { withFileTypes: true })
    .filter((v) => v.isDirectory())
    .map((v) => v.name);

  return entryNameList
    .map((entryName) => ({ entryName, entryHtml: '', entryJs: getEntryFullPath(path.join(baseDir, entryName)) }))
    .filter((v) => !!v.entryJs)
    .map((v) => {
      const { entryName } = v;
      const entryHtml = [
        resolved(`src/pages/${entryName}/${entryName}.html`),
        resolved(`src/pages/${entryName}/index.html`),
        resolved(`public/${entryName}.html`),
        resolved('public/index.html'),
        path.resolve(__dirname, '../../public/index.html'),
      ].find((html) => existsSync(html));
      return {
        ...v,
        entryHtml,
      };
    });
}
```
### 生成构建配置
根据得到的`entry`生成 `build.rollup.input`
* 获取每个`entryHtml`的内容,然后使用`map`进行临时的存储
* 构建入口模板路径`htmlEntryPath`取`entryJs`的目录加`index.html`

实际上`htmlEntryPath`这个路径并不存在任何文件

所以需要通过其它钩子，利用`htmlContentMap`存储的内容进行进一步的处理
```ts
const htmlContentMap = new Map();
// 省略其它无关代码
{
  config() {
    const input = entry.reduce((pre, v) => {
      const { entryName, entryHtml, entryJs } = v;
      const html = getEntryHtml(resolved(entryHtml), path.join('/', entryJs));
      const htmlEntryPath = resolved(path.parse(entryJs).dir, tempHtmlName);
      // 存储内容
      htmlContentMap.set(htmlEntryPath, html);
      pre[entryName] = htmlEntryPath;
      return pre;
    }, {});
    return {
      build: {
        rollupOptions: {
          input,
        },
      },
    };
  }
}
```

### 构建入口内容生成
其中`resolveId`与`load`钩子一起完成入口文件的处理
* 其中`id`即为资源请求的路径
* 接着直接从`htmlContentMap`去除模板的内容即可
```ts
{
  load(id) {
    if (id.endsWith('.html')) {
      return htmlContentMap.get(id);
    }
    return null;
  },
  resolveId(id) {
    if (id.endsWith('.html')) {
      return id;
    }
    return null;
  },
}
```

### 产物目录调整
使用`closeBundle`钩子，在构建完成后，服务关闭前进行文件调整
* 遍历`entry`将`dist/src/pages/entryName/index.html`移动到`dist`下
* 移除`dist/src`下的内容
```ts
closeBundle() {
  const { outDir } = userConfig.build;
  // 目录调整
  entry.forEach((e) => {
    const { entryName, entryJs } = e;
    const outputHtmlPath = resolved(outDir, path.parse(entryJs).dir, tempHtmlName);
    writeFileSync(resolved(outDir, `${entryName}.html`), readFileSync(outputHtmlPath));
  });
  // 移除临时资源
  rmdirSync(resolved(outDir, 'src'), { recursive: true });
}
```
## webpack配置转换
目前社区有一个CLI工具：[wp2vite](https://github.com/tnfe/wp2vite)支持了这个功能，所以笔者不打算从0-1再建设一个

由于是cli工具，没有提供一些直接调用的方法去获取转换前后的配置，所以**接入插件中的使用体验还不是很好，后续准备提PR改造一下这个工具**

接入wp2vite的插件实现如下
```ts
import wp2vite from 'wp2vite';
// 省略不重要的 import
export default function wp2vitePlugin(): PluginOption {
  return {
    name: 'wvs-wp2vite',
    enforce: 'pre',
    async config(_, env) {
      const cfgFile = resolved('vite.config.js');
      const tplFile = resolved('index.html');
      const contentMap = new Map([[cfgFile, ''], [tplFile, '']]);
      const files = [cfgFile, tplFile];

      console.time('wp2vite');
      // 判断是否存在vite.config.js 、index.html
      // 避免 wp2vite 覆盖
      files.forEach((f) => {
        if (existsSync(f)) {
          contentMap.set(f, readFileSync(f, { encoding: 'utf-8' }));
        }
      });

      // 转换出配置文件vite.config.js
      await wp2vite.start(getCWD(), {
        force: false,
        // 统一开启debug
        debug: !!process.env.DEBUG,
      });

      // TODO:提PR优化
      // 转换耗时计算
      console.timeEnd('wp2vite');

      // 获取wp2vite转换出的配置
      const cfg = await getUserConfig(env, 'js');

      contentMap.forEach((v, k) => {
        if (v) {
          // 如果修改了内容，还原内容
          writeFileSync(k, v);
        } else {
          // 移除创建的文件
          unlinkSync(k);
        }
      });

      if (cfg.config) {
        const { config } = cfg || {};
        // 留下需要的配置
        return {
          resolve: config?.resolve,
          server: config?.server,
          css: config?.css,
        };
      }

      return null;
    },
  };
}
```
wp2vite，对外暴露了一个`start`方法调用

调用后会根据项目的webpack配置生成2个新文件(`vite.config.js`，`index.html`)，并修改`package.json`添加指令与依赖

所以在生成前如果项目中存在这些文件则需要先将这些内容存储起来

其中获取用户配置的`getUserConfig`实现如下
```ts
import { loadConfigFromFile, ConfigEnv } from 'vite';

export function getUserConfig(configEnv:ConfigEnv, suffix = '') {
  const configName = 'vite.config';
  const _suffix = ['ts', 'js', 'mjs', 'cjs'];
  if (suffix) {
    _suffix.unshift(suffix);
  }
  const configFile = _suffix.map((s) => `${configName}.${s}`).find((s) => existsSync(s));
  return loadConfigFromFile(configEnv, configFile);
}
```
vite提供了`loadConfigFromFile`方法，只需要在此方法中做一层简单的封装即可直接使用，方法内部使用esbuild自动对ts与es语法进行了转换

## 总结
到目前为止，建设的能力已基本能够满足常规项目的开发

能力未及之处用户亦可直接在工程中添加`vite`配置文件进行自行的拓展

## 后续规划
1. 目前`wp2vite`在配置转换这一块，还不能太满足使用要求，准备提PR增强一下
2. 将内部能力抽成一个个单独的vite插件

