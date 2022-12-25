---
sidebar:
 title: 排序--堆排序
 step: 4
isTimeLine: true
title: 堆排序
date: 2020-08-02
tags:
 - 手撕代码
 - 算法与数据结构
categories:
 - 手撕代码
---
# 堆排序

<company value="几种常见时间复杂度比较低的排序算法之一"></company>

<LeetCode href="https://leetcode-cn.com/problems/sort-an-array/">912：排序树组</LeetCode>

给你一个整数数组 nums，请你将该数组升序排列。

## 原理
>堆排序的思想就是先将待排序的序列建成大根堆，使得每个父节点的元素大于等于它的子节点。此时整个序列最大值即为堆顶元素，我们将其与末尾元素交换，使末尾元素为最大值，然后再调整堆顶元素使得剩下的 n-1n−1 个元素仍为大根堆，再重复执行以上操作我们即能得到一个有序的序列。

## 实现
。。。未完待续

