---
sidebar:
 title: 垃圾回收
 step: 8
isTimeLine: true
title: 垃圾回收机制
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 垃圾回收机制

JavaScript 中的内存管理是自动执行的，而且是不可见的。
## 垃圾?
* 没有被引用的对象
* 几个对象引用形成一个环,互相引用,但无法访问到

## 可达性
简单地说，“可达性” 值就是那些**以某种方式可访问或可用的值**，它们被保证存储在内存中
1. 有一组基本的固有可达值，由于显而易见的原因无法删除
* 本地函数的局部变量和和参数
* 嵌套调用链上的其它函数的变量与参数
* 全局变量
* 其它的内部变量

这些值称为根。

2. 如果引用或引用链可以从根访问任何其他值，则认为该值是可访问的
* 如果局部变量中有对象，并且该对象具有引用另一个对象的属性，则该对象被视为可达性，它引用的那些也是可以访问的

## 例子
1. 单个对象的引用
```js
let user = {name:'xiaoming'}
// user --> {name:'xiaoming'}

user = null
// user -x-  {name:xiaoming}

// 回收
// 因为{name:'小明'} 无法再被访问到
```
2. 两个对象引用同一个
```js
let user1 = {name:'xiaoming'}
// user --> {name:'xiaoming'}

let user2 = {name:'xiaoming'}
// user1 --> {name:'xiaoming'}  <-- user2

user1 = null
// user1 -x- {name:'xiaoming'}  <-- user2
// 这里还可以通过user访问到{name:'xiaoming'} 所以不会回收

user2 = null
// user1 -x- {name:'xiaoming'}  -x- user2

// 回收{name:'小明'}
```

3. 相互引用
```js
function marray(woman, man) {
    woman.husband = man
    man.wife = woman
    return {
        male: man,
        female: woman
    }
}
let woman = { name: 'qq' }
// woman --> qq

let man = { name: 'tb' }
// man --> tb

let couple = marray(woman, man)

// couple --> male --> tb x qq  <-- female <--couple

// tb x qq = tb -->wife --> qq     qq --> husband -->tb

// 如果要回收 {name:'tb'}
man = null
// man -x- tb
couple.male = null
// couple --> male -x- tb
couple.female.husband = null
// qq --> husband -x- tb
console.log(couple)
```
4. 无法访问的数据块
```js
let a = marray({name:'a'},{name:'b'})

a = null
// 直接回收数据块 
```

## 总结
* 不具有**可达性**的块或值会被清理

## 内部算法
### 标记-清除算法
1. 垃圾回收器获取根并“标记”(记住)它们。
2. 然后它访问并“标记”所有来自它们的引用。
3. 然后它访问标记的对象并标记它们的引用。所有被访问的对象都被记住，以便以后不再访问同一个对象两次。
4. 以此类推，直到没有未访问的引用(能从根访问)为止。
5. 除标记的对象外，其它对象都被删除。

### 优化
* 分代回收——对象分为两组:“新对象”和“旧对象”。许多对象出现，完成它们的工作并迅速结 ，它们很快就会被清理干净。那些活得足够久的对象，会变“老”，并且很少接受检查。
* 增量回收——如果有很多对象，并且我们试图一次遍历并标记整个对象集，那么可能会花费一些时间，并在执行中会有一定的延迟。因此，引擎试图将垃圾回收分解为多个部分。然后，各个部分分别执行。这需要额外的标记来跟踪变化，这样有很多微小的延迟，而不是很大的延迟。
* 空闲时间收集——垃圾回收器只在 CPU 空闲时运行，以减少对执行的可能影响。

:::tip 参考
[前端面试：谈谈 JS 垃圾回收机制](https://segmentfault.com/a/1190000018605776?utm_source=tag-newest#item-1)
:::

