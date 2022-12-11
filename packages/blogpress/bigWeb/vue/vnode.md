---
sidebar:
 title: ❤VNode实现
 step: 11
isTimeLine: true
title: 实现VNode节点
date: 2020-04-14
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# 实现 VNode 节点
## VNode?
`render function` 会被转化成 `VNode` 节点

`Virtual DOM` 其实就是一棵以 JavaScript 对象（VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，如浏览器平台、Weex、Node 等

## 简单实现
```js
class VNode{
    constructor(tag,data,children,text.element){
        // 节点标签名称
        this.tag = tag
        // 节点的数据信息 props,attr 等等
        this.data = data
        // 子节点
        this.children = children
        // 节点的文本
        this.text = text
        // 虚拟节点对应的真实dom
        this.element = element
    }
}
```

**示例**

vue组件
```js
<template>
  <span class="demo" v-show="isShow">
    This is a span.
  </span>
</template>
```

生成的js对象
```js
function render(){
    return new VNode('span',{
        // 指令集合
        directives:[
            {
                /* v-show指令 */
                rawName: 'v-show',
                expression: 'isShow',
                name: 'show',
                value: true
            }
        ],
        /* 静态class */
        staticClass: 'demo'
    },[undefined,undefined,undefined,'This is a span.'])
}
```
转换为VNode
```js
{
    tag:'span',
    data:{
        directives:[
            {
                rawName:'v-show',
                expression:'isShow',
                name:'show',
                value:true 
            }
        ],
        staticClass:'demo'
    },
    text:
    children:[
        {
            tag:undefined,
            data:undefined,
            text:'This is a span',
            chidlren:[]
        }
    ]
}
```

**方法封装**
```js
// 空节点
function createEmptyVNode(){
    const node = new VNode()
    node.text = ''
    return node
}

// 文本节点
function createTextVNode(val){
    const node = new VNode()
    node.text = String(val)
    return node
}

// 克隆节点
function cloneVNode(node){
    return new VNode(node.tag,node.data,node.children,node.text,node.element)
}
```
**总结**

* VNode 就是一个 JavaScript 对象,用 JavaScript 对象的属性来描述当前节点的一些状态
* 用 VNode 节点的形式来模拟一棵 Virtual DOM 树

