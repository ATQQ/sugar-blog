---
isTimeLine: true
title: typeof是否能正确判断类型？instanceof能正确判断对象的原理是什么？
date: 2020-03-10
tags:
 - 面试
 - 其它
categories:
 - 面试
---
# typeof 是否能正确判断类型？instanceof 能正确判断对象的原理是什么？
## typeof
* typeof对于原始值类型除了null外都可以准确判断
* typeof 对于对象来说，除了函数都会显示 object

**所以说 typeof 并不能准确判断变量到底是什么类型**
```js
typeof 1    // number
typeof '1'  // string
typeof true // boolean
typeof undefined // undefined
typeof Symbol // symbol
typeof null // object(实际上null不是Object)
typeof [] // object
typeof {} // object
typeof Function // function 
```

## instanceof
通过原型链来判断的
```js
function People() { }
let p = new People()
console.log(p instanceof People) // true

function Teacher() { }
Teacher.prototype = Object.create(People.prototype)
function Student() { }
Student.prototype = Object.create(People.prototype)

let t = new Teacher()
console.log(t instanceof Teacher) // true
console.log(t instanceof People) // true
console.log(t instanceof Student) // false
```
## myInstanceof
```js
function myInstanceof(target, origin) {
    let prototype = origin.prototype
    target = Object.getPrototypeOf(target)
    while (true) {
        if (target === null || target === undefined) {
            return false
        }
        if (target === prototype) {
            return true
        }
        target = Object.getPrototypeOf(target)
    }
}
```

