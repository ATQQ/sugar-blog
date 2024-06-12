# 博客构建性能优化笔记 | 提速 3 倍

笔者的博客基于 VitePress 搭建的，使用其自定义主题能力完成博客主题 [@sugarat/theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/theme) 的搭建。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/cba8352b9fdd1e26dfe2146dde30bc97)

前段时间有群友反馈说使用主题构建后耗时增加非常明显。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/5eb95eee23034a7cfb39d938fce52437)

前后耗时大概增加了 10 倍，过于离谱了。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/1c870dbc78093fa15454d3d6d1c32dfe)

断断续续的投入差不多 1 个月的时间完成了优化，效果还是很明显。

至此写篇文章记录&分享一下优化过程。

## 先看一下优化前后的效果

* 测试项目：[笔者的博客](https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress)，差不多 490 篇文章。
* 测试机器：Mac Mini (M1, 2020)

### 仅开启博客相关的样式能力

|                               VitePress 默认主题                                |                                   优化后主题                                    |                                   优化前主题                                    |
| :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
|                                     16.38s                                      |                                     20.56s                                      |                                     32.36s                                      |
| ![](https://cdn.upyun.sugarat.top/mdImg/sugar/20ccceb73d416e3341dab78e04ae3c7d) | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/d4752955e7fb980b79a655c9f7db3927) | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/978a478651b2186199eadcc732e1ae83) |
|                                    对比目标                                     |                                     +4.18s                                      |                                     +15.98s                                     |

### 开启拓展能力

[RSS](https://www.npmjs.com/package/vitepress-plugin-rss)，[pagefind 离线搜索](https://www.npmjs.com/package/vitepress-plugin-pagefind)

 |                                     优化后                                      |                                     优化后                                      |                                     优化前                                      |
 | :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
 |                          RSS不开启HTML生成 + 离线搜索                           |                                 RSS + 离线搜索                                  |                                 RSS + 离线搜索                                  |
 |                                     25.70s                                      |                                     30.93s                                      |                                     50.85s                                      |
 | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/77a35411fbea3f64936abfcc6622e2c2) | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/2fff5a8446c1b8a22ebd603d1759cd18) | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/4fb36cd4141dbba944cf66d88228e8b6) |
 |                                      +9.4s                                      |                                     +14.55s                                     |                                     +34.47s                                     |

### 小结

整体提速约 3 倍：

* 只开启基础能力：额外耗时从 16s 缩短至 4s
* 拓展能力耗时：额外耗时从 34s 缩短到 10 s

## 问题定位

先定位耗时的位置，再想办法进行优化。

我们可以直接用 `console.time` 和 `console.timeEnd` 打印出耗时信息。

```js
console.time('flag')
// 执行代码
console.timeEnd('flag') // 打印出耗时
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/3bbe8436fb53bb0baca9fdc7e6eda240)

主要关注有循环和外部调用的逻辑，在其前后加上打印耗时。

简单打了几个点，就有如下的结果咯 ⏰。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/4b9c8ea5149c417e65199050558d2614)

在主题入口和两个插件都有一段类似的代码逻辑，读取文件内容构造 meta 信息。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/7a6dcb360c7410855b915f05fb16ccf7)

## 优化方式

### 异步操作文件

读取文件内容用于提取 `frontmatter` 信息，生成描述，标题等内容，会用于首页渲染。

使用 `fs.promises` 异步操作文件，这样可以避免阻塞进程。

```js
// 原
fs.readFileSync(filePath, 'utf-8')
// 新
fs.promises.readFile(filePath, 'utf-8')
```

### 异步创建子进程

主要通过调用 `git` 指令获取文件最后的修改时间，用于展示文章的最后的修改时间。

原来使用的 `spawnSync`，同样也是同步执行的方法。

使用 `spawn + Promise` 替换 `spawnSync`，避免阻塞进程。

```js
// 原
spawnSync('git', ['log', '-1', '--pretty="%ci"', url])

// 新
const child = spawn('git', ['log', '-1', '--pretty="%ai"', url])
```

### 使用缓存

在日志里可以发现，Vite 插件里 `load` 钩子在 vitepress build 时执行了2次。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/974ca3b77ceb5724138bba0a9918eae0)

因此针对会重复执行的逻辑，可以添加添加一段缓存读写的逻辑，能明显降低二次执行相关逻辑的时间。

时间的获取使用 `Map` 缓存文件的日期信息，在文件路径不变的情况下复用上一次获取的内容

```js
const cache = new Map()

const cached = cache.get(url)
if (cached) {
  return cached
}
```

### 并发执行异步操作

如果是 `await new promise` 在执行的时候才创建和获取 promise 结果，提升不是特别明显。

比如 `spawn` 创建子进程调用，配合 `await promise`，在文章数量较多时，依然会有明显的耗时。

所以可以将文件内容和 git 时间的获取动作提前且并发执行。

```js
const contentPromises = files.reduce((prev, f) => {
  prev[f] = {
    contentPromise: fs.promises.readFile(f, 'utf-8'),
    datePromise: getFileBirthTime(f)
  }
  return prev
}, {})
```

但在测试的时候发现这样写偶尔会执行出错或提升不明显，大概是并发的执行的 Promise 和 spawn 创建子进程过多的关系。

于是引入 [p-limit](https://www.npmjs.com/package/p-limit) 来控制并发的 promise 数。

```js
import os from 'node:os'
import pLimit from 'p-limit'

const limit = pLimit(+(process.env.P_LIMT_MAX || os.cpus().length))
const metaPromise = limit(() => getArticleMeta())
```

这里默认值使用`os.cpus().length`来获取 CPU 核心的数量，这样创建的子进程能充分利用上多核的能力，不然并行值调得再大，也不会有明显的提升。

### 非必要第三方能力提供开关

有些能力，可能没有用到，但是打开就是会增加额外的耗时，**对文件做了不改变内容的分析与处理**。

在测试中发现 RSS 生成 HTML 的逻辑非常耗时，文件内容越多，耗时越多。

```js
const fileContent = fs.readFileSync(file, 'utf-8')
const { createMarkdownRenderer } = await import('vitepress')
const mdRender = await createMarkdownRenderer()
const html = mdRender.render(fileContent)
```

`vitepress` 内置使用的 `markdown-it` ，并且内置了许多的插件，html 作为 RSS 内容的组成也不是必要的部分，因此可以做成可选的能力，交由用户选择是否开启，同时将生成的方式也做成可配置的，用户可以传入更加精简的生成方法。

另一个是 markdown 图表的渲染，主题内置的 [mermaid](https://mermaid.nodejs.cn/) 相关插件，发现打开即使页面里没有使用，也会增加额外的耗时，且会增加非常的多。

因此将这个也弄成默认关闭，由用户自己选择是否开启，深度优化需要修改对应插件的源码，还没来得及研究这个计划后续再做。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/8ef3d9d54c4589808965322186e69426)

## 最后
个人觉得代码应该还有优化空间，下来再探索一下，攒一波有重大突破再来分享分享。

博客本身的优化，之前也发文章分享过来，感兴趣的可以看看：[博客性能优化笔记](./2024-blog-perf.md)

![](https://cdn.upyun.sugarat.top/mdImg/sugar/32ad0f558070d69b3f50bbcdc7a8c988)

没错：已经拉满了！