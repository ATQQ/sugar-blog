---
isTimeLine: true
title: instanceof能正确判断对象的原因是什么
date: 2020-04-14
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# instanceof能正确判断对象的原因是什么
* 通过原型链进行判断的
* 每个对象都有一个原型,instanceof会沿着原型链进行判断,直到最顶层原型为止
* 可以通过``Symbol.hasInstance``重定义instanceof的行为,所以instanceof的结果不一定绝对正确
```js
function myString() {

}
Object.defineProperty(myString, Symbol.hasInstance, {
    value: function (str) {
        return typeof str === 'string'
    },
    enumerable: false,
    configurable: true
})
console.log('ss' instanceof myString); // true
```

:::tip 更多参考
[js类型判断](./../../bigWeb/js/p4.md)<br>
[原型与原型链](./../../bigWeb/js/prototype.md)
:::

