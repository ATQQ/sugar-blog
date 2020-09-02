# 继承实现

## class
```js
class A{
    constructor(name){
        this.name = name
    }
    printName(){
        console.log(this.name)
    }
}

class B extends A{
    constructor(name,age){
        super(name) // A 的构造函数
        this.age = age
    }
}

let a = new B('123',0)
a.printName() // 123
```

## 组合继承
```js
function A(name) {
    this.name = name
}
A.prototype.printName = function () {
    console.log(this.name)
}

function B(name, age) {
    A.call(this, name)
    this.age = age
}
B.prototype = new A()
B.prototype.constructor = B

let a = new B('123', 0)
a.printName() // 123
```

## 寄生组合继承
1. 
```js
function A(name) {
    this.name = name
}
A.prototype.printName = function () {
    console.log(this.name)
}

function B(name, age) {
    A.call(this, name)
    this.age = age
}
B.prototype = Object.create(A.prototype, {
    constructor: {
        value: B,
        enumerable: false,
        writable: true,
        configurable: true
    }
})

let a = new B('123', 0)
a.printName() // 123
```

2. 
```js
function A(name) {
    this.name = name
}
A.prototype.printName = function () {
    console.log(this.name)
}

function B(name, age) {
    A.call(this, name)
    this.age = age
}

function prototype(child, parent) {
    const fn = function () { }
    fn.prototype = parent.prototype
    const temp = new fn()
    child.prototype = temp
    temp.constructor = child
}
prototype(B, A)
let a = new B('123', 0)
a.printName() // 123
```

<comment/>
<tongji/>