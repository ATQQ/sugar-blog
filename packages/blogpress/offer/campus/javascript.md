---
isTimeLine: true
title: 🚀校招考点汇总-JavaScript
date: 2021-02-01
tags:
 - 校招考点
categories:
 - 备战春秋
---
# 校招考点汇总-JavaScript

## 考点
* 熟悉ES5,至少了解ES6
* 了解ES6+的一些新特性，解决了现存的那些问题
* 柯里化
* event loop
* 闭包
* 内存泄露
* 类型转换
* 类型判断
* 防抖
* 节流
* 深/浅拷贝
* this指向
* 作用域
* 执行上下文
* promise
* 展平数组
* 异步
* 垃圾回收机制
* 数据类型
* 模块化方案
* 原型
* 原型链
* 继承
* new
* call/apply/bind
* 尾递归
* 类数组
* 提升
* 暂时性死区
* == 与 ===
* typeof 与 instanceof
* 判断A与B（可能为任意类型）是否相等的方案
## 面试题
### 理论
1. 如何判断this指向
2. 箭头函数有哪些特点
3. ES6新增语法有哪些？平时开发中常用到哪些
4. 了解最近的(ES2020,ES2021)一些新语法糖吗?说说看知道哪些，是否用过
5. Array.prototype.sort的原理是怎样的
   * [2,1,10].sort()结果是什么
   * ['2','1','10'].sort() 结果是什么
   * ['2','1','10'].sort((a,b)=>a-b) 结果是什么
   * ['cc','bb','aa'].sort((a,b)=>a-b) 结果是什么
6. 判断变量类型的方式有哪几种
7. Object.prototype.toString.call 是如何判断变量的类型的，讲原理
8. typeof能否正常判断类型,有何局限
9. 判断一个对象是数组的方法有哪些
10. 原始值类型有哪些
11. null是对象吗,为什么 typeof null === 'object'
12. 对象类型与原始值类型的不同之处
13. == 与 === 区别
14. 异步任务有哪些
15. js的异步机制是怎样的
16. 简述一下event loop
17. 什么是执行栈
18. 为什么js是单线程的,单线程优缺点是什么
19. 什么是节流
20. 什么是防抖
21. 什么是闭包
22. 有哪些场景会使用闭包
23. 闭包的缺点
24. 简述一下，JavaScript的垃圾回收机制是怎样的
25. 什么是强引用与弱引用
26. Map与WeakMap的区别有哪些
27. null 与 undefined 有什么区别
28. 常见的内存泄露场景有哪些，如何避免
29. 什么是提升，有什么作用
30. 什么是暂时性死区
31. 在声明前使用let/const声明的变量会出现什么问题
32. 什么是深拷贝
33. 什么是浅拷贝
34. 几种常见for循环的区别与不足之处 (for,for of,for in ,foreach)
35. for in 遍历数组有哪些问题
36. generator与async/await有什么关系
37. 如何实现generator的自动调用
38. new一个对象做了什么（讲述一下new的原理）
39. 什么是动态作用域
40. 什么是静态作用域
41. js是动态还是静态作用域
42. 什么是原型，什么是原型链
43. 剔除数组首元素的方法有哪些
44. promise的状态有哪些
44. promise有什么特点
45. 什么是Promise的链
46. Promise 构造函数执行和 then 函数执行有什么区别
47. 什么是回调地域
48. 如何实现大文件的分片上传,断点续传,还有通常说的秒传
49. 什么是函数柯里化,有什么作用
50. 模块化有什么优点,有哪几种方案
51. 通过 new 的方式创建对象和通过字面量创建有什么区别
```js
// new Object()
// {}
```
52. 为什么0.1+0.2!==0.3
53. 

### 代码实现
1. 模拟实现bind
2. 模拟实现call
3. 模拟实现apply
4. 模拟实现new
5. 模拟实现instanceof
    ```js
    function instanceof(a,b){

    }
    ```
6. 实现一个节流函数
   ```js
    function throttle(fn,delay){

    }
   ```
7. 实现防抖函数
   ```js
    function debounce(fn,delay){

    }
   ```
8. 数组转换
   * 多维转一维
    ```js
    function _flat(arr){
        // ...code
    }
    _flat([1,[2,[3]]]) // [1,2,3]
    ```
   * 数组变换
    ```js
    [1,2,3] => '123'
    ```
   * 去重
    ```js
    // 1. {}与{},{a:1}与{a:1},[]与[]算一样的
    // [1,2,'1','2',1,null,null,undefined,undefined,{},{},[],[],[1],[1],['1'],['1'],NaN.NaN,true,true]

    function duplicate(arr){
        // ...code
    }
    ```
9.  请求合并：短时间内需要请求多个资源合并成一个请求发送
   ```js
   // 首先有一个接口其请求路径为 /path
    // query有一个id参数支持传一个或者多个id
    // /path?id=1
    // /path?id=1,2,3
    // /path?id=1,2
    // 返回内容格式为（假设请求的query是 id=1,2）
    const demoRes = {
        1:{
            data:{}
        },
        2:{
            data:{}
        }
    }
    // request的构成
    request({
        url:'/path',
        query:{
            id:''
        }
    })

    // 下面是使用场景实现,每个方法回调最终拿到的是自己需要的内容

    getArticle(3).then(res=>{})
    getArticle(4).then(res=>{})
    getArticle(5).then(res=>{})
    getArticle(6).then(res=>{})

    // 实现这个getArticle方法
   ```
10. 数字格式化
```js
// 输入为数字，输出为字符串
// 使用“,”分割整数部分，小数保留两位
/**
* @param {number} num
*/
function transfer(num){
    // ...code
}
transfer(1234567890.23) // "1,234,567,890.23"
```
11. 实现PromiseAll
```js
// 要求：必须等全部都resolved或者reject才返回
// 有一个reject就走catch
// 返回数组:（包括每一个resolved/reject的内容）
// 返回的数组结果对应的顺序与传入的promise顺序一致
function PromiseAll(){

}
```
12. 简单实现一个深拷贝
```js
// 对象只考虑普通对象与数组

// 有兴趣自己探究一 如下特殊场景如何满足
// 特殊场景 循环引用/Date/Regex/Symbol/函数

function deepClone(obj){

}
```
13. ES5,ES6实现函数的继承
```js
function extend(A,B){
    // ...code
}
```
14. 根据async/await与generator的关系模拟实现myAsync
```js
// gen 为generator
function myAsync(gen){
    // ...code
}

// 测试代码
myAsync(function* () {
    const a = yield Promise.resolve(1)
    const b = yield new Promise((res, rej) => {
        setTimeout(() => {
            res(2)
        }, 2000)
    })
    const c = yield Promise.resolve(3)
    console.log(a, b, c);

    try {
        const d = yield Promise.reject(4)
    } catch (error) {
        console.log(error);
    }

    return [a, b, c]
}).then(console.log)
// 输出
// 1 2 3
// 4
// [1,2,3]
```
15. 模板字符串处理
  * 如果对应的键值不存在则不处理
  * **|** 后面跟着的是filter函数，均在filters中存在
  * 如果结果是对象则对接过进行 JSON.stringify()
  * 如果结果是函数则进行 toString()
```js
var str = `
a
{{      obj.a   | filter |             filter2        }
b
{obj.b.c}
c
{obj.c.d}
`
var obj = {
    a:function(){},
    b:{c:{e:123}},
    c:{}
}
var g = {
    filter(str) {return 'aaa' + str },
    filter2(str) {return str + 'bbb'}
}

// 实现
function parseTemplate(temp,obj,filters){
    // ...code
}
parseTemplate(str,obj,g)
```
替换后的结果为
```js
// a
// {aaafunction () { }bbb
// b
// {"e":123}
// c
// {obj.c.d}
```
16. 实现一个简单的Promise，具备then 与 catch方法
```js
// 如有精力，考虑一下如何实现链式调用
function myPromise(executor){
    // ...你的实现
}

new myPromise((res,rej)=>{
    console.log(1)
    res('success')
}).then(console.log)

new myPromise((res,rej)=>{
    console.log(2)
    rej('error')
}).then(console.log)
.catch(err=>{
    console.log('----')
    console.log(err)
})
```
17. 实现一个柯里化函数
```js
function currying(){
    // ... 你的实现
}

// ---测试代码---
function sum(a,b,c,d,e){
    console.log(a+b+c+d+e)
}
sum = currying(sum)
sum(1,2)(3)(4)(5) // 15
```
18. 实现一个demo
* html结构
 ```html
 <ul id='list'>
     <li data-id>
         <!-- 很多子节点,但不包含li -->
     </li>
 </ul>
 ```
 * 要求点击li或者li中的任意子节点都能取到li上的data-id如何实现
 ```js
 // 你的实现
 ```
### 阅读代码
1. 原型与原型链
   * 下面三个分别与什么相等
    ```js
    function foo(){}
    const bar = new foo()
    bar.__proto__ === // ?
    foo.__proto__ === // ?
    foo.prototype.constructor === // ?
    ```
   * 结果
    ```js
    null instanceof Object
    null === Object.prototype.__proto__
    ```
2. 考察隐式类型转换,下面if为真的有哪些
```js
if([])
if({})
if([]==false)
if({}==false)
```
3. this指向考察
```js
function a(){
    this.b = 3
}
a()
console.log(b) // ?
var b = 5
console.log(b) // ?
var c = new a()
console.log(b) // ?
a.prototype.b = 4
a.prototype.c = 5
console.log(c.b) // ?
console.log(c.c) // ?
console.log(b) // ?
```
4. 作用域考察
   1. 例1
   ```js
   var scope = "global scope";
    function checkscope() {
        var scope = "local scope";
        function f() {
            return scope;
        }
        return f();
    }
    console.log(checkscope()); // ?
   ```
   2. 例2
   ```js
    var scope = "global scope";
    function checkscope(){
        var scope = "local scope";
        function f(){
            return scope;
        }
        return f;
    }
    checkscope()(); // ?
   ```
   3. 例3
    ```js
    for(var i = 0;i<2;i++){
        setTimeout(()=>{
            for(var j = 0;j<3;j++){
                setTimeout(()=>{
                    console.log(i*j)
                },0)
            }        
        },0)
    }
    // 输出结果是多少？为什么
    // var 变为 let 结果又是多少？为什么
    ```
5. 观看示例,输出结果是什么，并阐明理由
   * 例1
    ```js
    const promise = new Promise((resolve, reject) => {
        console.log(1)
        resolve()
        console.log(2)
    })
    promise.then(() => {
        console.log(3)
    })
    console.log(4)
    ```
    * 例2
    ```js
    function fn(){
        for (let i = 0; i < 4; i++) {
            setTimeout(function(){
                console.log(i)
            },1000)
        }
    }
    fn()
    ```
    * 例3
    ```js
    let a = 0
    let b = async () => {
        a = a + await 10
        console.log('2', a)
    }
    b()
    a++
    console.log('1', a)
    ```
6. this指向考察，阐明输出结果是什么
   * 例1
    ```js
    var a = 1
    var obj = {
        fun:function(){
            console.log(a)
        },
        a:2
    }
    obj.fun() // ?
    ```
    * 例2
    ```js
    var a = 1
    function foo(){
        console.log(a) 
    }
    function bar(){
        var a = 2
        foo()
    }
    bar() // ?
    ```
7. 下面输出是什么

```html
    <div id="div1">
        <div id="div2">
            <div id="div3">
            </div>
        </div>
    </div>
    <script>
        const div1 = document.getElementById('div1')
        const div2 = document.getElementById('div2')
        const div3 = document.getElementById('div3')
        div1.addEventListener('click', function () {
            console.log(1);
        })
        div1.addEventListener('click', function () {
            console.log(3);
        }, false)
        div1.addEventListener('click', function () {
            console.log(2);
        }, true)

        div2.addEventListener('click', function () {
            console.log(4);
        })
        div2.addEventListener('click', function () {
            console.log(6);
        }, false)
        div2.addEventListener('click', function () {
            console.log(5);
        }, true)

        div3.addEventListener('click', function () {
            console.log(7);
        })
        div3.addEventListener('click', function () {
            console.log(9);
        }, false)
        div3.addEventListener('click', function () {
            console.log(8);
        }, true)

        div1.dispatchEvent(new Event('click'))
        div2.dispatchEvent(new Event('click'))
        div3.dispatchEvent(new Event('click'))
    </script>
```
### dom/Event相关
1. 什么是事件委托
2. 事件的回调函数 e.target与.currentTarget分别指向谁
3. 如何获取一个dom对象
4. 如何获取指定dom的指定属性
5. 如何获取指定dom的指定样式
6. 如何获取指定dom的生效样式
7. 事件触发的几个阶段是什么
8. 为什么通常在冒泡阶段执行事件
9. 事件触发的过程是怎样的

