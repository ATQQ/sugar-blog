---
sidebar:
 title: 单例模式
 step: 2
isTimeLine: true
title: 单例模式
date: 2021-05-18
tags:
 - 计算机基础
 - 设计模式
categories:
 - 计算机基础
---
# 单例模式
保证一个类仅有一个实例，并提供一个访问它的全局访问点，这样的模式就叫做单例模式

## 实现思路

单例模式想要做到的是，不管我们尝试去创建多少次，它都只给你返回第一次所创建的那唯一的一个实例。

实现方案有多种，大体上分ES5（Function）与ES6（Class）两种
### 方式1
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
### 方式2
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

### 方式3
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
### 方式4
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

### 方式5
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

### 方式6
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

## 面试题
:::tip 例1
实现Storage，使得该对象为单例，基于 localStorage 进行封装。实现方法 setItem(key,value) 和 getItem(key)。
:::
**静态方法**
```js
class Storage {
    static getInstance() {
        if (!Storage.instance) {
            Storage.instance = new Storage()
        }
        return Storage.instance
    }
    setItem(key,value){
        localStorage.setItem(key,value)
    }
    getItem(key){
        return localStorage.getItem(key)
    }
}
let s1 = Storage.getInstance()
let s2 = Storage.getInstance()
console.log(s1===s2) // true
s1.setItem('abc',666)
console.log(s2.getItem('abc')) // 666
```
**闭包**
```js
function baseStorage() { }
baseStorage.prototype.setItem = function (key, value) {
    localStorage.setItem(key, value)
}
baseStorage.prototype.getItem = function (key) {
    return localStorage.getItem(key)
}
const Storage = (function () {
    let instance = null
    return function () {
        if (!instance) {
            instance = new baseStorage()
        }
        return instance
    }
})()

let s1 = new Storage()
let s2 = Storage()
console.log(s1===s2) // true
s1.setItem('abc',666)
console.log(s2.getItem('abc')) // 666
```
:::tip 例2
实现一个全局的模态框
:::

**[预览](https://codepen.io/sugarInSoup/pen/eYNEeNJ)**

**使用构造函数**
```css
.global-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 150px;
    background-color: grey;
    padding: 10px;
}
```
```html
    <button id="open">open</button>
    <button id="close">close</button>
```
```js
class Modal {
    constructor(msg) {
        let modal = document.createElement('div')
        modal.textContent = msg
        modal.classList.add('global-modal')
        modal.style.display = 'none'
        this.modal = modal
        document.body.append(modal)
    }
    show() {
        this.modal.style.display = 'block'
    }
    hide() {
        this.modal.style.display = 'none'
    }
}
class GlobalModal {
    constructor() {
        if (!GlobalModal.instance) {
            GlobalModal.instance = new Modal('666')
        }
        return GlobalModal.instance
    }
}
let a = new GlobalModal()
let b = new GlobalModal()
document.getElementById('open').addEventListener('click',function(){
    a.show()
})
document.getElementById('close').addEventListener('click',function(){
    b.hide()
})
```



