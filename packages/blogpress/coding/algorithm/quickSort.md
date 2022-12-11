---
sidebar:
 title: 排序--快速排序
 step: 3
isTimeLine: true
title: 快速排序
date: 2020-08-02
tags:
 - 手撕代码
 - 算法与数据结构
categories:
 - 手撕代码
---
# 快速排序

<company value="这个频率比较高。。。对于前端来说，算基础考点"></company>

<LeetCode href="https://leetcode-cn.com/problems/sort-an-array/">912：排序树组</LeetCode>

给你一个整数数组 nums，请你将该数组升序排列。

## 相关属性
* 时间复杂度
  * 平均时间复杂度:O(N*logN)
  * 最坏情况下:O(N²)
    * 排序一个已经有序的数组，退化成冒泡排序，每一次都只能确定基准数的位置

## 交换法
原理参考-[【坐在马桶上看算法】快速排序](https://blog.csdn.net/afjaklsdflka/article/details/52829030)
```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function (nums) {
    const swap = (arr, i, j) => {
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }

    const _quickSort = (arr, left, right) => {
        if (left >= right) {
            return
        }
        let o = left
        let i = left, j = right
        while (left !== right) {
            // 先从右往左动
            while (arr[right] >= arr[o] && left < right) {
                right--
            }
            while (arr[left] <= arr[o] && left < right) {
                left++
            }
            if (left < right) {
                swap(arr, left, right)
            }
        }
        swap(arr, o, left)
        _quickSort(arr, i, left - 1)
        _quickSort(arr, left + 1, j)
    }
    _quickSort(nums, 0, nums.length - 1)
    return nums
};
```
## 填坑法
原理参考-[漫画：什么是快速排序？（完整版）](https://www.cxyxiaowu.com/5262.html)
```js
function quickSort(data) {
    const _quickSort = (arr, left, right) => {
        if (left >= right) {
            return
        }
        let o = arr[left] // 选择的基数
        let oIndex = left // 当前的坑位置
        const i = left
        const j = right
        while (left < right) {
            while (left < right) {
                if (arr[right] < o) {
                    arr[oIndex] = arr[right] // 填坑
                    oIndex = right // 新坑
                    left++
                    break
                }
                right--
            }
            while (left < right) {
                if (arr[left] > o) {
                    arr[oIndex] = arr[left] // 填坑
                    oIndex = left // 新坑
                    right--
                    break
                }
                left++
            }
        }

        arr[oIndex] = o // 基数入坑
        // 开始下一轮
        _quickSort(arr, i, oIndex - 1)
        _quickSort(arr, oIndex + 1, j)
    }
    _quickSort(data, 0, data.length - 1)
    return data
}
```

