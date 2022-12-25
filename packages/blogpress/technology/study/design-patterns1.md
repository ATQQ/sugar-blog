---
title: 设计模式-创建型模式
date: 2021-05-18
tags:
 - 技术笔记
 - 学习笔记
categories:
 - 技术笔记
---
# 设计模式-创建型模式
## 工厂模式
### 概念
* 将创建对象的过程单独封装
* 简单来说，就是你需要什么东西不直接使用new的方法生成实例，然后统一通过工厂进行生产加工再生成实例

### 示例1
#### 需求
一个简单的成员管理系统，成员有姓名，成员类型，职责等基础属性，设一个生成各种角色实例的方法

#### 实现
```js
function User(name, age, type, works) {
    this.name = name
    this.age = age
    this.type = type
    this.works = works
}

function userFactory(name, age, type) {
    const worksObj = {
        'teacher': ['传道', '授业', '解惑'],
        'student': ['上课', '写作', '课外实践'],
        // ... any more
    }
    return new User(name, age, type, worksObj[type] || [])
}
const s1 = userFactory('小明',18,'student')
const t1 = userFactory('王刚',28,'teacher')
```

### 示例2
#### 需求
图形库中有各各样的形状，如三角形，圆形，矩形等等，设计一个获取图形的方法

#### 实现
```js
function Circle(){
    this.name = 'circle'
    this.r = 0
}

function Triangle(){
    this.name = 'triangle'
    this.a = 0
    this.b = 0
    this.c = 0
}

function Rectangle(){
    this.name = 'rectangle'
    this.width = 0
    this.height = 0
}

function shapeFactory(shape){
    switch(shape){
        case 'circle':return new Circle()
        case 'triangle':return new Triangle()
        case 'rectangle':return new Rectangle()
        default: return null;
    }
}

const c1 = shapeFactory('circle')
const t1 = shapeFactory('triangle')
const r1 = shapeFactory('rectangle')
```

## 抽象工厂模式
### 概念
* 围绕一个超级工厂创建其他工厂

### 示例1
#### 需求
通常一个系统中除了成员管理，还包含日志管理等，不同系统中这些实例对象的属性可能不一致，但系统中都存在此类管理功能的需求，将系统的行为进行抽象。

#### 实现
```js
class AbstractSystemFactory {
    userFactory() {
        throw new Error('不允许直接调用抽象工厂方法')
    }

    logFactory() {
        throw new Error('不允许直接调用抽象工厂方法')
    }
}

class TradingSystem extends AbstractSystemFactory {
    userFactory() {
        return new TradingSystemUserFactory()
    }

    logFactory() {
        // 类似实现
    }
}

class AbstractSystemUserFactory {
    createUser() {
        throw new Error('不允许直接调用抽象工厂方法')
    }
}

class TradingSystemUserFactory extends AbstractSystemUserFactory {
    createUser(name, age) {
        return new TradingSystemUser(name, age)
    }
}

class TradingSystemUser {
    constructor(name, age) {
        this.name = name
        this.age = age
    }
    printInfo() {
        console.log(this.name, this.age);
    }
}

const tradingSystem = new TradingSystem()
const tradingSystemUserFactory = tradingSystem.userFactory()

const tsu1 = tradingSystemUserFactory.createUser('xm',18)
tsu1.printInfo()
```

## 单例模式
### 概念
* 一个实例只生产一次

### 多种实现方式
使用ES5（Function）与ES6（Class）实现
#### 方式1
利用instanceof判断是否使用new关键字调用函数进行对象的实例化
```js
function User() {
    if (!(this instanceof User)) {
        return
    }
    if (!User._instance) {
        this.name = '无名'
        User._instance = this
    }
    return User._instance
}

const u1 = new User()
const u2 = new User()

console.log(u1===u2);// true
```
#### 方式2
在函数上直接添加方法属性调用生成实例
```js
function User(){
    this.name = '无名'
}
User.getInstance = function(){
    if(!User._instance){
        User._instance = new User()
    }
    return User._instance
}

const u1 = User.getInstance()
const u2 = User.getInstance()

console.log(u1===u2);
```

#### 方式3
使用闭包，改进方式2
```js
function User() {
    this.name = '无名'
}
User.getInstance = (function () {
    var instance
    return function () {
        if (!instance) {
            instance = new User()
        }
        return instance
    }
})()

const u1 = User.getInstance()
const u2 = User.getInstance()

console.log(u1 === u2);
```
#### 方式4
使用包装对象结合闭包的形式实现
```js
const User = (function () {
    function _user() {
        this.name = 'xm'
    }
    return function () {
        if (!_user.instance) {
            _user.instance = new _user()
        }
        return _user.instance
    }
})()

const u1 = new User()
const u2 = new User()

console.log(u1 === u2); // true
```
当然这里可以将闭包部分的代码单独封装为一个函数

在频繁使用到单例的情况下，推荐使用类似此方法的方案
```js
function SingleWrapper(cons) {
    // 排出非函数与箭头函数
    if (!(cons instanceof Function) || !cons.prototype) {
        throw new Error('不是合法的构造函数')
    }
    var instance
    return function () {
        if (!instance) {
            instance = new cons()
        }
        return instance
    }
}

function User(){
    this.name = 'xm'
}
const SingleUser = SingleWrapper(User)
const u1 = new SingleUser()
const u2 = new SingleUser()
console.log(u1 === u2);
```

#### 方式5
在构造函数中利用`new.target`判断是否使用new关键字
```js
class User{
    constructor(){
        if(new.target !== User){
            return
        }
        if(!User._instance){
            this.name = 'xm'
            User._instance = this
        }
        return User._instance
    }
}

const u1 = new User()
const u2 = new User()
console.log(u1 === u2);
```

#### 方式6
使用`static`静态方法

```js
class User {
    constructor() {
        this.name = 'xm'
    }
    static getInstance() {
        if (!User._instance) {
            User._instance = new User()
        }
        return User._instance
    }
}


const u1 = User.getInstance()
const u2 = User.getInstance()

console.log(u1 === u2);
```
## 建造者模式
### 概念
* 让简单的对象通过组合的方式构造成多种复杂对象
* 一种创建复杂对象的最佳实践

### 示例
以团购火锅卷为例，通常有多种套餐类型可供选择，不同套餐由饮料，小吃，荤菜，素菜等等构成。饮料用瓶装，小吃用木碗装等等。

```js
// 木盘子
class WoodenBowl {
    pack() {
        return 'WoodenBowl'
    }
}

// 瓶子
class Bottle {
    pack() {
        return 'Bottle'
    }
}

// 小吃用木碗装
class Snack {
    packing() {
        return new WoodenBowl()
    }
}

// 饮品用瓶装
class Drink {
    packing() {
        return new Bottle()
    }
}

// 可乐
class Coke extends Drink {
    price() {
        return 3.00
    }
    name() {
        return 'Coke'
    }
}

// 茶
class Tea extends Drink {
    price() {
        return 5.00
    }
    name() {
        return 'Tea'
    }
}

// 薯条
class FrenchFries extends Snack {
    price() {
        return 15.00
    }
    name() {
        return 'FrenchFries'
    }
}

// 面包
class Bread extends Snack {
    price() {
        return 5.00
    }
    name() {
        return 'Bread'
    }
}

// 套餐
class Meal {
    constructor() {
        this.items = []
    }
    addItem(item) {
        this.items.push(item);
    }
    getCost() {
        let cost = 0.0;
        for (const item of this.items) {
            cost += item.price();
        }
        return cost;
    }
    showItems() {
        for (const item of this.items) {
            const nameStr = "Item : " + item.name();
            const packStr = "Packing : " + item.packing().pack();
            const priceStr = "Price : " + item.price();
            console.log(`${nameStr},${packStr},${priceStr}`);
        }
    }
}

//  建造套餐
class MealBuilder {
    prepare2People() {
        const meal = new Meal();
        meal.addItem(new Coke());
        meal.addItem(new Tea());
        meal.addItem(new Bread());
        meal.addItem(new FrenchFries());
        return meal;
    }
    prepare1People() {
        const meal = new Meal();
        meal.addItem(new Coke());
        meal.addItem(new FrenchFries());
        return meal;
    }
}

const mealBuilder = new MealBuilder();
const people2 = mealBuilder.prepare2People();
people2.showItems();
console.log("Total Cost: " + people2.getCost());
```
输出
```
Item : Coke,Packing : Bottle,Price : 3
Item : Tea,Packing : Bottle,Price : 5
Item : Bread,Packing : WoodenBowl,Price : 5
Item : FrenchFries,Packing : WoodenBowl,Price : 15
Total Cost: 28
```
## 原型模式
### 概念
* 原型模式是一种创建对象的方式
* 利用实例来描述对象，用实例作为定义对象和继承的基础
* 用原型模式的优势是使用更小的代价来创建对象，通过原型引用的方式而不是开辟新的空间

JS创建对象的方式就是原型引用：
* [模拟new实现](./../../coding/js/myNew.md)
* [原型与原型链](./../../bigWeb/js/prototype.md)

