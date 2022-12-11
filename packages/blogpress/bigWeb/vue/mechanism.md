---
sidebar:
 title: ❤运行机制概述
 step: 9
isTimeLine: true
title: 运行机制概述
date: 2020-04-14
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# 运行机制概述

![图片](https://img.cdn.sugarat.top/mdImg/MTU4NjgzMzgxNDE1OA==586833814158)
<center>全局概览</center>

## 初始化及挂载
* 在 new Vue() 之后。 Vue 会调用 _init 函数进行初始化
  * 初始化生命周期、事件、 props、 methods、 data、 computed 与 watch 等
  * **通过 Object.defineProperty 设置 setter 与 getter 函数，用来实现`响应式`以及`依赖收集`**
  * 初始化之后调用 $mount 挂载组件
    * 如果是运行时编译，即不存在 render function 
    * 存在 template 的情况，需要进行`编译`步骤。

## 编译
compile编译分为 <word title='解析'>parse</word>,
<word title='优化'>optimize</word>,
<word title='生成'>generate</word>三个阶段，最终需要得到 <word title='渲染函数'>render function</word>

### parse
使用正则表达式等方式`解析`Template模板中的指令,class,style等等数据,形成<word title='Abstract Syntax Tree' content='抽象语法树'>AST</word>

### optimize
optimize 的主要作用是<word content='这是 Vue 在编译过程中的一处优化'>标记 static 静态节点</word>，当 `update` 更新界面时，会有一个 `patch` 的过程， `diff` 算法会直接跳过静态节点，从而减少了比较的过程，优化了 `patch` 的性能

### generate
generate 是将 `AST` 转化成 `render function` 字符串的过程，得到结果是 render 的字符串以及 <word title='静态Render' content='静态 render 其实跟 render 是一样的，都是执行得到 Vnode,只是静态 render，没有绑定动态数据，即说不会变化'>staticRenderFns</word>字符串。

在经历过 `parse`,`optimize`,`generate`这三个阶段以后，组件中就会存在渲染 <word title='Virtual DOM' content='虚拟DOM是JavaScript对象'>VNode</word> 所需的 `render function` 了

## 响应式
`getter` 跟 `setter`在 init 的时候通过 Object.defineProperty 进行了绑定
* 当被设置的对象被读取的时候会执行 `getter` 函数
* 当被赋值的时候会执行 `setter` 函数

当 `render function` 被渲染的时候，因为会读取所需对象的值，所以会触发 `getter` 函数进行**依赖收集**,目的是将观察者 `Watcher` 对象存放到当前闭包中的订阅者 `Dep` 的 `subs` 中

![图片](https://img.cdn.sugarat.top/mdImg/MTU4Njg0NTExMjAxOA==586845112018)

修改对象的值的时候，会触发对应的 `setter`， `setter` 通知之前**依赖收集**得到的 `Dep` 中的每一个 `Watcher`，告知他们我的值改变了，需要重新渲染视图。这时候这些 `Watcher` 就会开始调用 `update` 来更新视图，当然这中间还有一个 `patch` 的过程以及使用队列来异步更新的策略

## Virtual DOM
`render function` 会被转化成 `VNode` 节点

* `Virtual DOM` 是一棵以 JavaScript 对象（ VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象
* 最终可以通过一系列操作使这棵树映射到真实环境上
* Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以它具有了跨平台的能力
  * 浏览器平台
  * Weex
  * Node
  * ...

**简单示例**
```js
{
    tag: 'div',                 
    children: [                 
        {
            tag: 'a',    
            text: 'click me'
        }
    ]
}
```
渲染为
```html
<div>
    <a>click me</a>
</div>
```

## 更新视图
在修改一个对象值的时候，会通过 `setter` -> `Watcher` -> `update` 的流程来修改对应的视图

当数据变化后，执行 `render function` 就可以得到一个新的 `VNode` 节点,将`新 VNode` 与`旧 VNode` 一起传入 `patch` 进行比较，经过 diff 算法得出它们的`差异`
,只需要将这些`差异`的对应 DOM 进行修改即可。

