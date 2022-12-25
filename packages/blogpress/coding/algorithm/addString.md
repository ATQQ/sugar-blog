---
sidebar:
 title: 字符串--大数相加
 step: 6
isTimeLine: true
title: 大数相加&数字字符串相加
date: 2020-09-14
tags:
 - 手撕代码
 - 算法与数据结构
categories:
 - 手撕代码
---
# 大数相加&数字字符串相加

<LeetCode href="https://leetcode-cn.com/problems/add-strings/">415. 字符串相加</LeetCode>

这是一个校招面试时候，手写频率比较高的一个算法题，这里给大家分享**三种方法**：

一个常规解法，两个清奇的思路
## 题目描述
给定两个字符串形式的非负整数 num1 和num2 ，计算它们的和。

要求：
* num1 和num2 的长度都小于 5100
* num1 和num2 都只包含数字 0-9
* num1 和num2 都不包含任何前导零
* 你不能使用任何內建 BigInteger 库，也不能直接将输入的字符串转换为整数形式

## 1. 朴素做法
按竖式计算的方式，模拟向加
### 过程描述
1. 从最低位开始遍历，对应位相加，再加上进位
2. 相加结果再除10，结果为进位，余数作为当前位的值
3. 重复上述操作，知道两个字符串都遍历完成

例：**1255 + 456**
```js
初始化  进位 t = 0

0:  x + y + t      /10  商(t)  余(p)
1:  5 + 6 + 0 = 11 /10   1      1   
2:  5 + 5 + 1 = 11 /10   1      1   
3:  2 + 4 + 1 = 7  /10   0      7   
4:  1 + 0 + 0 = 1  /10   0      1   
结果：1711
```
### 实现代码
```js
// 48 是字符 0 的ASCII码

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function (num1, num2) {
    let res = ''
    let i = num1.length - 1, j = num2.length - 1, flag = 0
    while (i >= 0 || j >= 0 || flag !== 0) {
        if (i >= 0) flag += num1.charCodeAt(i--) - 48
        if (j >= 0) flag += num2.charCodeAt(j--) - 48
        res = '' + flag % 10 + res
        flag /= 10
        // 向下取整
        flag = ~~flag
    }
    return res
};
```

**下面介绍一些其它类似的，清奇的思路**

## 解法2
### 过程描述
1. 先通过补0使两个字符串长度一样
2. 从低位开始，对应位进行相加再加进位
3. 结果大于等于10则 进位为1 当前位值为 结果对10求余
4. 结果小于10 进位为0 当前位值为 结果对10求余
5. 重复上述操作，知道两者都遍历完

### 实现代码
```js
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function (num1, num2) {
    let res = '' // 结果
    let flag = 0 // 进位
    // 补全0
    while (num1.length < num2.length) {
        num1 = '0' + num1
    }
    while (num2.length < num1.length) {
        num2 = '0' + num2
    }
    let i = num1.length - 1
    // 从尾数开始遍历
    while (i >= 0) {
        flag = Number(num1[i]) + Number(num2[i]) + flag
        res = (flag % 10) + res
        flag = flag >= 10 ? 1 : 0
        i--
    }
    return flag === 1 ? '1' + res : res
};
```

## 解法3
### 思路描述
1. 先通过补0使两个字符串长度一样
2. 取得当前环境所能表达最大的数字的长度l，取n= l-1 作为所能相加的最大的两个数
3. 每一次截取后n位字符串，强转为数字，然后进行相加，再加进位
4. 结果截取后n位作为这n位的值
   1. 如果结果长度大于n位，则进位为1,否则为0
   2. 如果结果长度小于n位，则不足位数用0进行补
### 实现代码
```js
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function (num1, num2) {
    let res = '' // 结果
    let flag = 0 // 进位
    const n = String(Number.MAX_SAFE_INTEGER).length - 1 // 所能表示的最大位数 -1

    // 补全0
    while (num1.length < num2.length) {
        num1 = '0' + num1
    }
    while (num2.length < num1.length) {
        num2 = '0' + num2
    }
    while (num1.length) {
        let sum = String(Number(num1.slice(-n)) + Number(num2.slice(-n)) + flag)
        flag = sum.length > n ? 1 : 0
        res = sum.slice(-n) + res
        num1 = num1.slice(0, -n)
        num2 = num2.slice(0, -n)
        // 补0
        if (num1.length && sum.length < n) {
            res = new Array(n - sum.length).fill(0).join('') + res
        }
    }
    return res
};
```

