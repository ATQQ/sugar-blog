---
sidebar:
 title: 排序--归并排序
 step: 5
isTimeLine: true
title: 归并排序
date: 2020-08-02
tags:
 - 手撕代码
 - 算法与数据结构
categories:
 - 手撕代码
---
# 归并排序
<company value="牛客网,几种常见时间复杂度比较低的排序算法之一"></company>

<LeetCode href="https://leetcode-cn.com/problems/sort-an-array/">912：排序树组</LeetCode>

给你一个整数数组 nums，请你将该数组升序排列。

## 原理
>归并排序利用了分治的思想来对序列进行排序。对一个长为 n 的待排序的序列，我们将其分解成两个长度为n/2的子序列。每次先递归调用函数使两个子序列有序，然后我们再线性合并两个有序的子序列使整个序列有序。

## 相关属性
* 递归实现
  * 缺点：
    * 容易爆栈，当数组足够大，递归很深
    * 需要额外的内存空间
  * 优点
    * 性能不受输入数据的影响，始终都是 O(nlogn) 的时间复杂度
    * 稳定的排序算法

## 递归实现

```js
/**
 * 归并排序
 * @param {Array<number>} arr 
 */
function mergeSort(arr) {
    const len = arr.length
    // 无需排序
    if (len < 2) {
        return arr
    }
    const mid = len >> 1 // 右移一位 === 除2并向下取整
    return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)))
}

/**
 * 合并
 * @param {Array<number>} left 
 * @param {Array<number>} right 
 */
function merge(left, right) {
    const res = []
    let i = 0, j = 0
    while (i < left.length && j < right.length) {
        res.push(left[i] <= right[j] ? left[i++] : right[j++])
    }

    while (i < left.length) {
        res.push(left[i++])
    }

    while (j < right.length) {
        res.push(right[j++])
    }

    return res
}
```

## 迭代实现

```js
//TODO： ... 未完待续
```
