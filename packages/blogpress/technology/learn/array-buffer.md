---
title: 实践：利用ArrayBuffer实现预览指定目录下的所有文件的内容
date: 2021-06-09
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 实践：利用ArrayBuffer实现预览指定目录下的所有文件的内容

## 效果
先上效果图，非常朴素，**没有用代码高亮插件**，**无样式表**

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzIzNTEyNzAzNw==623235127037)

* [完整实例源码](https://github.com/ATQQ/demos/blob/main/arraybuffer/README.md)

## ArrayBuffer是什么
>ArrayBuffer对象代表储存二进制数据的一段内存，它不能直接读写，只能通过视图（TypedArray视图和DataView视图)来读写，视图的作用是以指定格式解读二进制数据。

货比较硬，这里就不展开详细介绍，后续还是通过实例的方式介绍一下这些**硬货**的用处

* 详细了解: 推荐阅读[ECMAScript 6 入门 - ArrayBuffer 对象](https://es6.ruanyifeng.com/?search=ArrayBuffer&x=0&y=0#docs/arraybuffer)

## 读取文件内容
1. 通过使用 `FileReader.readAsArrayBuffer`方法将`File`对象转为`ArrayBuffer`
2. 使用`TextDecoder`将内容转为`utf8`格式的文本

```js
function readFile2Text(file) {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)
    return new Promise(resolve=>{
        fileReader.onload = function () {
            const buf = this.result
            const textDecoder = new TextDecoder('utf8')
            resolve(textDecoder.decode(buf))
        }
    })
}
```

当然这里也可直接用`FileReader.readAsText`

>为了契合主题强行`readAsArrayBuffer`

```js
function readFile2Text(file) {
    const fileReader = new FileReader()
    fileReader.readAsText(file)
    return new Promise(resolve=>{
        fileReader.onload = function () {
            resolve(this.result)
        }
    })
}
```

## 读取指定目录下的所有文件
使用`input`标签选择目录，只需要给`input`标签添加`webkitdirectory`与`multiple`属性即可,详细介绍请查阅[MDN:\<input type="file">](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/file):
* webkitdirectory: 只允许选择目录
* multople: 允许选择多个文件

**页面代码**
```html
<input type="file" id="file" webkitdirectory multiple>
```

监听dom的`onchange`事件，获取选择的所有文件（不包含空目录）

**逻辑**
```js
const $file = document.getElementById('file')

// 选择目录
$file.onchange = function () {
    const files = this.files
    // 打印获取所有的文件
    console.log(files)
}
```

每个file对象包含以下属性
```js
{
    name: String, // 文件吗
    size: Number, // 文件大小
    type: String, // 文件MIME类型
    webkitRelativePath: String, // 文件相对路径
}
```
## 树型目录生成
使用`ul`配合`li`实现

### Dom结构
```html
<div id="lists" style="width: 36%;">
    <ul>
        <li path="test" deep="0">test
            <ul>
                <li path="test/logo.jpeg" deep="1">logo.jpeg</li>
                <li path="test/1" deep="1">1
                    <ul>
                        <li path="test/1/1-2" deep="2">1-2
                            <ul>
                                <li path="test/1/1-2/index.js" deep="3">index.js</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</div>
```

展示
<div id="lists" style="width: 36%;">
    <ul>
        <li path="test" deep="0">test
            <ul>
                <li path="test/logo.jpeg" deep="1">logo.jpeg</li>
                <li path="test/1" deep="1">1
                    <ul>
                        <li path="test/1/1-2" deep="2">1-2
                            <ul>
                                <li path="test/1/1-2/index.js" deep="3">index.js</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</div>


### 具体实现

**页面代码**
```html
<input type="file" id="file" webkitdirectory multiple>
<div id="lists"></div>
```

**逻辑**

将文件的相对路径通过`/`拆分：`test/abc/index.js` => `['test','abc','index.js']`
```js
const $file = document.getElementById('file')
const $lists = document.getElementById('lists')
// 选择目录
$file.onchange = function () {
    const files = this.files
    // 全部清空
    $lists.innerHTML = ''
    // 拆解目录
    for (const f of files) {
        f.paths = f.webkitRelativePath.split('/')
    }
    appendDir($lists, files)
}
```

**appendDir**:
* parent：父节点
* files: 文件
* deep: 目录深度

通过此方法，生成指定某一级的目录

```js
function appendDir(parent, files, deep = 0) {
    const $ul = document.createElement('ul')
    // 使用Set存储所有的文件的公共前缀
    // 利用Set自动去重
    const dirs = new Set()
    for (const f of files) {
        // 取相同深度的目录
        const p = f.paths[deep]

        // 深度为0，说明是选择的那一个目录
        if (deep === 0) {
            dirs.add(p)
        } else {
            // 获取父节点对应的相对目录
            const parentP = parent.getAttribute('path')
            // 判断文件是否属于此父目录
            if (f.webkitRelativePath.startsWith(parentP)) {
                // 存放符合条件的文件路径
                dirs.add([parentP, p].join('/'))
            }
        }
    }
    // 
    for (const d of dirs) {
        const $li = document.createElement('li')

        // 只展示文件名/或目录名 (test/abc/index.js => index.js)
        const idx = d.lastIndexOf('/') + 1
        $li.textContent = idx===0 ? d : d.slice(idx)

        // 记录这个节点的深度与完整相对路径
        $li.setAttribute('path', d)
        $li.setAttribute('deep', deep)
        $ul.appendChild($li)
    }
    // 插入页面
    if (dirs.size !== 0) {
        parent.appendChild($ul)
    }
}
```

**利用事件代理监听li的点击事件**
```js
$lists.addEventListener('click', function (e) {
    const $li = e.target
    // 不是li不管
    if ($li.tagName.toLowerCase() !== 'li') {
        return
    }
    // 获取点击节点的路径与深度
    const path = $li.getAttribute('path')
    const deep = +$li.getAttribute('deep')

    // 获取选择的所有文件
    const files = $file.files

    // 遍历文件，判断点击的是文件还是目录

    for (const f of files) {
        // 点击的文件
        if (f.webkitRelativePath === path) {
            // 预览内容
            previewFile(f)
            return
        } 
    }

    // 有子项，点击的目录且未被点击添加过
    if ($li.children.length === 0) {
        appendDir($li, files, deep + 1)
    }
})
```

到此的生成目录效果如下:

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzI0MzcyMzA5Nw==623243723097)


## 最后
ArrayBuffer的内容还是比较多，本文只简单讲了利用其获取文件内容

本文主要内容还是实践生成目录的树形结构，由于时间仓促，代码还有很多的优化空间

