---
title: 我打造的在线简历生成应用
date: 2021-02-28
tags:
 - 备战春秋
 - 面试经验
categories:
 - 备战春秋
---
# 我打造的在线简历生成应用

## 前言

半个月前，我写了一篇文章[如何书写一份好的互联网校招简历](https://juejin.cn/post/6928390537946857479)，目的是帮助即将开始投递校招的同学更好的完善自己的简历

在文章中也立下了一个Flag

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUwMTIwOTAzMQ==614501209031)

看了一下Github的 [commit记录](https://github.com/ATQQ/resume/commits/main)，截止目前大概花了一周的时间，把心中所设想的方案做了出来，也许不完美，但我想应该也能帮助到部分同学

好东西当然展示三遍，O(∩_∩)O~~
* [体验链接](https://resume.sugarat.top/)
* [体验链接](https://resume.sugarat.top/)
* [体验链接](https://resume.sugarat.top/)

对模板样式(颜色，排版)不满意的，懂前端魔法的同学可以clone[仓库](https://github.com/ATQQ/resume),施展一下自己的魔法美化

对项目感兴趣的同学也欢迎[贡献](https://github.com/ATQQ/resume/blob/main/README.md)一下自己喜欢的简历模板（代码），理论上不限制开发技术栈，当然也欢迎提issues或者建议

本文主要讲一下此项目的设计思路，技术方案以及遇到的一些问题与解决思路（用了不少hack技巧）

## 项目设计
### 布局

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUwNzM0ODgzNw==614507348837)

整个应用的基本页面结构
```html
<body>
    <header>
        <!-- 导航 -->
        <nav></nav>
    </header>
    <div>
        <!-- 展示简历 -->
        <iframe></iframe>
        <!-- 控制区域 -->
        <div></div>
    </div>
</body>
```

可能有朋友在这里会疑惑为什么要用iframe？
>这里先给大家简单介绍一下，后面在讲技术方案的时候会给大家解释

在我的设想中简历部分**只有展示逻辑**，可以看作是一个独立的纯静态页面

既然是只做展示，那么无论什么前端魔法都可以做这个工作，于是为了方便各种魔法师施法，就把这一块独立了出来，简历模板贡献者也只需要关心自己如何复原一个静态页面就行，其余的交互逻辑都交给父页面统一处理


### 技术选型

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUwODgzNzIxMA==614508837210)

> Vanilla JS——世界上最轻量的JavaScript框架（没有之一） ---- **原生js**

整个应用的主体部分采用原生js实现

简历展示部分理论上可以采用任意前端技术栈实现，与父页面低耦合


### 通信

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUwOTM4NDkwOQ==614509384909)

* 通过导航栏切换各种简历模板
* 简历上的改动自动同步到控制区域中的页面描述信息
* 控制区域中改动页面描述信息，简历内容实时更新

### 描述简历

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUxMDA2Nzk0MA==614510067940)

* 使用json 对简历的结构与内容进行描述
* 一个模板对应一个json

### 页面描述信息展示
![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUxMTMxNTQyMg==614511315422)

* 使用JSON描述简历上的各种信息
* 提供一个JSON编辑器
* 这里json编辑器采用 [jsoneditor](https://github.com/josdejong/jsoneditor)

### 数据存取

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUxMDU2Njg0NQ==614510566845)

* 整个数据流是单向的，外部负责更新，内部（简历展示部分）只负责读取
* 数据存放在本地，因此不担心个人信息泄露
* 这里采用 `localStorage`

### 第一版效果
![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUxMTcxNzAwNQ==614511717005)

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUxODIzOTU1OQ==614518239559)


下面就介绍项目实现的关键部分内容

## 实现
### 项目目录结构
```
./config                         webpack配置文件
├── webpack.base.js             -- 公共配置
├── webpack.config.build.js     -- 生产环境特有配置
├── webpack.config.dev.js       -- 开发环境特有配置
├── webpack.config.js           -- 引用的配置文件
│
./public            公共静态资源
├── css   
│   └── print.css  打印时用的样式
│
./src       核心代码
├── assets          静态资源css/img
├── constants       常量
│   ├── index.js    存放导航的名称映射信息
│   ├── schema      存放每个简历模板的默认JSON数据,与pages中的模板一一对应
│   └────── demo1.js   
├── pages           简历模板目录
│   └── demo1       -- 其中的一个模板
│
├── utils           工具方法
├── app.js          项目的入口js
├── index.html      项目的入口页面
```

### 约定优于配置
根据约定好的目录结构，通过自动化的脚本

所有模板都统一在 src/pages/xxx 目录下

页面模板约定为 `index.html`,该目录下的所有js文件将被自动添加到webpack的entry中，自动注入到 当前 页面模板中

例如
```
./src
├── pages          
│   └── xxx
│   └───── index.html
│   └───── index.scss
│   └───── index.js
```

此处自动化生成entry/page配置**代码可移步**至[这里](https://github.com/ATQQ/resume/blob/2c5e75f8b7b824b2436d3f02c5e304390d05d83c/config/fileUtil.js#L99-L118)查看

自动生成的结果如下

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUxNDA2NTU5MQ==614514065591)

每个HTMLWebpackPlugin的内容格式如下

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUxNDI3ODI5NQ==614514278295)

### 自动生成导航栏
首页顶部有一个导航栏用于切换简历模板的路由

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUxNDU5Mzc1MA==614514593750)

这部分的链接内容如果手动填写是很无趣的，**如何实现自动生成的呢**？

首先首页模板的header nav 部分内容为

```html
<header>
    <nav id="nav">
        <%= htmlWebpackPlugin.options.pageNames %>
    </nav>
</header>
```

`htmlWebpackPlugin.options` 表示 `HTMLWebpackPlugin`对象的的`userOptions`属性

咱们上面拿到了了所有Page的title，将所有title使用`,`连接拼接在一起，然后绑定到`userOptions.pageNames`上，则页面初次渲染结果就变成了

```html
<header>
    <nav id="nav">
        abc,demo1,vue1,react1,introduce
    </nav>
</header>
```
有了初次渲染结果，接下来咱们写一个方法把这些内容转为`a`标签即可

```js
const navTitle = {
    'demo1': '模板1',
    'react1': '模板2',
    'vue1': '模板3',
    'introduce': '使用文档',
    'abc': '开发示例'
}

function createLink(text, href, newTab = false) {
    const a = document.createElement('a')
    a.href = href
    a.text = text
    a.target = newTab ? '_blank' : 'page'
    return a
}

/**
 * 初始化导航栏
 */
function initNav(defaultPage = 'react1') {
    const $nav = document.querySelector('header nav')
    // 获取所有模板的链接---处理原始内容
    const links = $nav.innerText.split(',').map(pageName => {
        const link = createLink(navTitle[pageName] || pageName, `./pages/${pageName}`)
        // iframe中打开
        return link
    })

    // 加入自定义的链接
    links.push(createLink('Github', 'https://github.com/ATQQ/resume', true))
    links.push(createLink('贡献模板', 'https://github.com/ATQQ/resume/blob/main/README.md', true))
    links.push(createLink('如何书写一份好的互联网校招简历', 'https://juejin.cn/post/6928390537946857479', true))
    links.push(createLink('建议/反馈', 'https://www.wenjuan.com/s/MBryA3gI/', true))

    // 渲染到页面中
    const t = document.createDocumentFragment()
    links.forEach(link => {
        t.appendChild(link)
    })
    $nav.innerHTML = ''
    $nav.append(t)
}

initNav()
```
这样导航栏就“自动“生成了

### 自动导出页面描述

**目录**
```
./src
├── constants      
│   ├── index.js
│   ├── schema.js
│   ├── schema    
│   ├────── demo1.js  
│   ├────── react1.js  
│   └────── vue1.js
```

每个页面的默认数据从./src/constants/schema.js中读取
```js
import abc from './schema/abc'
import demo1 from './schema/demo1'
import react1 from './schema/react1'
import vue1 from './schema/vue1'

export default{
    abc,demo1,react1,vue1
}
```

而每个模板的描述内容分布在 schema目录下，如果让每个开发者手动往schema.js添加自己模板，容易造成冲突，所以干脆自动生成


工具方法移步至[这里](https://github.com/ATQQ/resume/blob/2c5e75f8b7b824b2436d3f02c5e304390d05d83c/config/fileUtil.js#L30-L32)查看
```js
/**
 * 自动创建src/constants/schema.js 文件
 */
function writeSchemaJS() {
    const files = getDirFilesWithFullPath('src/constants/schema')
    const { dir } = path.parse(files[0])
    const targetFilePath = path.resolve(dir, '../', 'schema.js')
    const names = files.map(file => path.parse(file).name)
    const res = `${names.map(n => {
        return `import ${n} from './schema/${n}'`
    }).join('\n')}

export default{
    ${names.join(',')}
}`
    fs.writeFileSync(targetFilePath, res)
}
```

### 数据存取
数据的存取操作在父页面和子页面都会用到，抽离为公共方法

数据存放于localStorage中,以每个简历模板的路由作为**key**

**./src/utils/index.js**
```js
import defaultSchema from '../constants/schema'

export function getSchema(key = '') {
    if (!key) {
        // 默认key为路由 如 origin.com/pages/react1
        // key就为 pages/react1
        key = window.location.pathname.replace(/\/$/, '')
    }
    // 先从本地取
    let data = localStorage.getItem(key)
    // 如果没有就设置一个默认的再取
    if (!data) {
        setSchema(getDefaultSchema(key), key)
        return getSchema()
    }
    // 如果默认是空对象的则再取一次默认值
    if (data === '{}') {
        setSchema(getDefaultSchema(key), key)
        data = localStorage.getItem(key)
    }
    return JSON.parse(data)
}

export function getDefaultSchema(key) {
    const _key = key.slice(key.lastIndexOf('/') + 1)
    return defaultSchema[_key] || {}
}

export function setSchema(data, key = '') {
    if (!key) {
        key = window.location.pathname.replace(/\/$/, '')
    }
    localStorage.setItem(key, JSON.stringify(data))
}
```

### json描述的展示
需要在控制区域展示json的描述信息，展示部分采用 [jsoneditor](https://github.com/josdejong/jsoneditor)

当然jsoneditor也支持各种数据操作（CRUD）都支持，还提供了快捷操作按钮

这里采用cdn的方式引入jsoneditor

```html
<link rel="stylesheet" href="https://img.cdn.sugarat.top/css/jsoneditor.min.css">
<script src="https://img.cdn.sugarat.top/js/jsoneditor.min.js"></script>
```

初始化
```js
/**
 * 初始化JSON编辑器
 * @param {string} id 
 */
function initEditor(id) {
    let timer = null
    // 这里做了一个简单的防抖
    const editor = new JSONEditor(document.getElementById(id), {
        // json内容改动时触发
        onChangeJSON(data) {
            if (timer) {
                clearTimeout(timer)
            }
            // updatePage方法用于通知子页面更新
            setTimeout(updatePage, 200, data)
        }
    })
    return editor
}

const editor = initEditor('jsonEditor')
```

展示效果

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDUxODc2MDE5Ng==614518760196)

json数据展示/更新时机
* 因为每次切换路由都会触发iframe的onload事件
* 所以将获取editor更新json内容的时机放在这里

```js
function getPageKey() {
    return document.getElementById('page').contentWindow.location.pathname.replace(/\/$/, '')
}

document.getElementById('page').onload = function (e) {
    // 更新editor中显示的内容
    editor.set(getSchema(getPageKey()))
}
```



### 编写模板页面

下面提供了4种方式实现同一页面

**期望的效果**

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDQ4MDYyMjQ1Ng==614480622456)

**描述文件**

在schema目录下创建页面的json描述文件,如abc.js
```
./src
├── constants
│   └── schema
│   └────── abc.js  
```

abc.js
```js
export default {
    name: '王五',
    position: '求职目标： Web前端工程师',
    infos: [
        '1:很多文字',
        '2:很多文字',
        '3:很多文字',
    ]
}
```

**期望的渲染结构**
```html
<div id="resume">
    <div id="app">
        <header>
            <h1>王五</h1>
            <h2>求职目标： Web前端工程师</h2>
        </header>
        <ul class="infos">
            <li>1:很多文字<li>
            <li>2:很多文字<li>
            <li>3:很多文字<li>
        </ul>
    </div>
</div>
```

下面开始子编写代码

与父页面**唯一相关的逻辑**就是需要在子页面的window上挂载一个refresh方法，用于父页面主动调用更新

**原生js**
```js
import { getSchema } from "../../utils"

window.refresh = function () {
    const schema = getSchema()
    const { name, position, infos } = schema
    // ... render逻辑
}
```

**vue**
```vue
<script>
import { getSchema } from '../../utils';
export default {
  data() {
    return {
      schema: getSchema(),
    };
  },
  mounted() {
    window.refresh = this.refresh;
  },
  methods: {
    refresh() {
      this.schema = getSchema();
    },
  },
};
</script>
```

**react**
```jsx
import React, { useEffect, useState } from 'react'
import { getSchema } from '../../utils'

export default function App() {
    const [schema, updateSchema] = useState(getSchema())
    const { name, position, infos = [] } = schema
    useEffect(() => {
        window.refresh = function () {
            updateSchema(getSchema())
        }
    }, [])
    return (
        <div>
            { /* 渲染dom的逻辑 */ }
        </div>
    )
}
```

**为方便阅读，代码进行了折叠**

首先是样式，这里选择sass预处理语言，当然也可以用原生css

<details>
    <summary>index.scss</summary>

```scss
@import './../../assets/css/base.scss';
html,
body,
#resume {
  height: 100%;
  overflow: hidden;
}
// 上面部分是推荐引入的通用样式

// 下面书写我们的样式
$themeColor: red;

#app {
  padding: 1rem;
}

header {
  h1 {
    color: $themeColor;
  }
  h2 {
    font-weight: lighter;
  }
}

.infos {
  list-style: none;
  li {
    color: $themeColor;
  }
}
```
</details>

其次是页面描述文件

<details>
    <summary>index.html</summary>

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <%= htmlWebpackPlugin.options.title %>
    </title>
</head>

<body>
    <div id="resume">
        <div id="app">

        </div>
    </div>
</body>

</html>
```
</details>

**下面就开始使用各种技术栈进行逻辑代码编写**

<details>
    <summary>原生js</summary>

**目录结构**

```
./src
├── pages          
│   └── abc
│   └───── index.html
│   └───── index.scss
│   └───── index.js
```

**index.js**
```js
import { getSchema } from "../../utils"
import './index.scss'

window.refresh = function () {
    const schema = getSchema()
    const { name, position, infos } = schema

    clearPage()
    renderHeader(name, position)
    renderInfos(infos)
}

function clearPage() {
    document.getElementById('app').innerHTML = ''
}

function renderHeader(name, position) {
    const html = `
    <header>
        <h1>${name}</h1>
        <h2>${position}</h2>
    </header>`
    document.getElementById('app').innerHTML += html
}

function renderInfos(infos = []) {
    if (infos?.length === 0) {
        return
    }
    const html = `
    <ul class="infos">
    ${infos.map(info => {
        return `<li>${info}</li>`
    }).join('')}
    </ul>`
    document.getElementById('app').innerHTML += html
}

window.onload = function () {
    refresh()
}
```


</details>

<details>
    <summary>Vue</summary>

**目录结构**
```
./src
├── pages          
│   └── abc
│   └───── index.html
│   └───── index.scss
│   └───── index.js
│   └───── App.vue
```

**index.js**

```js
import Vue from 'vue'
import App from './App.vue'
import './index.scss'

Vue.config.productionTip = process.env.NODE_ENV === 'development'

new Vue({
    render: h => h(App)
}).$mount('#app')
```

**App.vue**

```vue
<template>
  <div id="app">
    <header>
      <h1>{{ schema.name }}</h1>
      <h2>{{ schema.position }}</h2>
    </header>
    <div class="infos">
      <p
        v-for="(info,
        i) in schema.infos"
        :key="i"
      >
        {{ info }}
      </p>
    </div>
  </div>
</template>

<script>
import { getSchema } from '../../utils';
export default {
  data() {
    return {
      schema: getSchema(),
    };
  },
  mounted() {
    window.refresh = this.refresh;
  },
  methods: {
    refresh() {
      this.schema = getSchema();
    },
  },
};
</script>
```
</details>

<details>
    <summary>React</summary>

**目录结构**
```
./src
├── pages          
│   └── abc
│   └───── index.html
│   └───── index.scss
│   └───── index.js
│   └───── App.jsx
```

**index.js**
```js
import React from 'react'
import ReactDOM from 'react-dom';
import App from './App.jsx'
import './index.scss'

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('app')
)
```

**App.jsx**
```jsx
import React, { useEffect, useState } from 'react'
import { getSchema } from '../../utils'

export default function App() {
    const [schema, updateSchema] = useState(getSchema())
    const { name, position, infos = [] } = schema
    useEffect(() => {
        window.refresh = function () {
            updateSchema(getSchema())
        }
    }, [])
    return (
        <div>
            <header>
                <h1>{name}</h1>
                <h2>{position}</h2>
            </header>
            <div className="infos">
                {
                    infos.map((info, i) => {
                        return <p key={i}>{info}</p>
                    })
                }
            </div>
        </div>
    )
}
```

</details>

<details>
    <summary>jQuery</summary>

**目录结构**
```
./src
├── pages          
│   └── abc
│   └───── index.html
│   └───── index.scss
│   └───── index.js
```

**index.js**
```js
import { getSchema } from "../../utils"
import './index.scss'

window.refresh = function () {
    const schema = getSchema()
    const { name, position, infos } = schema

    clearPage()
    renderHeader(name, position)
    renderInfos(infos)
}

function clearPage() {
    $('#app').empty()
}

function renderHeader(name, position) {
    const html = `
    <header>
        <h1>${name}</h1>
        <h2>${position}</h2>
    </header>`
    $('#app').append(html)
}

function renderInfos(infos = []) {
    if (infos?.length === 0) {
        return
    }
    const html = `
    <ul class="infos">
    ${infos.map(info => {
        return `<li>${info}</li>`
    }).join('')}
    </ul>`
    $('#app').append(html)
}

window.onload = function () {
    refresh()
}
```

</details>

如果觉得导航栏展示abc不友好，当然也可以更改

```
./src
├── constants    
│   ├── index.js    存放路径与中文title的映射
```

**./src/constants/index.js** 中加入别名
```js
export const navTitle = {
    'abc': '开发示例'
}
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDQ5MDMyMDA3Nw==614490320077)

### 子页面更新
前面在实例化editor的时候有一个 `updatePage` 方法

如果子页面有refresh方法则直接 调用其进行页面的更新，当然在更新之前父页面会把最新的数据存入到localStorage中

这样页面之间实际没有直接交换数据，一个负责写，一个负责读，即使写入失败也不影响子页面读取原有的数据

```js
function refreshIframePage(isReload = false) {
    const page = document.getElementById('page')
    if (isReload) {
        page.contentWindow.location.reload()
        return
    }
    if (page.contentWindow.refresh) {
        page.contentWindow.refresh()
        return
    }
    page.contentWindow.location.reload()
}

function updatePage(data) {
    setSchema(data, getPageKey())
    refreshIframePage()
}

/**
 * 初始化JSON编辑器
 * @param {string} id 
 */
function initEditor(id) {
    let timer = null
    // 这里做了一个简单的防抖
    const editor = new JSONEditor(document.getElementById(id), {
        // json内容改动时触发
        onChangeJSON(data) {
            if (timer) {
                clearTimeout(timer)
            }
            // updatePage方法用于通知子页面更新
            setTimeout(updatePage, 200, data)
        }
    })
    return editor
}

const editor = initEditor('jsonEditor')
```

### 导出pdf
#### PC端
首先PC端浏览器支持打印导出pdf

**如何触发打印呢？**

* 鼠标右键选择打印
* 快捷键 Ctrl + P
* `window.print()`

咱们这里代码里使用第三种方案

**如何确保打印的内容只有简历部分?**

这个就要用到媒体查询

方式一
```css
@media print {
    /* 此部分书写的样式还在打印时生效 */
}
```

方式二
```html
<!-- 引入的css资源只在打印时生效 -->
<link rel="stylesheet" href="./css/print.css" media="print">
```

只需要在打印样式中将无关内容进行隐藏即可

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDU2NjIzMjYyNQ==614566232625)

基本能做到1比1的还原

#### 移动端
采用[jsPDF](https://github.com/MrRio/jsPDF) + [html2canvas](https://github.com/niklasvh/html2canvas)

1. html2canvas 负责将页面转为图片
2. jsPDF负责将图片转为PDF

```js
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
}
// 导出pdf
// 当然这里确保图片资源被转为了base64，否则导出的简历无法展示图片
html2canvas(document.getElementById('page').contentDocument.body).then(canvas => {
    //返回图片dataURL，参数：图片格式和清晰度(0-1)
    var pageData = canvas.toDataURL('image/jpeg', 1.0);
    //方向默认竖直，尺寸ponits，格式a4[595.28,841.89]
    var doc = new jsPDF('', 'pt', 'a4');
    //addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
    // doc.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28 / canvas.width * canvas.height);
    doc.addImage(pageData, 'JPEG', 0, 0, 595.28, 841.89);
    doc.save(`${Date.now()}.pdf`);
});
```

但目前此种导出方式还存在一些问题尚未解决，后续换用其它方案进行处理
1. 不支持超链接
2. 不支持iconfont
3. 字体的留白部分会被剔除

### 小结
到这里整个项目的雏形算完成了
* 导航栏切换简历模板
* 在JSON编辑器中改动`json` -> 页面数据更新
* 导出pdf
  * 移动端 - jspdf
  * 电脑 - 打印

## 高能操作
### 高亮变动的内容
诉求：在json编辑器中进行了内容的更新，期望能在简历中高亮展示出变动的内容

转为技术需求就是期望能监听到变动的dom，然后高亮

这个地方就用到 [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)了

它提供了监视对DOM树所做更改的能力

```js
/**
 * 高亮变化的Dom
 */
function initObserver() {
    // 包含子孙节点
    // 将监视范围扩展至目标节点整个节点树中的所有节点
    // 监视指定目标节点或子节点树中节点所包含的字符数据的变化
    const config = { childList: true, subtree: true, characterData: true };

    // 实例化监听器对象
    const observer = new MutationObserver(debounce(function (mutationsList, observer) {
        for (const e of mutationsList) {
            let target = e.target
            if (e.type === 'characterData') {
                target = e.target.parentElement
            }
            // 高亮
            highLightDom(target)
        }
    }, 100))
    // 监听子页面的body
    observer.observe(document.getElementById('page').contentDocument.body, config);
    // 因为 MutationObserver 是微任务，微任务后面紧接着就是页面渲染
    
    // 停止观察变动
    // 这里使用宏任务，确保此轮Event loop结束
    setTimeout(() => {
        observer.disconnect()
    }, 0)
}

function highLightDom(dom, time = 500, color = '#fff566') {
    if (!dom?.style) return
    if (time === 0) {
        dom.style.backgroundColor = ''
        return
    }
    dom.style.backgroundColor = '#fff566'
    setTimeout(() => {
        dom.style.backgroundColor = ''
    }, time)
}
```

**何时调用 initObserver**

当然是在更新页面之前的时候注册事件，页面完成变动渲染后停止监听
```js
function updatePage(data) {
    // 异步的微任务，本轮event loop结束停止观察
    initObserver()
    // 同步
    setSchema(data, getPageKey())
    // 同步 + 渲染页面
    refreshIframePage()
}
```

**效果**

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDU2ODM4MjQzNw==%E6%B7%B1%E5%BA%A6%E5%BD%95%E5%B1%8F_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210301111206.gif)

### 点哪改哪

**期望效果**
![图片](https://img.cdn.sugarat.top/mdImg/MTYxNDU3MzIyODM5Mw==resume-update.gif)

诉求：
* 点击需要修改的部分,就能进行修改操作
* 修改结果在简历上与json编辑器中进行内容同步

下面阐述一下实现

**1. 获取点击的Dom**
```js
document.getElementById('page').contentDocument.body.addEventListener('click', function (e) {
    const $target = e.target
})
```

**2. 获取dom内容在页面中出现的次数与相对位置**
1. 子页面只包含展示逻辑，所以需要父页面做hack操作才能在定位点击内容在json中对应位置
2. 拥有相同内容的dom不止一个，所以需要全部找出来

```js
/**
 * 遍历目标Dom树，找出文本内容与目标一致的dom组
 */
function traverseDomTreeMatchStr(dom, str, res = []) {
    // 如果有子节点则继续遍历子节点
    if (dom?.children?.length > 0) {
        for (const d of dom.children) {
            traverseDomTreeMatchStr(d, str, res)
        }
        // 相等则记录下来
    } else if (dom?.textContent?.trim() === str) {
        res.push(dom)
    }

    return res
}

// 监听简历页的点击事件
document.getElementById('page').contentDocument.body.addEventListener('click', function (e) {
    const $target = e.target
    // 点击的内容
    const clickText = $target.textContent.trim()
    // 只包含点击内容的节点
    const matchDoms = traverseDomTreeMatchStr(document.getElementById('page').contentDocument.body, clickText)
    // 点击的节点在 匹配的 节点中的相对位置
    const mathIndex = matchDoms.findIndex(v => v === $target)
    // 不包含则不做处理
    if (mathIndex < 0) {
        return
    }
})
```

**3. 获取jsoneditor中对应的节点**
* 与上面逻辑类似
* 先过滤出只包含此节点内容的几个节点
* 然后根据点击dom在同内容节点列表中的相对位置进行匹配

```js
// 监听简历页的点击事件
document.getElementById('page').contentDocument.body.addEventListener('click', function (e) {
    // ...省略上述列出的代码

    // 解除上次点击的dom高亮
    highLightDom($textarea.clickDom, 0)
    // 高亮这次的10s
    highLightDom($target, 10000)


    // 更新jsoneditor中的search内容
    editor.searchBox.dom.search.value = clickText
    // 主动触发搜索
    editor.searchBox.dom.search.dispatchEvent(new Event('change'))

    // 将点击内容显示在textarea中
    $textarea.value = clickText
    
    // 自动聚焦输入框
    if (document.getElementById('focus').checked) {
        $textarea.focus()
    }

    // 记录点击的dom,挂载$textarea上
    $textarea.clickDom = e.target

    // jsoneditor 搜索过滤的内容为模糊匹配,比如搜索 a 会匹配 ba,baba,a,aa,aaa
    // 根据上面得到的matchIndex,进行精确匹配全等的json节点
    let i = -1
    for (const r of editor.searchBox.results) {
        // 全等得时候下标才变动
        if (r.node.value === clickText) {
            i++
            // 匹配到json中的节点
            if (i === mathIndex) {
                // 高亮一下$textarea
                $textarea.style.boxShadow = '0 0 1rem yellow'
                setTimeout(() => {
                    $textarea.style.boxShadow = ''
                }, 200)
                return
            }
        }
        // 手动触发jsoneditor的next search match  按钮, 切换jsoneditor中active的节点
        editor.searchBox.dom.input.querySelector('.jsoneditor-next').dispatchEvent(new Event('click'))
        // active的节点可以通过下面方式获取
        // editor.searchBox.activeResult.node
    }
})
```

**4. 更新节点内容**
1. 上面两个步骤将简历中的dom与jsoneditor的dom都获取到了
2. 通过textarea输入的内容
3. 将输入的内容分别更新到这两个dom上,并把最新的json写入的localStorage中

```js
// 监听输入事件,并做一个简单的防抖
 $textarea.addEventListener('input', debounce(function () {
    if (!editor.searchBox?.activeResult?.node) {
        return
    }
    // 激活dom变动事件
    initObserver()

    // 更新点击dom
    $textarea.clickDom.textContent = this.value

    // 更新editor的dom
    editor.searchBox.activeResult.node.value = this.value
    editor.refresh()

    // 更新到本地
    setSchema(editor.get(), getPageKey())

}, 100))
```

这样就完成了两侧(简历/jsoneditor)数据的更新


## 后续规划
1. 接入更多的框架支持
2. 优化pdf的导出
   1. 超链接
   2. 字体图标
3. 优化用户体验
   1. 降低jsoneditor的存在感,当前的新增与删除操作依赖jsoneditor,对不懂前端魔法的同学不友好
   2. 优化移动端的交互
   3. 美化界面
4. 加入自动生成代码模板指令
5. 接入更多的模板

