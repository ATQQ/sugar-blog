---
isTimeLine: true
title: 模式串匹配
date: 2020-05-05
tags:
 - 面试
 - 手撕代码
categories:
 - 面试
---
# 模式串匹配

## 暴力解法
```js
function findIndex(origin, target) {
    for (let i = 0; i < origin.length; i++) {
        for (let j = 0, k = i; j < target.length && origin[k] === target[j]; k++, j++) {
            if (j + 1 === target.length) {
                return i
            }
        }
    }
    return -1
}
```

## KMP
```js
function kmp(origin, target) {
    let i = 0,
        j = 0,
        oLen = origin.length,
        tLen = target.length;
    const getNext = (s) => {
        let arr = [-1],
            l = -1, r = 0,
            sLen = s.length;
        while (r < sLen - 1) {
            if (l === -1 || s[l] === s[r]) {
                l++;
                r++;
                arr[r] = l
            } else {
                l = arr[l]
            }
        }
        return arr
    }
    let next = getNext(target)
    while (i < oLen && j < tLen) {
        if (j === -1 || origin[i] === target[j]) {
            i++
            j++
        } else {
            j = next[j]
        }
    }
    return j === tLen ? i - j : -1
}
```

