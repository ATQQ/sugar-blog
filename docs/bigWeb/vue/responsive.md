# 响应式基本原理
## Object.defineProperty
Object.defineProperty使对象变成可观察的

```js
/*
    obj: 目标对象
    prop: 需要操作的目标对象的属性名
    descriptor: 描述符 
    return value 传入对象
*/
Object.defineProperty(obj, prop, descriptor)
```
descriptor的属性:
* enumerable(false):是否可枚举
* configurable(false):是否可以被修改或者删除
* get:获取属性的方法。
* set:设置属性的方法。

## observer
```js
function fn(val) {
    console.log('视图更新', val)
}

function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumrable: true,
        configurable: true,
        get: function () {
            // 进行依赖搜集
            return val
        },
        set: function (newVal) {
            if (newVal !== val) {
                fn(newVal)
            }
        }
    })
}

function observer(obj) {
    if (!obj || (typeof obj !== 'object')) {
        return
    }
    Object.keys(obj).forEach(k => {
        let temp = obj[k]
        if (temp && (typeof temp === 'object')) {
            observer(temp)
        } else {
            defineReactive(obj, k, temp)
        }
    })
}

class Vue {
    constructor(options) {
        this._data = options.data
        observer(this._data)
    }
}
```
* `defineReactive`方法通过 `Object.defineProperty` 来实现对对象的响应式化
* 经过 defineReactive 处理以后,obj 的 key 属性在`读`的时候会触发 reactiveGetter 方法，属性被`写`的时候则会触发 reactiveSetter 方法

**测试编写的示例**
```js
let app = new Vue({
    data:{
        name:'小明',
        friends:{
            name1:'小红',
            name2:'小刚'
        }
    }
})
app._data.name = 1 // 数据更新1
app._data.friends.name1 = 2 // 数据更新2
app._data.friends.name2 = 3 // 数据更新3
```