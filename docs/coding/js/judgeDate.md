---
isTimeLine: true
title: 判断两个日期是否是同一周
date: 2020-10-18
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 判断两个日期是否是同一周

## 问题描述
编写代码判断两个日期是否是同一周

**函数定义**
```js
function isSameWeek (d1: Date, d2: Date): boolean {
// TODO，已知 d2 > d1, 按照周一是一周的第一天的逻辑来算，请实现对应的代码
}
```

**测试用例**
```js
console.log(isSameWeek(new Date('2019-09-02'), new Date('2019-09-02')));  // true  
console.log(isSameWeek(new Date('2019-09-02'), new Date('2019-09-03')));  // true  
console.log(isSameWeek(new Date('2019-09-02'), new Date('2019-09-06')));  // true  
console.log(isSameWeek(new Date('2019-09-02'), new Date('2019-09-07')));  // true  
console.log(isSameWeek(new Date('2019-09-02'), new Date('2019-09-08')));  // true  
console.log(isSameWeek(new Date('2019-09-04'), new Date('2019-09-08')));  // true  
console.log(isSameWeek(new Date('2019-09-02'), new Date('2019-09-09')));  // false  
console.log(isSameWeek(new Date('2019-09-02'), new Date('2019-09-10')));  // false  
console.log(isSameWeek(new Date('2019-09-03'), new Date('2019-09-10')));  // false  
```

## 题解

**逻辑梳理，不在同一周的情况:**（已知d2 > d1）
* d2 - d1 >= 7 天
* 星期：weekday2 <= weekday1 && 时间差 >= 1 天
```js
const ONE_DAY = 1000 * 60 * 60 * 24

/**
 * 判断两个日期是否同一周
 * @param {Date} d1 
 * @param {Date} d2 
 */
function isSameWeek(d1, d2) {
    const difftime = d2 - d1
    if (difftime >= ONE_DAY * 7)
        return false
    const weekDay1 = d1.getDay() || 7
    const weekDay2 = d2.getDay() || 7
    if (weekDay2 <= weekDay1 && difftime >= ONE_DAY)
        return false
    return true
}
```

<comment/>
<tongji/>