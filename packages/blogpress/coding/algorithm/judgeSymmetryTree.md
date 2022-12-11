---
sidebar:
 title: 二叉树--判断是否对称
 step: 2
isTimeLine: true
title: 判断是否为对称二叉树
date: 2020-08-02
tags:
 - 手撕代码
 - 算法与数据结构
categories:
 - 手撕代码
---
# 判断是否为对称二叉树

<LeetCode href="https://leetcode-cn.com/problems/dui-cheng-de-er-cha-shu-lcof/">剑指offer：对称二叉树</LeetCode>

请实现一个函数，用来判断一棵二叉树是不是对称的。如果一棵二叉树和它的镜像一样，那么它是对称的

TreeNode
```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
```
## 递归解法
* 简洁明了，美丽大方
* true 
  * 都为null
  * 值相等
* false
  * 一方为null,另一方不为null
  * 值不相等
```js
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function (root) {
    if (root === null) {
        return true
    }

    const judge = (r1, r2) => {
        if (r1 === r2 && r2 === null) {
            return true
        }
        if (r1 === null || r2 === null) {
            return false
        }
        return r1.val === r2.val && judge(r1.left, r2.right) && judge(r1.right, r2.left)
    }

    return judge(root.left, root.right)
};
```

## 中序遍历解法
如果是对称的，则中序遍历结果数组一定是对称的

中序遍历规则：左根右

![](https://pic.leetcode-cn.com/06193490d03009fade5a60b927f0966b747c1366e40a4d4f97bbc37e18e09cef-image.png)

上图是一种特殊情况:其中序遍历结果[2,2,1,2,2]但不对称，此时需要对比节点所在层数,[3,2,1,3,2]，所以得出下面的代码

```js
var isSymmetric = function (root) {
    if (root === null) {
        return true
    }
    const res = [] // 中序遍历结果
    const level = [] // 存放每个值所在的层数
    const midTravsere = (root, deep) => {
        if (!root) {
            return
        }
        midTravsere(root.left, deep + 1)
        res.push(root.val)
        level.push(deep)
        midTravsere(root.right, deep + 1)
    }
    midTravsere(root, 1)

    // 左右镜像节点进行对比，如果值不一样或者值一样层数不一样都为false
    for (let i = 0, j = res.length - 1; i < j; i++ , j--) {
        if (res[i] !== res[j] || level[i] !== level[j]) {
            return false
        }
    }
    return true
};
```

## 层序遍历
...未完待续

