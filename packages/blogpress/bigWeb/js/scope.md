---
sidebar:
 title: 作用域
 step: 16
isTimeLine: true
title: 作用域
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 作用域
* 作用域指程序源代码中定义变量的区域
* 规定了如何查找变量,确定当前执行代码对变量的访问权限
* js使用词法作用域(静态作用域):**函数的作用域在函数定义的时候就决定了**

**例子**
```js
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();
```
## 静态作用域
函数的作用域在函数定义的时候决定

**结果**
* 执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value
* 没有，根据书写的位置，查找上面一层的代码
* value 等于 1，所以结果会打印 1。
```js
1
```
## 动态作用域
函数的作用域在函数运行的时候才决定

**结果**
* 执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value
* 没有，先从调用函数的作用域查找，也就是 bar 函数内部查找
* value = 2，所以结果会打印 2。
```js
2
```

## 例子
### 例1
```js
var scope = "global scope";
function checkscope() {
    var scope = "local scope";
    function f() {
        return scope;
    }
    return f();
}
console.log(checkscope());
```
<details>
  <summary><mark><font color=darkred>点击查看答案</font></mark></summary>
  <p>结果</p>
  <pre><code>  
    local scope
  </code></pre>
</details>

### 例2
```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```
<details>
  <summary><mark><font color=darkred>点击查看答案</font></mark></summary>
  <p>结果</p>
  <pre><code>  
    local scope
  </code></pre>
</details>

---

:::tip 参考
[JavaScript深入之词法作用域和动态作用域](https://github.com/mqyqingfeng/Blog/issues/3)
:::

