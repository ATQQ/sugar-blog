---
sidebar:
 title: 原型与原型链
 step: 15
isTimeLine: true
title: 原型与原型链
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 原型与原型链

## 原型
**什么是原型?**

每一个js对象在创建的时候就会自动关联另一个对象，这个对象就是原型，每一个对象都会从原型"继承"属性
### prototype
* 每一个函数都有一个``prototype``属性
* prototype 属性指向了一个对象，这个对象正是调用该构造函数而创建的实例的**原型**
![图片](https://img.cdn.sugarat.top/mdImg/MTU4NDM1ODU4MzY1MA==584358583650)

**示例**
```js
function Animal(){}
Animal.prototype.weight = 20

let dog1 = new Animal()
let dog2 = new Animal()
console.log(dog1.weight) // 20
console.log(dog2.weight) // 20
```
### __proto__
* 每一个js对象有一个``__proto__``属性
* ``__proto__``指向该对象的原型
* ``__proto__`` 绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 Person.prototype 中，实际上，它是来自于 Object.prototype ，与其说是一个属性，不如说是一个 getter/setter，当使用 ``obj.__proto__`` 时，可以理解成返回了 Object.getPrototypeOf(obj)。

![图片](https://img.cdn.sugarat.top/mdImg/MTU4NDM1OTA4MTY2OQ==584359081669)

**示例**
```js
function Animal(){ }
Animal.prototype.weight = 20

let dog1 = new Animal()
console.log(dog1.__proto__ === Animal.prototype) // true
// es5方法获取对象原型
console.log(Object.getPrototypeOf(dog1)===Animal.prototype) // true
```
### constructor
* 每个原型都有一个``constructor``属性
* ``constructor``属性指向关联的构造函数
![图片](https://img.cdn.sugarat.top/mdImg/MTU4NDM1OTIxODU0OA==584359218548)

**示例**
```js
function Animal(){ }

console.log(Animal === Animal.prototype.constructor) // true

let dog = new Animal()
// 从原型链上查找到的constructor属性
console.log(dog.constructor === Animal.prototype.constructor) // true
console.log(dog.constructor === Animal) // true
```
## 实例与原型
* 读取实例属性时,实例上不存在时会从实例关联的原型中去查找
* 如果原型中不存在,就去原型的原型查找,直到最后一层为止

**示例**
```js
function Teacher() { }
Teacher.prototype.name = '老师'

function Student(name) {
    this.name = name + '同学'
}
Student.prototype = Object.create(Teacher.prototype)
Student.prototype.constructor = Student

let s1 = new Student('小明')
console.log(s1.name) // 小明同学
delete s1.name
console.log(s1.name) // 老师
console.log(s1.sex) // undefined
```
## 原型的原型
* 原型也是一个对象,可以通过``new Object()``的方式创建
```js
let obj = new Object()

function Animal(){}
let cat = new Animal()
// 实例对象的原型
console.log(cat.__proto__ === Animal.prototype) // true
// 原型的原型
console.log(Animal.prototype.__proto__ === Object.prototype) // true
// 实例对象的原型的原型
console.log(cat.__proto__.__proto__ === Object.prototype) // true
```
![图片](https://img.cdn.sugarat.top/mdImg/MTU4NDM2MjcxNDY2Ng==584362714666)
## 原型链
>相互关联的原型组成的链状结构就是原型链

![图片](https://img.cdn.sugarat.top/mdImg/MTU4NDM2MzA5ODkyOA==584363098928)

* Object.prototype的原型为null
```js
console.log(Object.prototype.__proto__ === null) // true
```
* 当在原型链上查找到Object.prototype时停止查找

:::tip 参考
[JavaScript深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)
:::

