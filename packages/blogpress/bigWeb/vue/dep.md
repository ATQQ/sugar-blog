---
sidebar:
 title: ❤响应式系统的依赖收集追踪原理
 step: 10
isTimeLine: true
title: 响应式系统的依赖收集追踪原理
date: 2020-04-14
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# 响应式系统的依赖收集追踪原理

## 订阅者 Dep
主要作用是用来存放 Watcher 观察者对象
```js
class Dep{
    constructor(){
        // 存放Watcher对象
        this.subs = []
    }

    /**
     * 添加一个Watcher对象
     **/
    addSub(sub){
        this.subs.push(sub)
    }

    /**
     * 通知所有Watcher对象更新视图
     **/
    notify(){
        this.subs.forEach(sub=>{
            sub.update()
        })
    }
}
```

## 观察者 Watcher
```js
Dep.target = null;

class Watcher{
    constructor(){
        Dep.target = this
    }
    update(){
        console.log('更新视图')
    }
}
```
## 依赖收集
* 在对象被`读`的时候，触发 `reactiveGetter` 函数把当前的 Watcher 对象（存放在 Dep.target 中）收集到 Dep 类中去
* 当该对象被`写`的时候，触发 `reactiveSetter` 方法，通知 Dep 类调用 `notify` 来触发所有 `Watcher` 对象的 `update` 方法更新对应视图
```js
function defineReactive(obj, key, val) {
    let dep = new Dep()
    Object.defineProperty(obj, key, {
        enumrable: true,
        configurable: true,
        get: function () {
            // 进行依赖搜集
            console.log('收集依赖',key);
            dep.addSub(Dep.target)
            return val
        },
        set: function (newVal) {
            if (newVal !== val) {
                dep.notify()
            }
        }
    })
}

class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data);
        /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
        new Watcher();
        /* 模拟render的过程，触发test属性的get函数进行依赖搜集 */

        console.log('render~');
        // 触发get收集依赖
        this._data.name // 收集依赖 name
        this._data.friends.name1 // 收集依赖name1
    }
}
```
**测试示例代码**
```js
let app = new Vue({
    data: {
        name: '小明',
        friends: {
            name1: '小红',
            name2: '小刚'
        }
    }
})

// 触发set
app._data.name = 1 // 更新视图
app._data.friends.name1 = 2 // 更新视图
app._data.friends.name2 = 3
```

