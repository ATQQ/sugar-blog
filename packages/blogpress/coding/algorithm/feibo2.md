---
sidebar:
 title: 简单--斐波拉契数列2
 step: 10
isTimeLine: true
title: 斐波拉契数列
date: 2020-10-02
tags:
 - 手撕代码
 - 算法与数据结构
categories:
 - 手撕代码
---
# 斐波拉契数列II

斐波那契数列示例： 

1，1，2，3，5，8，13，21，34 。。。。

求指定的“斐波拉契数”在数列中的位置

比如输入8得到该值在数列中的位置6，不存在则返回-1

## 迭代
```js
/**
 * 求指定斐波拉契数对应的位置
 * @param {number} num 
 * @returns {number}
 */
function getFibIndex(num) {
    if (num === 1) {
        return 1
    }
    let a = 1, b = 1, c = 0
    let index = 2
    while (c < num) {
        index++
        c = a + b
        a = b
        b = c
        if (c === num) {
            return index
        }
    }
    return -1
}
```


## 递归
类似迭代的处理思路，将计算过程作为参数传入

```js
/**
 * 求指定斐波拉契数对应的位置
 * @param {number} num 
 * @returns {number}
 */
function getFibIndex(num, a = 1, b = 1, index = 2) {
    if (num === 1) {
        return 1
    }
    if (a + b > num) {
        return -1
    }
    if (a + b === num) {
        return ++index
    }
    return getFibIndex(num, b, a + b, ++index)
}
```

