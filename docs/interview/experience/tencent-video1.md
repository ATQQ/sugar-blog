# 腾讯视频一面
## 编程题
<detail>
<template v-slot:title>

### 1. 拓展Array排序,考虑时间,空间复杂度,越低越好
</template>

```js
function swap(arr, left, right) {
    let t = arr[left]
    arr[left] = arr[right]
    arr[right] = t
}
// 快排
function quickSort(array) {
    const _quickSort = (arr, left, right) => {
        if (left >= right) {
            return
        }
        let o = left
        let start = left
        let end = right
        while (left < right) {
            while (arr[right] >= arr[o] && right > left) {
                right--
            }
            while (arr[left] <= arr[o] && left < right) {
                left++
            }
            if (left !== right) {
                swap(arr, left, right)
            }
        }
        swap(arr, o, left)
        _quickSort(arr, start, left - 1)
        _quickSort(arr, left + 1, end)
    }
    _quickSort(array, 0, array.length - 1)
}

// 插入排序 (元素个数小于10个时使用)
function insertion(array) {
    let { length } = array
    for (let i = 1; i < length; i++) {
        for (let j = i - 1; j >= 0 && array[j] > array[j + 1]; j--) {
            swap(array, j, j + 1)
        }
    }
}

Array.prototype.mySort = function () {
    let argv = this
    if (argv.length < 11) {
        insertion(argv)
    } else {
        quickSort(argv)
    }
    return argv
}

let a = [1, 3, 2, 2, 32, 13,
 53, 13, 423, 34, 2, 34,
 2, 34, 2, 42, 213, 4542,
  2, 313, 1, 2]
let b = [1, 3, 2, 42, 213, 4542, 313, 1, 2]
a.mySort()
b.mySort()
console.log(a)
console.log(b)
```
</detail>

<detail>
<template v-slot:title>

### 2.一张90*90的图片由9个表情组成,每10s随机显示其中一个
</template>

```html
<div class="emoji"> </div>
```
```css
.emoji {
    width: 30px;
    height: 30px;
    background-image: url(http://img.cdn.sugarat.top/mdImg/MTU4NDE1NjM1Nzg2Mg==584156357862);
    background-size: 90px 90px;
    background-position: 0 0;
}
```
```js
let $emoji = document.querySelector('.emoji')

function rand() {
    return (~~(Math.random() * 100) % 3) * 30
}

function loop() {
    let x = rand()
    let y = rand()
    $emoji.style.backgroundPosition = `${x}px ${y}px`
    setTimeout(loop, 10000)
}
loop()
```
[codePen:示例](https://codepen.io/sugarInSoup/pen/qBdoMeX)

</detail>

<detail>
<template v-slot:title>

### 3.弹性9宫格布局,9个表情(30*30),每10秒随机显示一个
</template>

```html
<div class="emojis">
    <img class="emoji" src="http://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163"></img>
    <img class="emoji" src="http://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163"></img>
    <img class="emoji" src="http://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163"></img>
    <img class="emoji" src="http://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163"></img>
    <img class="emoji" src="http://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163"></img>
    <img class="emoji" src="http://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163"></img>
    <img class="emoji" src="http://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163"></img>
    <img class="emoji" src="http://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163"></img>
    <img class="emoji" src="http://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163"></img>
</div>
```
```css
.emojis {
    display: flex;
    width: 91px;
    height: 91px;
    flex-wrap: wrap;
}

.emoji {
    width: 30px;
    height: 30px;
    visibility: hidden;
    box-sizing: border-box;
}
```
```js
// 获取到所有的
let $emojis = document.querySelectorAll('.emoji')
// 记录上次展示和当前展示的
let oldFlag = 4, newFlag = 4;
function loop() {
    $emojis[oldFlag].style.visibility = 'hidden'
    $emojis[newFlag].style.visibility = 'visible'
    oldFlag = newFlag
    newFlag = ~~(Math.random() * 100) % 9
    setTimeout(loop, 1000)
}
loop()
```
[codePen查看示例](https://codepen.io/sugarInSoup/pen/poJLxJJ)

</detail>

## JS
### [1.event loop](./../js/eventloop.md)
<detail>
<template v-slot:title>

### 2.nodejs中的进程与线程
</template>

>Node.js 中的进程 Process 是一个全局对象，无需 require 直接使用，给我们提供了当前进程中的相关信息。Node.js 中进程可以使用 child_process 模块创建。

**关系：**
* 一个线程只能属于一个进程，而一个进程可以有多个线程，但至少有一个线程（通常说的主线程）。
* 同一进程的所有线程共享该进程的所有资源。
* 进程在执行过程中，需要协作同步。不同进程的线程间要利用消息通信的办法实现同步。
* 处理机分给线程，即真正在处理机上运行的是线程。
* 线程是指进程内的一个执行单元，也是进程内的可调度实体。

**区别：**
* 调度：线程作为调度和分配的基本单位，进程作为拥有资源的基本单位。
* 拥有资源：进程是拥有资源的一个独立单位，线程不拥有系统资源，但可以访问隶属于进程的资源。

</detail>


## webpack
### 1.loader
>loader 让 webpack 能够去处理那些非 ``JavaScript`` 文件（webpack 自身只理解 JavaScript）,loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块

### 2.plugin
>插件可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。
## 浏览器
### [1.缓存机制](./../performance/cache.md)
### [2.性能优化](./../performance/README.md)
* 开发中有在什么地方使用过性能优化?
## CSS
<detail>
<template v-slot:title>

### 1.垂直居中
</template>

```html
<style>
.parent{
    width:600px;
    height:600px;
    background-color:bisque;
}
.child{
    width:60px;
    height:60px;
    background-color:black;
}
</style>
<div class='parent'>
    <div class='child'></div>
</div>
```
1. 定位1
```css
.parent {
    position: relative;
}

.child {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
```
2. 定位2
```css
.parent {
    position: relative;
}

.child {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
```
3. flex
```css
.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}
```
4. 定位+margin
```css
.child {
    position: relative;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-50%);
}
```
</detail>

### 2.弹性布局兼容性
```css
.container{  
    display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */  
    display: -moz-box; /* Firefox 17- */  
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */  
    display: -moz-flex; /* Firefox 18+ */  
    display: -ms-flexbox; /* IE 10 */  
    display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */  
}  
```
## 网络
### [1.概述Http](./../internet/http.md)
### [2.概述TCP与UDP](./../internet/tcp.md)
* 三次握手,每次握手的作用?
  * 三次握手的目的:
    * 防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误
    * 三次握手可以保证任何一次握手的失败都是可感知的，不会浪费资源
* [http2特点](./../internet/http.md#http-2)
* 如何使用http2,http2的使用条件
* https与http的区别
* TLS协议握手过程,如何工作的
* HTTP3中使用QUIC协议基于UDP的原因
* 一个http请求是线程还是进程?
  * 答:线程

## [操作系统](./../os/README.md)
### 1.进程与线程的概念
### 2.进程与线程的区别
### 3.进程之间如何切换
### 4.进程与线程如何工作

<comment/>
<tongji/>