# 作业帮-面经

## 一面
>先问了下实习所做的一些工作

## 手撕代码
1. 数组去重
```js
// 1. {}与{},{a:1}与{a:1},[]与[]算一样的
// [1,2,'1','2',1,null,null,undefined,undefined,{},{},[],[],[1],[1],['1'],['1']]
```
2. 合并两个有序数组，计算其中位数
```js
// [1,2,4,5,6,8,11] m
// [2,5,6,8,10] n
// 1.偶数个时，取中间两个数的平均值
// 2. 时间复杂度不超过O(m+n)
```
## js
1. 判断变量类型的方式有几种
2. Object.prototype.toString.call是如何判断的，讲讲原理
3. null instanceof Object结果
4. 了解闭包吗？他有什么缺点，如何优化
5. 知道强引用与弱引用吗

## CSS
1. 如何实现响应式布局
2. 如何书写媒体查询
3. 如何保证h5和pc在显示上的一致性（即不会很突兀切换的时候）


## 浏览器
1. 垃圾回收机制了解吗？如何工作的
2. 回流与重绘是什么
3. 一个div的高度100px是被其内容撑开的，如果为其添加样式`height:50px;overflow:hidden`，会触发回流重绘吗？如果其先有样式`position:absolute`，再添加上述样式会触发哪些？
4. 使节点脱离文档流的方式有哪些
5. 浏览器渲染页面的过程，从收到html文档开始
6. localStorage，cookie，sessionStorage的区别区别
7. session与cookie有什么关系
8. cookie有哪些属性
9. 异步任务有哪些
10. requestAnimationFrame知道吗，他与setTimeout比较有哪些区别
11. 了解requestIdleCallback吗？他有什么作用

### 其它
1. eslint是如何生成AST的
2. AST有什么作用