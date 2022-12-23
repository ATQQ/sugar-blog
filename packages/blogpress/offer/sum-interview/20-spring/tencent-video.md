---
isTimeLine: true
title: 腾讯-腾讯视频
date: 2020-10-23
tags:
 - 备战春秋
 - 2020春招
categories:
 - 备战春秋
---
# 腾讯-腾讯视频
## 一面
### 编程题
1. 拓展Array排序,考虑时间,空间复杂度,越低越好

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


2. 一张90*90的图片由9个表情组成,每10s随机显示其中一个

```html
<div class="emoji"> </div>
```
```css
.emoji {
    width: 30px;
    height: 30px;
    background-image: url(https://img.cdn.sugarat.top/mdImg/MTU4NDE1NjM1Nzg2Mg==584156357862);
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

<iframe height="265" style="width: 100%;" scrolling="no" title="tencent-video1-p1" src="https://codepen.io/sugarInSoup/embed/qBdoMeX?height=265&theme-id=dark&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/sugarInSoup/pen/qBdoMeX'>tencent-video1-p1</a> by sugar
  (<a href='https://codepen.io/sugarInSoup'>@sugarInSoup</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


3. 弹性9宫格布局,9个表情(30*30),每10秒随机显示一个

```html
<div class="emojis">
    <img class="emoji" src="https://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163">/>
    <img class="emoji" src="https://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163">/>
    <img class="emoji" src="https://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163">/>
    <img class="emoji" src="https://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163">/>
    <img class="emoji" src="https://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163">/>
    <img class="emoji" src="https://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163">/>
    <img class="emoji" src="https://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163">/>
    <img class="emoji" src="https://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163">/>
    <img class="emoji" src="https://img.cdn.sugarat.top/mdImg/MTU4NDE1NzU4NTE2Mg==584157585163">/>
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
<iframe height="265" style="width: 100%;" scrolling="no" title="tencent-video1-p2" src="https://codepen.io/sugarInSoup/embed/poJLxJJ?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/sugarInSoup/pen/poJLxJJ'>tencent-video1-p2</a> by sugar
  (<a href='https://codepen.io/sugarInSoup'>@sugarInSoup</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### JS
1. event loop
2. nodejs中的进程与线程

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



### webpack
1.loader
>loader 让 webpack 能够去处理那些非 ``JavaScript`` 文件（webpack 自身只理解 JavaScript）,loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块

2. plugin
>插件可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。
### 浏览器
1. 缓存机制
2. 性能优化
3. 开发中有在什么地方使用过性能优化?

### CSS
1. 垂直居中

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

2. 弹性布局兼容性
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
### 网络
1. [概述Http](./../../../computerBase/Internet/http.md)
2. [概述TCP与UDP](./../../../computerBase/Internet/tcp-udp.md)
3. 三次握手,每次握手的作用?
  * 三次握手的目的:
    * 防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误
    * 三次握手可以保证任何一次握手的失败都是可感知的，不会浪费资源
4. [http2特点](./../../../computerBase/Internet/http.md#http-2)
5. 如何使用http2,http2的使用条件
6. https与http的区别
7. TLS协议握手过程,如何工作的
8. HTTP3中使用QUIC协议基于UDP的原因
9. 一个http请求是线程还是进程?
  * 答:线程

### 操作系统
1. 进程与线程的概念
2. 进程与线程的区别
3. 进程之间如何切换
4. 进程与线程如何工作


## 二面
### 算法与数据结构
1. 二叉树的深度优先(DFS)与广度优先(BFS)遍历分别使用什么数据结构?如何实现?
* DFS:栈
* BFS:队列
```js
// DFS
function dfs(root){
    let stack = []
    if(!root){
        stack.push(root)
    }
    while(stack.length!==0){
        let node = stack.pop()
        console.log(node.value)
        if(node.right){
            stack.push(node.right)
        }
        if(node.left){
            stack.push(node.left)
        }
    }
}
// BFS
function bfs(root){
    let queue = []
    if(!root){
        queue.push(root)
    }
    while(queue.length!==0){
        let node = queue.shift()
        console.log(node.value)
        if(node.left){
            stack.push(node.left)
        }
        if(node.right){
            stack.push(node.right)
        }
    }
}
```
2. 哈希表冲突处理规则?
* 线性探测再散列:冲突后存储在冲突后一个位置，如果仍然冲突继续向后
* 链地址法:产生hash冲突后在存储数据后面加一个指针，指向后面冲突的数据
![图片](https://img.cdn.sugarat.top/mdImg/MTU4NTEyNjUyNjM5OQ==585126526399)

3. 统计一篇英文文章中出现次数最多的N个单词?(提示使用某种数据结构)
   1. 暴力解法排序:使用map统计后排序,O(NlogN)
   2. 使用局部排序(冒泡):
```js
function swap(array, left, right) {
  let t = array[left]
  array[left] = array[right]
  array[right] = t;
}

function topK(arr, k) {
  for (let i = 0; i < k; i++) {
    for (let j = arr.length - 1; j > i; j--) {
      if (arr[j].count > arr[j - 1].count) {
        swap(arr, j, j - 1)
      }
    }
  }
  return arr.slice(0, k);
}
// 统计
let testStr = 'Hello1 World2 Hello1 World3 Hello1 World1 Hello2 World2 Hello3 World3'
let wordsMap = {}
testStr.split(' ').forEach(v => {
  if (wordsMap[v]) {
    wordsMap[v]++
  } else {
    wordsMap[v] = 1
  }
})

// 转为数组
let wordsArr = Object.keys(wordsMap).map(v => {
  return {
    value: v,
    count: wordsMap[v]
  }
})

// 输出结果
topK(wordsArr, 3).forEach(v => console.log(v.value))
```
4. 给你root1和root2两颗二叉搜索树,请你返回一个列表,其中包含两课树中所有整数并按升序排序。
5. 快排的时间复杂度?最坏是什么情况?最好是什么情况?#

### 浏览器
1. 跨域的原因是什么?你有哪些方案可以解决?
2. Cookie,sessionStorage/localStorage之间有什么区别?
3. 浏览器中打开多个标签(同一个地址),标签之间有哪些本地通信方案?
4. [浏览器的全局属性有哪些](https://www.cnblogs.com/xiaohuochai/p/5033039.html)?
5. 常用操作dom方法有哪些
6. 事件代理你了解吗?原理是什么

### JS
1. 简单介绍一下闭包,他有什么作用

### html/css
1. 指定样式的方法有哪些?
2. 样式优先级计算策略?
3. 你知道的[默认内联样式](https://www.cnblogs.com/l-hf/p/11542150.html)的标签有哪些?
4. display有哪些属性?
5. display:none;与visible:hidden有什么区别

### 安全
1. 什么是CSRF?一般是如何伪造CSRF的?如何预防?

### 性能优化
1. 如何加快首屏渲染?你有哪些方案?
2. 操作dom应注意什么?有什么优化方案?

### 网络
1. 浏览器输入url到页面渲染发生了什么?
2. 在浏览器中http有请求数量限制吗?它的策略是怎样的?
3. http与https有什么区别?
4. https是如何保证数据安全的?
5. Http2是如何消除队头阻塞的?
6. TLS协议如何工作的?

### 数据库
1. 你了解哪些数据库?
2. mysql中如何更改表的结构?
3. 你使用redis的场景是什么?

### 非技术性问题
1. 你是如何学习前端的?
2. 你对未来有什么规划?
3. 有考研的打算吗?为什么不考研?

## 三面
### 操作系统
1. 指针占几个字节
2. 内存地址是几位?为什么?
3. 什么是虚拟内存?有什么作用?
4. 代码在执行编译时发生了什么?链接发生了什么?

### 网络
1. http与https有什么区别?
2. TCP/IP分别属于哪一层?

### 数据库
1. 如何限定查询的字段与过滤查询的数据?
2. [你了解索引吗?有什么作用?如何设置?](https://blog.csdn.net/weixin_42181824/article/details/82261988)

### 开放性问题
1. 你觉得你的优势是什么?
2. 你觉得自己有哪些不足?
3. 你对未来有什么规划?

### 智力题
1. AB 两个火车相向而行,A上有个无人机C在AB之前来回飞行,问AB相遇时无人机跑了多远?
2. 白帽子黑帽子问题:一群人戴着黑帽或者白帽参加一个舞会,每个人都知道人群中至少有一顶黑帽,每次开灯过一会儿就关闭,如果觉得自己是黑帽的就拍拍手:
```sh
第一次开灯:没有人拍手
第二次开灯:也没有人拍手
第三次开灯:就有人拍手了

问人群中有几个人是黑帽?
```

## 一面
上个部门，挂了过了几天又被捞起来重新面

### JS
1. promise与async/await的作用分别是什么
2. promise与async/await的使用常景
3. this指向
4. 遍历数组哪种方式最优，为什么

### 浏览器
1. 浏览器DOM事件周期
2. 阅读题
```html
<parent><child></child></parent>
<!-- 点击child -->
```
   * 监听child,回调e.stopProportion(),e.target 指向谁
   * 监听parent,回调e.stopProportion(),e.target 指向谁
   * 监听parent,回调e.stopProportion(),e.target 指向谁,e.currentTarget 指向谁

### CSS
1. 
```html
<body><div id='child' style='position:absolute;'>内容</div></body>
```
下面各个属性的效果
   * left:0;right:0;top:0;bottom:0;
   * left:0;top:0;
   * right:0;bottom:0;
2. 如何做主题(皮肤)切换
3. 知道css变量吗

### VUE
1. Vue生命周期
2. 场景题权限控制:如何根据不同权限进行页面跳转,当进入没有权限的页面时跳转

### 网络
1. HTTP常见状态码
2. HTTP常用头部

### 浏览器
1. 解决跨域的方式有哪些
2. 什么是预检请求
3. 跨域请求如何携带cookie

### 安全
4. 什么是XSS?有哪些预防手段
5. 什么是CSRF?有哪些预防手段
6. 什么是DNS劫持?有哪些预防手段

