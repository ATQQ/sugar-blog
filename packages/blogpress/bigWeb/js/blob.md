---
sidebar:
 title: blob与file
 step: 11
isTimeLine: true
title: blob与file
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# blob与file

Blob 对象表示一个二进制文件的数据内容,是Binary Large Object （二进制大型对象）的缩写
## Blob
### 实例属性
* size:大小
* type:类型
### 实例方法
* slice(start?,end?,contenType?):用来拷贝原来的数据，返回的也是一个Blob实例。

## Blob 应用场景
### 下载文件
responseType属性为blob，下载下来的就是一个 Blob 对象。
```js
function getBlob(url,callback){
    let xhr = new XMLHttpRequest()
    xhr.open('GET',url)
    xhr.responseType = 'blob'
    xhr.onload = function(){
        // 这里返回的就是一个blob
        callback(xhr.response);
    }
    xhr.send(null)
}
```
### 生成文件的临时url
比如选择图片文件时生成缩略图
```js
function getBlobUrl(blob){
    return URL.createObjectURL(blob)
}
```

## FileReader
读取Blob对象的内容
* readAsText:返回文本默认UTF-8
* readAsArrayBuffer:ArrayBuffer对象
* readAsDataURL:返回Data URL
* readAsBinaryString:返回原始二进制字符串

读取文本文件例子
```html
<input type="file" id="filePicker">
```
```js
let picker = document.querySelector('#filePicker')
let reader = new FileReader();
reader.onload = function () {
    var text = reader.result;
    let pre = document.createElement('pre')
    pre.textContent = text
    document.body.append(pre)
}
picker.addEventListener('change', function (e) {
    let file = e.currentTarget.files[0]
    reader.readAsText(file, "UTF-8")
})
```
## File 
File 实例对象是一个特殊的 Blob 实例，增加了``name``(文件名称)和``lastModifiedDate``(最后修改时间)属性。它继承了 Blob 对象，所有可以使用 Blob 对象的场合都可以使用它

最常见的获取方式就是``<input type="file">``，用户选中文件以后，浏览器就会生成一个数组，里面的内容就是选择的文件,它们都是 File 实例对象。

:::tip 参考
[网道JavaScript](http://wangdoc.com/javascript/bom/file.html#file-%E5%AF%B9%E8%B1%A1)
:::

