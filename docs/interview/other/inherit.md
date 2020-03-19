# 原型如何实现继承？Class 如何实现继承？Class 本质是什么？

## 原型如何实现继承？
### 组合继承
```js
function Parent(val){
    this.val = val
}
Parent.prototype.getValue = function(){
    return this.val
}

function Child(v){
    Parent.call(this,v)
}
Child.prototype = new Parent()
Child.prototype = Child
let child1 = new Child(1)
console.log(child1.getValue()) // 1
```
### 寄生组合继承
1. 
```js
function Parent(val){
    this.val = val
}
Parent.prototype.getValue = function(){
    return this.val
}

function Child(v){
    Parent.call(this,v)
}

Child.prototype = Object.create(Parent.prototype,{constructor:{
    value:Child,
    enumerable: false,
    writable: true,
    configurable: true
}})

let child1 = new Child(1)
console.log(child1.getValue()) // 1
```
2. 
```js
function Parent(val){
    this.val = val
}
Parent.prototype.getValue = function(){
    return this.val
}

function Child(v){
    Parent.call(this,v)
}
function Object(o){
  let fn = function(){}
  fn.prototype = o
  return new fn()
}
function prototype(Child,Parent){
  let proto = Object(Parent.prototype)
  proto.constructor = Child
  Child.prototype = proto
}

prototype(Child,Parent)
let child1 = new Child(1)
console.log(child1.getValue()) // 1
```
## Class 如何实现继承？
```js
class Parent{
  constructor(value){
    this.val = value;
  }
  getValue(){
    console.log(this.val)
  }
}

class Child extends Parent{
  constructor(value){
    super(value);
  }
}
const child = new Child(1);
```
## Class 本质是什么？
 JS 中并不存在类，class 只是语法糖，本质还是函数