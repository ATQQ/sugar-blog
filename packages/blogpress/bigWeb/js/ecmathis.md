---
sidebar:
 title: ECMAScript规范解读this
 step: 20
isTimeLine: true
title: ECMAScript规范解读this(未完待续)
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# ECMAScript规范解读this(未完待续)
>ECMAScript 的类型分为语言类型和规范类型。

>语言类型是开发者直接使用 ECMAScript 可以操作的。Undefined, Null, Boolean, String, Number, 和 Object。

>规范类型相当于 meta-values，是用来用算法描述 ECMAScript 语言结构和 ECMAScript 语言类型的。Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, 和 Environment Record。
## Reference
> Reference 是一个 Specification Type，也就是 “只存在于规范里的抽象类型”。它们是为了更好地描述语言的底层行为逻辑才存在的，但并不存在于实际的 js 代码中。

Reference有三个组成部分:
* base value:属性所在的对象,值只可能是 undefined, an Object, a Boolean, a String, a Number, or an environment record 其中的一种。
* referenced name:属性名
* strict reference

**例子**
```js
var foo = 1

var fooReference = {
    base:envirronmentRecord,
    name:'foo',
    strict:false
}
```
```js
var foo = {
    bar:function(){
        return this
    }
}
foo.bar()

var barReference = {
    base:foo,
    propertyName:'bar',
    strict:false
}
```
**获取 Reference 组成部分的方法**
1. GetBase():返回base value
2. isPropertyReference(): base value为对象则返回true
3. GetValue(reference):返回对象属性真正的值

...code,未完待续
:::tip 参考
[JavaScript深入之从ECMAScript规范解读this](https://github.com/mqyqingfeng/Blog/issues/7)
[ ECMAScript 5.1 ](http://yanhaijing.com/es5/#115)
:::

