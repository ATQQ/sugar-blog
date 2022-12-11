---
sidebar:
 title: ES6+的新语法糖和方法整理
 step: 30
isTimeLine: true
title: ES6+的一些新语法糖和方法整理
date: 2021-10-13
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# ES6+的一些新语法糖和方法整理
**只列举了比较实用的而又鲜为人知的一些，并不绝对全面**

## ESNext

## ES2022

## ES2021

## ES2020
### 1. #号创建类的私有变量
```ts
class p{
    #name='xiaoming'
    getName(){
        return this.#name
    }
}
let a = new p()
console.log(a.getName());
// Property '#name' is not accessible outside class 'p' because it has a private identifier.
console.log(a.#name);// error
```

### 2. Promise.allSelected
可以在回调中取到所有的promise的返回值与状态，包括rject的
```ts
class p {
    #name = 'xiaoming'
    getName() {
        return this.#name
    }
}
let a = new p()
console.log(a.getName());
// console.log(a.#name);

const p1 = new Promise((resolve, reject) => setTimeout(resolve, 1000, 'success'))
const p2 = new Promise((resolve, reject) => setTimeout(reject, 1000, 'fail'))

Promise.allSettled([p1, p2]).then(res => {
    console.log(res);
    // [
    //     {status: "fulfilled", value: "success"}
    //     {status: "rejected", reason: "fail"}
    // ]
})
```
### 3. 空值运算符??
开发中通常会用||去做变量或者值初始化，但是对于空串和0这些有意义值，会有一些意料之外的结果此时就可以用??去替代

?? 运算符只会把 null 和 undefined 判断为 false
```ts
const user = {
    name: 'xiaoming',
    age: '',
    height: 0
};
console.log(user.name || 'abc'); // xiaoming
console.log(user.age || 18); // 18
console.log(user.height || 180); // 180
// 使用??
console.log(user.name ?? 'abc'); // xiaoming
console.log(user.age ?? 18); // 
console.log(user.height ?? 180); // 0
```

### 4. 可选链运算符?.
当需要访问嵌套在对象内部好几层的属性时,为了避免出现undefind的报错会使用&&去处理代码

使用可选链可让代码更加简洁明了
```ts
let data = {}
// &&
console.log(data && data.a && data.a.b);

// ?.
console.log(data?.a?.b);
```

### 5. globalThis
globalThis 目的就是提供一种标准化方式访问全局对象，有了 globalThis 后，你可以在任意上下文，任意时刻都能获取到全局对象

```ts
// worker.js
globalThis === self
// node.js
globalThis === global
// browser.js
globalThis === window
```

## ES2019/ES10
### 1. Array.flat
展开数组
```ts
let arr = [1, 2, 3, [4, 5, 6, [7, 8, 9, [10, 11, 12]]]];

arr.flat(); // [1, 2, 3, 4, 5, 6, Array(4)];

arr.flat().flat(); // [1, 2, 3, 4, 5, 6, 7, 8, 9, Array(3)];

arr.flat(3); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

// 展开任意层级
arr.flat(Infinity); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```

### 2. Array.flatMap
与ES6Array.Map()方法相同，但同时也支持展平。该Array.flatMap()方法首先使用映射函数映射每个元素，然后将结果展平为新数组
```ts
let arr = [1, 2, 3, 4, 5];

arr.map(x => [x, x * 2]);
// [Array(2), Array(2), Array(2)]
// 0: (2)[1, 2]
// 1: (2)[2, 4]
// 2: (2)[3, 6]

arr.flatMap(v => [v, v * 2]);
// [1, 2, 2, 4, 3, 6, 4, 8, 5, 10]
```

### 3. String.trimStart() & String.trimEnd()
String.trimStart()可用于从字符串的开头去掉空白。String.trimEnd()可用于从字符串的尾部去掉空白
```ts
let  greeting =  "    Hello everyone";

console.log(greeting.trimStart());
// "Hello everyone"
```
```ts
let greeting = "Hello world    ";

console.log(greeting.trimEnd());
// "Hello world"
```

### 4. 可选 Catch Binding
允许开发人员在catch块中，不使用error参数的情况下使用try/catch

ES2019之前
```ts
try {
  // some code
}
catch (err) {
  // error handling code
}
```

现在可以
```js
try  {
  // some code
}
catch {
  // error handling code
}
```

### 5. Object.fromEntries
Object.fromEntries()创建一个对象或将键值对转换为一个对象。它只接受Iterable

例如：Object.fromEntries(someIterable)
```ts
let entries = new Map([["name", "john"], ["age", 22]]);

console.log(Object.fromEntries(entries));
// { name: 'john', age: 22 }
```

### 6. Symbol.description
只读描述属性，是一个返回Symbol对象的可选描述的字符串
```ts
let mySymbol = `My Symbol`;

let symObj = Symbol(mySymbol);

console.log(symObj) // Symbol(mySymbol);

console.log(String(symObj) === `Symbol(${mySymbol})`); // true

console.log(symObj.description); // "My Symbol"
```

## ES2018/ES9
### 1. for await of
for of方法能够遍历具有Symbol.iterator接口的同步迭代器数据，但是不能遍历异步迭代器

for await of可以用来遍历具有Symbol.asyncIterator方法的数据结构，也就是异步迭代

**for of遍历**
```ts
function d(timeout: number) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(timeout)
        }, timeout)
    })
}
let data = [d(1000), d(500), d(1200)]

for (const v of data) {
    v.then(console.log)
}
// 500
// 1000
// 1200
```

**for await of**
```ts
function d(timeout: number) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(timeout)
        }, timeout)
    })
}
let data = [d(1000), d(500), d(1200)]
async function test() {
    for await (const v of data) {
        console.log(v);
    }
}
test();
// 1000
// 500
// 1200
```
### 2. 新的正则表达式特性
**2.1 s(dotAll)模式**

元字符`.`无法匹配换行符,可以通过 s(doAll)flag解决
```ts
console.log(/foo.bar/.test('foo\nbar')); // false

// 使用 s
console.log(/foo.bar/s.test('foo\nbar')); // true
```

**2.2 命名捕获组**

在一些正则表达式模式中，使用数字进行匹配可能会令人混淆

命名捕获组，允许为每一个组匹配指定一个名字，既便于阅读代码，又便于引用

```ts
const re = /(\d{4})-(\d{2})-(\d{2})/;
const match= re.exec('2020-01-01');
console.log(match[0]);    // 2020-01-01
console.log(match[1]);    // 2020
console.log(match[2]);    // 01
console.log(match[3]);    // 01
```

```ts
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = re.exec('2020-01-01');
console.log(match.groups);          // { year: '2020', month: '01', day: '01' }
console.log(match.groups.year);     // 2020
console.log(match.groups.month);    // 01
console.log(match.groups.day);      // 01
```

使用replace
```ts
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
console.log('2020-09-01'.replace(re, '$<month>-$<day>-$<year>')) // 09-01-2020
```

## ES2017/ES8
### 1. Object.values()，Object.entries()

Object.values方法返回一个数组，其值由对象的值组成
```ts
const obj = { a: '1', b: '2' }
console.log(Object.values(obj));
// [ '1', '2' ]
```
Object.entries()方法返回一个数组,其值为[key,value]
```ts
const obj = { a: '1', b: '2' }
console.log(Object.entries(obj));
// [ [ 'a', '1' ], [ 'b', '2' ] ]
```
### 2. String padding

**String.prototype.padStart**

在字符串之前补全字符

**String.prototype.padEnd**

在字符串之后补全

```ts
console.log('llo'.padStart(5, 'hello')); // hello
console.log('0'.padEnd(5, '123')); // 01231
```

### 3 Object.getOwnPropertyDescriptors()
获取指定对象的属性描述符
```ts
const obj = { a: 1 };
console.log(Object.getOwnPropertyDescriptor(obj, 'a'));
// { value: 1, writable: true, enumerable: true, configurable: true }
```

## ES2016/ES7
### 1. 求幂运算符**
效果跟`Math.pow(x,y)`一致
```ts
console.log(2**10); // 1024
console.log(Math.pow(2,10)); // 1024
```

### 2. Array.prototype.includes
用法跟String.prototype.includes一致，可读性高于indexOf()
```ts
const arr = [1, 2, 'hello']
console.log(arr.includes('hello')); // true
```

## 参考
* [What's new in ECMAScript 2020 (ES2020)](https://www.digitalocean.com/community/tutorials/js-es2020)
* [What's new in ECMAScript 2019 (ES2019) / ES10](https://www.digitalocean.com/community/tutorials/js-es2019)
* [for await...of](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for-await...of)
* [ES2018: RegExp named capture groups](https://2ality.com/2017/05/regexp-named-capture-groups.html)
* [TC39:RegExp Named Capture Groups](https://github.com/tc39/proposal-regexp-named-groups)
* [String padding](https://www.digitalocean.com/community/tutorials?q=String+padding)
* [Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
* [compat-table/es2016plus/](https://kangax.github.io/compat-table/es2016plus/)


