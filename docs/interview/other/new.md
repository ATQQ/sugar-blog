# new 的原理是什么？通过 new 的方式创建对象和通过字面量创建有什么区别？
## new 的原理是什么
* 新生成了一个对象
* 链接到原型
* 绑定 this
* 返回新对象

**简单实现**
```js
function myNew() {
    // 创建一个空对象
    let obj = {}
    // 获取构造函数
    let Con = [].shift.call(arguments)
    // 设置空对象的原型
    obj.__proto__ = Con.prototype
    // 绑定this
    let res = Con.apply(obj, arguments)
    // 返回新对象
    return res instanceof Object ? res : obj
}
```

## 通过 new 的方式创建对象和通过字面量创建有什么区别？
* 使用字面量的方式创建对象性能上与可读性更高
* 使用 new Object() 的方式创建对象需要通过作用域链一层层找到 Object