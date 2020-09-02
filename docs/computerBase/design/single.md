# 单例模式
保证一个类仅有一个实例，并提供一个访问它的全局访问点，这样的模式就叫做单例模式

## 实现思路

单例模式想要做到的是，不管我们尝试去创建多少次，它都只给你返回第一次所创建的那唯一的一个实例。

### 静态方法
```js
class SingleDog {
    sing() {
        console.log('w w w w')
    }
    static getInstance() {
        // 判断是否存在
        if (!SingleDog.instance) {
            // 不存在则创建
            SingleDog.instance = new SingleDog()
        }
        // 存在则返回
        return SingleDog.instance
    }
}
let a = SingleDog.getInstance()
let b = SingleDog.getInstance()
console.log(a === b) // true
```
### 闭包实现
```js
function SingleDog() {
    this.show = function () {
        console.log('w w w w')
    }
}
SingleDog.getInstance = (function () {
    let instance = null
    return function () {
        if (!instance) {
            instance = new SingleDog()
        }
        return instance
    }
})()

let a = SingleDog.getInstance()
let b = SingleDog.getInstance()
console.log(a === b) // true
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



<comment/>
<tongji/>