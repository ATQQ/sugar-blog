---
isTimeLine: true
title: 浏览器-事件循环机制
date: 2021-02-02
tags:
 - 大前端
 - 浏览器
categories:
 - 大前端
---
# 浏览器中的Event loop
## 前言
先简单聊聊JavaScript与此主题有关的其它内容，加深读者对内容的吸收与理解

### 解释性语言
>脚本语言是为了缩短传统的编写-编译-链接-运行（edit-compile-link-run）过程而创建的计算机编程语言

**脚本语言**编写的代码通常是**逐行解释执行**而非编译（c/c++,java），所以通常又叫做**解释性语言**

所以`javascript`与`python`,`shell`一样，也是一门优秀的解释性语言

制约解释性语言的性能瓶颈之一就是解释器，好在`javascript`有著名的V8（Android，Chrome）与JSCore（IOS，Safari）等优秀的解释器引擎,js得以大范围推广，它们是必不可少的功臣

### 单线程模型
`javascript`语言的一大特点就是单线程，即同一时间只能做一件事

**为什么是单线程？**

作为浏览器脚本语言，`javascript`的主要用途是与用户互动，以及操作DOM,这决定了它只能是单线程，否则会带来很复杂的同步问题

例如：假定`javascript`同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器不知道应该以哪个线程为准？

所以，为了避免复杂性，从一诞生，`javascript`就是单线程的

**单线程的优势**
* 不会出现因线程之间争夺资源导致的死锁现象
* 所有代码都是同步执行的
* 没有线程切换的资源开销

**单线程的缺点**
* 单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着

### 任务队列
浏览器中存在有很多耗时的任务的场景，网路请求(ajax),监听事件的传递,定时器等等

`javascript`语言的设计者意识到，这时主线程完全可以不管IO设备，挂起处于等待中的任务，先运行排在后面的任务。等到IO设备返回了结果，再回过头，把挂起的任务继续执行下去

于是对所有任务进行了划分，分为 **同步任务** 与 **异步任务**

#### 同步任务
在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务

即顺序执行

#### 异步任务
不进入主线程、而进入**任务队列**的任务

只有当**任务队列**通知主线程，某个异步任务可以执行了的时候，该任务才会进入主线程执行

当解释器引擎遇到异步任务时，会将其挂起，在**时机成熟**时，将其回调函数放入到任务队列中

打个比方，就像炒菜一样，锅里的东西一直在翻炒着(主线程)，各种调料（不同的异步任务）只会在需要的时候被加入锅里，然后完成其使命

### 异步机制

1. 所有同步任务都在主线程上执行，形成一个**执行栈**
2. 主线程之外，还存在一个**任务队列**，只要异步任务有了运行结果，就在"任务队列"之中放置一个事件
3. 一旦执行栈中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。哪些对应的异步任务，于是结束等待状态，进入执行栈，开始执行

只要主线程空了，就会去读取"任务队列"，这就是`javascript`的运行机制。主线程不断重复上面的第3步

### 事件与回调
"任务队列"是一个事件的队列，IO设备（鼠标，键盘等）完成一项任务，就在"任务队列"中添加一个事件，表示相关的异步任务可以进入"执行栈"了。主线程读取"任务队列"，就是读取里面有哪些事件

只要指定过**回调函数**，这些事件（鼠标点击，键盘按键，页面滚动等）发生时就会进入"任务队列"，等待主线程读取

所谓"回调函数"，就是那些会被主线程挂起来的代码。异步任务必须指定回调函数，当主线程开始执行异步任务，就是执行对应的回调函数

队列有先进先出的特性，主线程会优先读取任务队列最前面的事件

主线程的读取过程基本上是自动的，只要”执行栈“一清空，"任务队列"上第1位的事件就会自动进入主线程

针对于定时器事件，主线程会先检查一下执行时间，只有到了规定的时间，才能返回给主线程，即到了一定时间后才把事件对应的回调函数放入执行栈中

## Event loop
### 什么是Event Loop
也就是通常说的事件循环

>Event Loop是一个**执行模型**，在不同的地方(不同的语言)有不同的实现

js的事件循环负责执行代码、收集和处理事件以及执行队列中的子任务，与其它语言的模型截然不同

js的事件循环模型与许多其他语言相比有一个非常有趣的特性是，它**永不阻塞**,处理 I/O 通常通过事件和回调来执行

因此当一个应用正等待一个 AJAX 请求返回时，它仍然可以处理其它事情，如用户输入，鼠标点击/滚动等

### 什么是执行栈
执行栈可以认为是一个存储函数调用的``栈结构``，遵循先进后出的原则

js开始执行代码的时候会首先创建一个``main``函数,然后根据执行的代码,根据先进后出的原则,后执行的函数先弹出栈

这里有一个可视化执行栈的在线工具 -> [Loupe](http://latentflip.com/loupe)

示例
```js
function a(v){
    return v*4
}
function b(v){
    return a(v*3)
}
console.log(b(2))
```
进栈顺序
```js
1. main()
2. console.log(b(2))
3. b(2)
4. a(6)
```
出栈顺序
```js
1. a(6)  // 24
2. b(2)  // 24
3. console.log(b(2)) // 24
4. main()
```

使用递归的时候，因为栈可存放的函数是有限制的，一旦存放了过多的函数且没有得到释放的话，就会出现爆栈(如下图所示)

![图片](https://img.cdn.sugarat.top/mdImg/MTYxMTA2ODQxNTc5OQ==611068415799)


## 浏览器中的 Event Loop
通过上面的阐述，大概也是知道了js是如何执行的，了解了如何以单线程同步执行的方式处理异步任务的机制，下面开始详细描述一下执行的过程

执行 js 代码的时候其实就是往**执行栈**中放入函数/回调函数,当遇到异步的代码时，会被挂起并在需要执行的时候加入到 任务队列（有多种）中,一旦执行栈为空，时间循环机制 就会从 任务队列中拿出需要执行的代码并放入执行栈中执行

**所以本质上来说 js 中的异步依旧还是同步的行为**
### 任务源
不同任务源会被分到不同的任务队列中
#### 微任务
>微任务(microtask):jobs
* promise
* MutationObserver
* ...

#### 宏任务
>宏任务(macrotask):tasks
* script
* xhr
* setTimeout
* setInterval
* requestAnimationFrame
* I/O
* UI rendering
* ...

### Event Loop执行顺序
这里先抛出浏览器中js的事件循环的不同任务的执行顺序

在事件循环中，**每进行一次循环操作称为 tick**

1. 执行所有的同步代码
2. 执行完所有同步代码后，执行栈为空，查询是否有异步任务需要执行
3. 执行 `微任务`,如果在执行 微任务 的过程中，又产生了 微任务，那么会加入到 微任务的队列 的末尾，也会在这个周期被调用执行
4. 执行完所有微任务后，如有必要会渲染页面:
   * 判断document是否需要更新
     * 大部分显示设备还是 60Hz 的刷新率，所以 16.6ms 才会更新一次渲染
   * 判断是否有 resize 或者 scroll 事件，有的话会去触发事件
     * 所以 resize 和 scroll 事件也是至少 16.6ms 才会触发一次，即**自带节流**功能。
   * 判断是否触发了 media query（媒体查询）
   * 更新动画并且发送事件
   * 判断是否有全屏操作事件
   * 执行 requestAnimationFrame 回调
   * 执行 IntersectionObserver 回调，该方法用于判断元素是否可见，可以用于懒加载上
   * 更新界面
5. 开始下一轮 Event Loop ，从宏任务中取出一个执行,再然后微任务...

#### 小结归纳
* 宏任务一次只从宏任务队列中取一个任务执行，执行完后就去执行微任务队列中的任务
* 微任务队列中所有的任务都会被依次取出来执行，直到微任务队列为空；
* 执行UI rendering，它的时间节点是在执行完所有的微任务之后，下一个宏任务之前
* 定时器不是绝对准确的
  * SetTimeout/SetInterval只是在指定时间后将其回调函数放入到宏任务队列中

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzE0NTA5MTE0Mg==583145091142)

### 示例

下面通过一个示例来阐述一下代码的执行顺序
```js
console.log('script start')

async function async1() {
  await async2()

  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}

async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```

1. 执行同步代码 输出  `script start`
   * console.log('script start')
2. 执行async1中的同步代码输出`async2 end`
   * async1()
   * async2()
     * 因为函数有async标志，所以返回的是Promise，我们记为**P1**
   * console.log('async2 end')
   * await
     * await为让出线程的标志,即执行await async2()后就回到 async1外部
     * 而await 就是 generator 加上 Promise 的语法糖，且内部实现了自动执行 generator，所以这里又套上了一层Promise，我们记为**P2**,其包裹着**P1**
3. 遇到异步任务定时器，我们先给它挂起，记为 **S1**
4. 执行new Promise 的构造函数，输出 `Promise`
   1. console.log('Promise')
   2. resolve()
     * 生成新的微任务记为 **P3**
5. 执行同步代码输出 `script end`
6. 此时所有的同步代码执行完成，微任务与宏任务队列情况分别是
   1. 微任务:\[**P2**,**P3**\]
   2. 宏任务:\[**S1**\]
7. 执行所有的微任务
   1. 取出**P2**执行，产生新的微任务 **P1**加入到队列中 \[**P3**,**P1**\]
   2. 取出**P3**执行, 打印输出`promise1`,产生新的微任务 **P4** 加入队列中 \[**P1**,**P4**\]
   3. 取出**P1**执行, 无输出,产生新的微任务 **P5** 加入队列中 \[**P4**,**P5**\]
   4. 取出P4执行, 输出`promise2`,无新的任务产生 \[P5\]
   5. 取出P5执行, 输出`async1 end`,无新的任务产生 \[\]

#### 旧版浏览器的结果为

```js
// script start --> async2 end --> Promise --> script end --> promise1 --> promise2
// async1 end --> setTimeout
```
因为 await 后面跟着 Promise 的话，`async1 end` 需要等待3个 microtick 才能执行到

**async1** 其等价的v8**优化前**的旧版代码为
```js
function async1(){
  new Promise((resolve)=>{
    const p = new Promise(res=>res(async2()))
    p.then(()=>{
      console.log('async1 end')
      resolve()
    })
  })
}
```

#### 新版浏览器的结果为

```js
// script start --> async2 end --> Promise --> script end --> async1 end 
//  promise1 --> promise2 --> setTimeout
```
在本例中上述的 **P2**包裹**P1** 合并成了一个，即await后面如果是Promise将不会再进行一次Promise包装

**async1** 其等价的v8**优化后**的代码为
```js
function async1(){
  new Promise((resolve)=>{
    const p = Promise.resolve(async2())
    p.then(()=>{
      console.log('async1 end')
      resolve()
    })
  })
}
```

#### 小结
1. 在新版浏览器中，await promiseFun，3个 microtick 被优化为了 2个 microtick
   * new Promise 替换为了 Promise.resolve
   * Promise.resolve的参数如果是Promise则直接返回这个Promise

#### 补充
问题追溯可查看
* [更快的异步函数和 Promise](https://v8.js.cn/blog/fast-async/)
* [v8是怎么实现更快的 await ？深入理解 await 的运行机制](https://zhuanlan.zhihu.com/p/53944576)

### 自测
自测试1
```js
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3)
  });
});

new Promise((resolve, reject) => {
  console.log(4)
  resolve(5)
}).then((data) => {
  console.log(data);
})

setTimeout(() => {
  console.log(6);
})

console.log(7)
```

<details>
  <summary><mark><font color=darkred>点击查看答案</font></mark></summary>
  <p> 输出结果</p>
  <pre><code>  
  // 1 4 7 5 2 3 6
  </code></pre>
</details>

自测2
```js
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3)
  });
});

new Promise((resolve, reject) => {
  console.log(4)
  resolve(5)
}).then((data) => {
  console.log(data);
  
  Promise.resolve().then(() => {
    console.log(6)
  }).then(() => {
    console.log(7)
    
    setTimeout(() => {
      console.log(8)
    }, 0);
  });
})

setTimeout(() => {
  console.log(9);
})

console.log(10);
```
<details>
  <summary><mark><font color=darkred>点击查看答案</font></mark></summary>
  <p> 输出结果</p>
  <pre><code>  
  // 1 4 10 5 6 7 2 3 9 8
  </code></pre>
</details>


## 参考
* [阮一峰：JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
* [MDN：并发模型与事件循环 ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)

