---
sidebar:
 title: Promise
 step: 13
isTimeLine: true
title: Promise
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# Promise

[Promise/A+ 规范](http://www.ituring.com.cn/article/66566)

## 手动实现简易版
```js
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function myPromise(fn) {
    this.state = PENDING
    this.value = null
    this.resolveFuns = []
    this.rejectFuns = []

    const resolved = (v) => {
        setTimeout(() => {
            if (this.state === PENDING) {
                this.state = RESOLVED
                this.value = v
                this.resolveFuns.forEach(fun => fun(this.value))
            }
        }, 0)
    }

    const rejected = (err) => {
        setTimeout(() => {
            if (this.state === PENDING) {
                this.state = REJECTED
                this.value = err
                this.rejectFuns.forEach(fun => fun(this.value))
            }
        }, 0)
    }

    try {
        fn(resolved, rejected)
    } catch (err) {
        rejected(err)
    }
}

myPromise.prototype.then = function (resolveFun, rejectFun) {
    resolveFun = typeof resolveFun === 'function' ? resolveFun : v => v
    rejectFun = typeof rejectFun === 'function' ? rejectFun : err => {
        throw err
    }

    if (this.state === PENDING) {
        this.resolveFuns.push(resolveFun)
        this.rejectFuns.push(rejectFun)
    }

    if (this.state === resolveFun) {
        resolveFun(this.value)
    }

    if (this.state === rejectFun) {
        rejectFun(this.value)
    }
}
```
**使用示例**
```js
new myPromise((resolve, reject) => {
    console.log('123') // 123
    // resolve(666)
    reject(777)
}).then(res => {
    console.log('success:' + res) // 666
}, err => {
    console.log('error:' + err) // 777
})
```

## 符合A+规范
```js
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function myPromise(fn) {
    this.state = PENDING
    this.value = null
    this.resolveFuns = []
    this.rejectFuns = []

    const resolved = (v) => {
        if (v instanceof myPromise) {
            return v.then(resolved, rejected)
        }
        setTimeout(() => {
            if (this.state === PENDING) {
                this.state = RESOLVED
                this.value = v
                this.resolveFuns.forEach(fun => fun(this.value))
            }
        }, 0)
    }

    const rejected = (err) => {
        setTimeout(() => {
            if (this.state === PENDING) {
                this.state = REJECTED
                this.value = err
                this.rejectFuns.forEach(fun => fun(this.value))
            }
        }, 0)
    }

    try {
        fn(resolved, rejected)
    } catch (err) {
        rejected(err)
    }
}

function resolutionProcedure(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Error'))
    }
    if (x instanceof MyPromise) {
        x.then(function (value) {
            resolutionProcedure(promise2, value, resolve, reject)
        }, reject)
    }
    let called = false
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(
                    x,
                    y => {
                        if (called) return
                        called = true
                        resolutionProcedure(promise2, y, resolve, reject)
                    },
                    e => {
                        if (called) return
                        called = true
                        reject(e)
                    }
                )
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}

myPromise.prototype.then = function (resolveFun, rejectFun) {
    resolveFun = typeof resolveFun === 'function' ? resolveFun : v => v
    rejectFun = typeof rejectFun === 'function' ? rejectFun : err => {
        throw err
    }
    let that = this
    if (this.state === PENDING) {
        return (promise2 = new myPromise((resolve, reject) => {
            that.resolveFuns.push(() => {
                try {
                    const res = resolveFun(that.value)
                    resolutionProcedure(promise2, res, resolve, reject)
                } catch (err) {
                    reject(err)
                }
            })

            that.rejectFuns.push(() => {
                try {
                    const res = rejectFun(that.value)
                    resolutionProcedure(promise2, res, resolve, reject)
                } catch (err) {
                    reject(err)
                }
            })
        }))
    }

    if (this.state === RESOLVED) {
        return (promise2 = new myPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const res = resolveFun(that.value)
                    resolutionProcedure(promise2, res, resolve, reject)
                } catch (err) {
                    reject(err)
                }
            }, 0)
        }))
    }

    if (this.state === REJECTED) {
        return (promise2 = new myPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const res = rejectFun(this.value);
                    resolutionProcedure(promise2, res, resolve, reject)
                } catch (err) {
                    reject(err)
                }
            }, 0)
        }))
    }
}
```
**使用示例**
```js
new myPromise((resolve, reject) => {
    console.log('123')
    resolve(666)
    // reject(777)
}).then(res => {
    console.log('success:' + res)
}, err => {
    console.log('err:' + err)
})I
```

