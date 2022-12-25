---
sidebar:
 title: 链表--转置
 step: 0
isTimeLine: true
title: 单链表转置
date: 2020-08-02
tags:
 - 手撕代码
 - 算法与数据结构
categories:
 - 手撕代码
---
# 单链表转置

<company value="百度,字节,美团"></company>

<LeetCode href="https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/">剑指offer24:单链表反转</LeetCode>


定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

ListNode
```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
```
## 迭代法

![](https://pic.leetcode-cn.com/9ce26a709147ad9ce6152d604efc1cc19a33dc5d467ed2aae5bc68463fdd2888.gif)
```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    let pre, back
    pre = null
    back = head
    while(back){
        let temp = back.next
        back.next = pre
        pre = back
        back = temp
    }
    return pre
};
```

## 递归法-1

![](https://pic.leetcode-cn.com/8951bc3b8b7eb4da2a46063c1bb96932e7a69910c0a93d973bd8aa5517e59fc8.gif)
```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    const reverse = (pre, back) => {
        // 如果下一个节点是null,说明前一个节点是最后一个节点,作为新的头部返回
        if (!back) {
            return pre
        }
        const temp = reverse(back, back.next)
        // 将后一个节点的next指向前一个
        back.next = pre
        return temp
    }
    return reverse(null, head)
};
```

## 递归法-2
原理与上面方法一致

```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    // 如果head为null，表明其为空串直接返回
    // 其下一个节点为null，说明它为最后一个节点，直接返回
    if(!head||!head.next){
        return head
    }
    let temp = reverseList(head.next)
    head.next.next = head
    head.next = null
    return temp
};
```

## 借助栈
```JS
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    // 如果head为null，表明其为空串直接返回
    // 其下一个节点为null，说明它为最后一个节点，直接返回
    if(!head||!head.next){
        return head
    }
    let stack = []
    let p = head
    while(p){
        stack.push(p)
        p = p.next
    }
    let newHead = stack.pop()
    p = newHead
    while(stack.length>0){
        let t = stack.pop()
        p.next = t
        t.next = null
        p = t
    }
    return newHead
};
```

