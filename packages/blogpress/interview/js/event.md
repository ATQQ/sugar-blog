---
isTimeLine: true
title: 事件的触发过程是怎么样的？知道什么是事件代理嘛？
date: 2020-04-14
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# 事件的触发过程是怎么样的？知道什么是事件代理嘛？

事件触发有三个阶段:
* 捕获阶段
* 目标阶段
* 冒泡阶段

如果同时注册``冒泡``与``捕获``,事件触发按照注册事件的顺序执行
```html
    <button id="btn">click me!!!</button>
    <script>
        let $btn = document.getElementById('btn')

        // 冒泡
        $btn.addEventListener('click', function (e) {
            alert('冒泡')
        }, false)
        // 捕获
        $btn.addEventListener('click', function (e) {
            alert('捕获')
        }, true)
    </script>
```
示例会先输出冒泡

**事件代理?**
* 如果一个节点中的子节点是动态生成的，那么子节点需要注册事件的话应该注册在父节点上

**优点**
* 节省内存,不需要给每个子节点注册一次
* 不需要给子节点注销事件

