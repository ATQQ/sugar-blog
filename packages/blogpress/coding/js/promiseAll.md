---
sidebar:
 title: 简单-实现promiseAll
 step: 0
isTimeLine: true
title: 实现promiseAll
date: 2020-09-01
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 实现promiseAll

这个难度比较底，面试遇到的频率也挺高的
## 第一种
* 要求：必须等全部都resolved或者reject才返回
* 有一个reject就走catch
* 返回数组:（包括每一个resolved/reject的内容）
* 返回的数组结果对应的顺序与传入的promise顺序一致

**朴素写法**
```js
/**
 * Promise.All
 * @param {Array<promise>} promises 
 */
function PromiseAll(promises) {
    const data = []
    let count = 0
    return new Promise((res, rej) => {
        for (let i = 0; i < promises.length; i++) {
            const p = promises[i]
            p.then(r => {
                data[i] = r
                count++
                if (count === promises.length) {
                    res(data)
                }
            }).catch(err => {
                data[i] = err
                count++
                if (count === promises.length) {
                    rej(data)
                }
            })
        }
    })
}
```

**测试**
```js
function createPromise(timeout, success = true) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (success) {
                res(timeout)
                return
            }
            rej(timeout)
        }, timeout)
    })
}

const p1 = createPromise(1000)
const p2 = createPromise(3000)
const p3 = createPromise(2000,false)

PromiseAll([p1, p2, p3]).then(console.log).catch(console.error)
// [1000,3000,2000]
```

