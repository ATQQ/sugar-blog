---
title: 优雅的处理挂载window上的函数可能不存在的情况
date: 2021-09-01
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 优雅的处理挂载window上的函数可能不存在的情况

## 背景
在做一个Web JS SDK（A）时，内部会用到另一个Web JS SDK（B）的方法。（文中后续用A/B代替两者）

B通常会提供Script和NPM包两种使用方式

::: warning 使用npm引入的缺点
* 增加包体积
* 如果这个SDK被Web应用已经引入过页面，那么理论上可直接使用，不必要再整一个
:::

如果SDK B包含script引入的方式，目标页面也存在可能会引入B的情况，那么优先考虑使用Script引入依赖的SDK的情况：例如
* 目标页面已经引入过JQuery（符合SDK A的使用需求），那么SDK A就可以直接使用已经存在的`$`进行操作即可，不必再创建jQuery的script
* 通常页面都会接入埋点监控等基建服务SDK B，SDK A也需要通过B进行数据的上报

## 衍生需求
* 挂载在window上的函数不存在时，自动通过script或者polyfill（垫片方法）补全这个方法
* 调用方依旧按照SDK B的文档进行使用

```js
window.sdkB(options)
```

## 解决方案
编写一个通用的工具函数，处理上述的`衍生需求`

方法定义如下
```ts
function patchWindowFun(
  key: string,
  value: string | Function,
  options?: {
    afterScriptLoad?: Function
    beforeAppendScript?: Function
    alreadyExistCB?: Function
    async?: boolean
    defer?: boolean
  },
)
```
总共支持传入3个参数:
1. `key`：带判断的方法在window上的属性名
2. `value`：不存在时的取值（function 表明直接使用此方法代替，string类型表明方法来源外部加载的js资源）
3. `options`：是一些可选的配置项，主要用于处理使用过外部js资源加载方法的场景
   1. `afterScriptLoad`：资源加载完成后的回掉
   2. `beforeAppendScript`：资源加载前的回掉
   3. `alreadyExistCB`：方法如果已经存在执行的回掉
   4. `async`：控制script的**async**属性
   5. `defer`：控制script的**defer**属性

由于大多数web sdk都会存在需要调用特定函数或者方法进行初始化的情况，固提供了`afterScriptLoad`,`beforeAppendScript`,`alreadyExistCB`三个钩子函数处理不同时机初始化的情况

## 方法实现
如果目标属性存在则直接执行相应的回掉，不做进一步处理
```js
  if (window[key]) {
    alreadyExistCB && alreadyExistCB()
    console.log(key, 'already exist')
    return
  }
```

目标属性不存在，传入的方法存在时直接进行赋值
```js
  // 函数直接赋值
  if (typeof value === 'function') {
    window[key] = value
    return
  }
```

剩余逻辑则是处理方法从外部js资源加载的情况

由于加载script大部分情况是异步的，业务代码中可能已经调用了相关方法，为此临时创建一个方法收集传入的参数
```js
let params = []
window[key] = function () {
  params.push(arguments)
}
```

下面的逻辑就是处理`script`加载的逻辑

在js资源加载完成后通过`apply`配合`forEach`将提前调用方法产生的参数重新正确的执行一次
```js
const script = document.createElement('script')
script.src = value
script.async = !!defer
script.defer = !!async
script.onload = function () {
  afterScriptLoad && afterScriptLoad()
  // 处理原来没处理的
  params.forEach(param => {
    window[key].apply(this, param)
  })
}
beforeAppendScript && beforeAppendScript()
document.body.append(script)
```

## 完整源码如下
```ts
function patchWindowFun(
  key: string,
  value: string | Function,
  options?: {
    afterScriptLoad?: Function
    beforeAppendScript?: Function
    alreadyExistCB?: Function
    async?: boolean
    defer?: boolean
  },
) {
  // 存在不处理
  const { alreadyExistCB, afterScriptLoad, beforeAppendScript, defer, async } = options || {}

  if (window[key]) {
    alreadyExistCB && alreadyExistCB()
    console.log(key, 'already exist')
    return
  }

  // 函数直接赋值
  if (typeof value === 'function') {
    window[key] = value
    return
  }

  // script url
  if (typeof value === 'string') {
    let params = []
    window[key] = function () {
      params.push(arguments)
    }

    const script = document.createElement('script')
    script.src = value
    script.async = !!defer
    script.defer = !!async
    script.onload = function () {
      afterScriptLoad && afterScriptLoad()
      // 处理原来没处理的
      params.forEach(param => {
        window[key].apply(this, param)
      })
    }
    beforeAppendScript && beforeAppendScript()
    document.body.append(script)
  }
}
```
## 小结
目前的方法实现仅适用于，**调用的方法相对独立**不影响正常的交互

如果业务代码依赖方法的返回值，那么异步通过`script`加载的方法方式将不太适用
