# 实现一下new
**步骤**
* 生成了一个新对象
* 链接到原型
* 绑定 this
* 返回新对象
```js
function myNew() {
    let o = {}
    let fn = [].shift.call(arguments)
    o.__proto__ = fn.prototype
    let res = fn.apply(o, arguments)
    return res instanceof Object ? res : o
}
```

<comment/>
<tongji/>