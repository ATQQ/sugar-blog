---
isTimeLine: true
title: 网易互娱
date: 2020-10-23
tags:
 - 备战春秋
 - 2020春招
categories:
 - 备战春秋
---
# 网易互娱
## 一面
### JS
1. 遍历数组/对象常用哪些方式
2. for..in...遍历会有些什么问题
3. 了解JS异步编程吗
4. 如何访问函数内部的变量
5. 了解闭包吗,简单说一下你的理解
6. 闭包有什么优点与缺点,使用场景是什么
7. 闭包为什么会造成内存泄漏,有什么危害
8. 下面代码输出什么
```js
// problem1
const promise = new Promise((resolve, reject) => {
    console.log(1)
    resolve()
    console.log(2)
})
promise.then(() => {
    console.log(3)
})
console.log(4)

// problem2
function fn(){
    for (let i = 0; i < 4; i++) {
        setTimeout(function(){
            console.log(i)
        },1000)
    }
}
fn()

// problem3
let a = 0
let b = async () => {
    a = a + await 10
    console.log('2', a)
}
b()
a++
console.log('1', a)
```
### CSS
1. 语义化标签有哪些
2. 为什么要使用语义化标签
3. 如果全部使用div,span,li这些能否进行开发,有什么缺点
4. 有哪些属性是不可以被继承的
5. 样式优先级怎么计算

### VUE
1. 如何进行数据双向绑定的
2. 在vue中使用js去修改Dom能否修改成功,会影响VNode吗
3. Vue与React的diff算法异同

### 算法
1. 快排的时间复杂度

