---
isTimeLine: true
title: 如何正确判断this？箭头函数的this是什么？
date: 2020-04-14
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# 如何正确判断 this？箭头函数的 this 是什么？
```js
function foo() {
  console.log(this.a)
}
var a = 1
foo() // 1

const obj = {
  a: 2,
  foo: foo
}
obj.foo() // 2

const c = new foo() // undefined
c()
```
1. 对于普通函数来说,this->window
2. 全局作用域下,this -> window
3. 对于对象来说,谁调用函数谁就是this
4. new 的方式,this永远被绑定在实例上
5. 箭头函数本身是没有this,继承外层上下文绑定的this(包裹箭头函数的第一个普通函数的this)
6. 箭头函数使用bind,call,this无效
7. bind/call/apply 这些改变上下文的 API 了，对于这些函数来说，this 取决于第一个参数，如果第一个参数为空，那么就是 window
8. 不管我们给函数 bind 几次，fn 中的 this 永远由第一次 bind 决定

**示例**
```js
var p1 = 1
function fn1(){
    console.log(this.p1)
}
fn1() // 1

let obj2 = {
    p2:2,
    fn2(){
        console.log(this.p2)
    }
}
obj2.fn2() // 2

var p3 = 1
function fn3() {
    this.p3 = 3
    console.log(this.p3)
}
let fn31 = new fn3() // 3

var p4 = 4
const fn4 = ()=>{
    console.log(this.p4)
}
fn4() // 4

function fn5() {
    this.p5 = 5
    return function () {
        this.p5 = 55
        return function () {
            this.p5 = 555
            return () => {
                console.log(this.p5)
            }
        }
    }
}

fn5()()()() // 555

const fn6 = ()=>{
    console.log(this.p6)
}
fn6.bind({p6:6})() // undefined
fn6.call({p6:6}) // undefined

var p7 = 7
function fn7(){
    console.log(this.p7)
}
fn7.bind({p7:77})() // 77
fn7.bind()() // 7

function fn8(){
    console.log(this.p8)
}
fn8 = fn8.bind({p8:8}).bind({p8:88}).bind({p8:888})
fn8() // 8
```

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzgyNjg3NzI4Mw==583826877283)



**一个笔试题**
```js
let obj2 = {
    name: 'obj2'
}

const obj = {
    name: 'obj',
    say1() {
        console.log(this.name)
    },
    obj1: {
        name: 'obj1',
        say2() {
            console.log(this.name);
        }
    },
    say3() {
        const fn = () => {
            console.log(this.name);
        }
        fn()
    },
    say4() {
        const fn = function () {
            console.log(this.name);
        }
        fn()
    },
    say5() {
        const fn = () => {
            console.log(this.name);
        }
        fn.call(obj2)
    },
    say6() {
        const fn = function () {
            console.log(this.name);
        }
        fn.call(obj2)
    }
}

let a = obj.say1
let b = obj.obj1.say2
a() 
b()
obj.say1()
obj.obj1.say2()
obj.say3()
obj.say4()
obj.say5()
obj.say6()
```

<my-details title="点击查看输出结果与题解">

```js
undefined
undefined
obj
obj1
obj
undefined
obj
obj2
```

**题解**

1. 
```js
let a = obj.say1
a()
// 等价于
let a = function () {
    console.log(this.name)
}

// 这里的是普通的function
// 所以这里的this是window
// this.name --> window.name
// 结果为
undefined
```
2. 
```js
let b = obj.obj1.say2
b()
// 等价于
let b = function () {
    console.log(this.name);
}
// 后续步骤与上面一致
// 结果为
undefined
```
3. 
```js
obj.say1()
// 对于对象来说,谁调用函数谁就是this
// 所以这里this指的是obj
// 所以say1内的this.name --> obj.name
// 结果为
'obj'
```
4. 
```js
obj.obj1.say2()
// 与上一个同理
// 对于对象来说,谁调用函数谁就是this
// say2内的 this.name --> obj.obj1.name
// 结果为
'obj1'
```
5. 
```js
obj.say3()
// 函数内部有个箭头函数
// 箭头函数的this由其上下文决定
// 所以这里的上下文为say3 的function
// 等价于
obj = {
    // ...precode
    say3(){
        console.log(this.name);
    }
    // ...behcode
}
// 对于对象来说,谁调用函数谁就是this
// 所以这里的 this.name -> obj.name
// 结果为
'obj'
```
6. 
```js
obj.say4()
// 函数内部为普通函数
// 普通函数的this为window
// 所以其this指向window
// this.name --> window.name
// 结果为
undefined
```
7. 
```js
obj.say5()
// 其内部为箭头函数
// 箭头函数使用call无效
// 箭头函数的this由其上下文决定
// 所以这里的this指向由包裹其的function决定
// 又因为 对于对象来说,谁调用function谁就是this
// 所以这里this 指向 obj
// this.name --> obj.name
// 结果为
'obj'
```
8.
```js
obj.say6()
// 函数内部为普通函数
// 使用call改变了其this指向
// 所以此时this 指向 obj2
// this.name --> obj2.name
// 结果为
'obj2'
```
</my-details>

