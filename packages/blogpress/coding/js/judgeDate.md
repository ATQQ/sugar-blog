---
sidebar:
 title: 中等-判断两个日期是否同一周
 step: 10
isTimeLine: true
title: 判断两个时间是否在同一周
date: 2021-06-12
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 判断两个时间是否在同一周

这个题是在面试的时候遇到的，还遇到了2次，和大家分享一下自己的解题思路

感觉像是一个业务上的题，可能面试官刚做过类似的需求，就直接拿出来问了

## 问题描述
编写一个方法判断两个时间是否在同一周里：

要求如下
* 一周的范围：从**周一到周日**
* 方法传入参数为2个，支持任意顺序传入（**d1 >= d2**或**d1 <= d2**）

**函数定义**

```ts
function isSameWeek (d1: Date, d2: Date): boolean {

}
```

## 分析
理清思路，梳理逻辑

### 可能出现的情况
>假设d1<=d2

1. d1∉[1,7]，d2∈[1,7]
2. d1∈[1,7]，d2∈[1,7]
3. d1∈[1,7]，d2∉[1,7]

### 非同一周的情况
随便翻开一个日历看一看，分析一波:

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMzQ4NzgwOTAyOA==623487809028)

1. 日期之差大于等于7天 即 **| d1 - d2 | >= 7**
   * 如 06-07 与 06-14，06-07 与 06-15 
2. 大日期的星期 < 小日期的星期
   * 如 06-14 与 06- 13
3. 大日期的星期 == 小日期的星期，且时间差 >1 天
   * 如 06-14 00:00 与 06-07 23:59:59

## 实现
### Date相关知识
* `Date.prototype.getDay`:根据本地时间，返回一个具体日期中一周的第几天，0 表示星期天
* Date之间做差，会转为时间戳进行计算

### 朴素代码
```js
const ONE_DAY = 1000 * 60 * 60 * 24

/**
 * 判断两个时间是否同一周
 * @param {Date} d1 
 * @param {Date} d2 
 */
function isSameWeek(d1, d2) {
    const difftime = Math.abs(d2 - d1)
    // 时间差大于等于7天
    if (difftime >= ONE_DAY * 7) {
        return false
    }
    // 前者存放小日期的星期，后者存放大日期的星期
    let smallDay, bigDay
    if (d1 > d2) {
        // 周日返回的是0，给它转为7
        bigDay = d1.getDay() || 7
        smallDay = d2.getDay() || 7
    } else {
        smallDay = d1.getDay() || 7
        bigDay = d2.getDay() || 7
    }

    // 大日期的星期 < 小日期的星期
    if (bigDay < smallDay) {
        return false
    }
    // 大日期的星期 == 小日期的星期，且时间差 >1 天
    if (bigDay === smallDay && difftime > ONE_DAY){
        return false
    }
    
    return true
}
```

### 简化后
```js
function isSameWeek(d1, d2) {
    const difftime = Math.abs(d2 - d1)
    let bigDay = (d1 > d2 ? d1.getDay() : d2.getDay()) || 7
    let smallDay = (d1 < d2 ? d1.getDay() : d2.getDay()) || 7
    return !(difftime >= ONE_DAY * 7 || bigDay < smallDay || (bigDay === smallDay && difftime > ONE_DAY))
}
```
## 测试
```js
console.log(isSameWeek(new Date('2021-06-12'), new Date('2021-06-12')));  // true  
console.log(isSameWeek(new Date('2021-06-13'), new Date('2021-06-12')));  // true  
console.log(isSameWeek(new Date('2021-06-12 23:59:59'), new Date('2021-06-07')));  // true  
console.log(isSameWeek(new Date('2021-06-06 23:59:59'), new Date('2021-06-12')));  // false  
console.log(isSameWeek(new Date('2021-06-12 23:59:59'), new Date('2021-06-19')));  // false  
console.log(isSameWeek(new Date('2021-06-20'), new Date('2021-06-12')));  // false  
```
