---
isTimeLine: true
title: for-of与for-in的区别
date: 2020-09-05
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# for-of与for-in的区别
## for-of
遍历可迭代的对象（部署了`Symbol.iterator`），包括 `Array`，`Map`，`Set`，`String`，`arguments`等等

遍历的是每个数组的值
```js
for (variable of iterable) {
    //statements
}
```

**示例**
```js
const data = ['a', 'b', 3]
for (const v of data) {
    console.log(v); // a b 3
}
```
## for-in
```js
for (variable in obj) {
    //statements
}
```
遍历一个对象的可枚举属性
* 不可遍历Symbol属性
* 可以遍历到原型上的属性
* 顺序是任意的,不固定的
  * >最新的 ECMA-262（ECMAScript）第五版规范中，对 for-in 语句的遍历机制又做了调整，属性遍历的顺序是没有被规定的，导致不同浏览器遍历结果不一致

```js
const data = {
    [Symbol.for('a')]: 'a',
    name: 'name',
    '2': '2',
    '1': '1',
    b: 'b',
    a: 'a'
}
data.__proto__.sex = 'sex'
for (const k in data) {
    console.log(k) // 1 2 name b a sex
}
```

## 总结
### for-of
* 通常用于遍历`数组对象`,不可遍历`普通对象`
* 只能遍历可迭代的对象（部署了`Symbol.iterator`）
### for-in
* 不可遍历Symbol属性
* 为普通对象设计的，遍历顺序是任意的,数组索引顺序很重要,不适用于数组遍历
* 遍历出来的key是string类型
* 可以遍历到原型上的属性 

