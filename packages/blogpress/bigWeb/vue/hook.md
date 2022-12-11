---
sidebar:
 title: 生命周期钩子
 step: 2
isTimeLine: true
title: 生命周期钩子
date: 2020-04-14
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# 生命周期钩子

## beforeCreated
* 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用

* 获取不到 props 或者 data 中的数据的，这些数据的初始化都在 initState

## created
* 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前尚不可用。

* 可以访问到之前不能访问到的数据，但是这时候组件还没被挂载，所以是看不到的

## beforeMount
* 在挂载开始之前被调用：相关的 render 函数首次被调用。

* **该钩子在服务器端渲染期间不被调用。**

* 开始创建 VDOM(虚拟DOM)

## mounted
* 实例被挂载后调用，这时 el 被新创建的 vm.$el 替换了。 如果根实例挂载到了一个文档内的元素上，当mounted被调用时vm.$el也在文档内。

* mounted 不会保证所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以在 mounted 内部使用 vm.$nextTick：

```js
mounted: function () {
  this.$nextTick(function () {
    // Code that will run only after the
    // entire view has been rendered
  })
}
```
* **该钩子在服务器端渲染期间不被调用。**
* 将 VDOM 渲染为真实 DOM 并且渲染数据。组件中如果有子组件的话，会递归挂载子组件，只有当所有子组件全部挂载完毕，才会执行根组件的挂载钩子

## beforeUpdate
* 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。

* **该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。**
* 数据更新前调用


## updated
* 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
* 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。
* 注意 updated 不会保证所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以在 updated 里使用 vm.$nextTick：
```js
updated: function () {
  this.$nextTick(function () {
    // Code that will run only after the
    // entire view has been re-rendered
  })
}
```

* **该钩子在服务器端渲染期间不被调用。**
* 数据更新后调用

## activated 与 deactivated
``keep-alive``独有的生命周期

* 前者:被 keep-alive 缓存的组件激活时调用。
* 后者:被 keep-alive 缓存的组件停用时调用。
* 用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数。

## beforeDestroy
* 实例销毁之前调用。在这一步，实例仍然完全可用。
* **该钩子在服务器端渲染期间不被调用。**
* 适合:移除事件、定时器,否则可能会引起内存泄露

## destroyed
* 实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。
* **该钩子在服务器端渲染期间不被调用。**
* 所有子组件都销毁完毕后才会执行根组件的 destroyed 钩子函数

