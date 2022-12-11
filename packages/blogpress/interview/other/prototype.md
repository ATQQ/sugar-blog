---
isTimeLine: true
title: 如何理解原型？如何理解原型链？
date: 2020-03-10
tags:
 - 面试
 - 其它
categories:
 - 面试
---
# 如何理解原型？如何理解原型链？
## 原型
每一个JavaScript对象在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性,原型是一个含了很多函数的对象

每一个JavaScript对象都具有的一个属性，叫__proto__，这个属性会指向该对象的原型。

## 原型链
原型链就是多个对象通过 ``__proto__`` 的方式连接了起来,相互关联的原型组成的链状结构就是原型链

## 总结
* Object 是所有对象的祖先，所有对象都可以通过 ``__proto__`` 找到它
* Function 是所有函数的祖先，所有函数都可以通过 ``__proto__`` 找到它
* 函数的 prototype 是一个对象
* 对象的 ``__proto__`` 属性指向原型， ``__proto__`` 将对象和原型连接起来组成了原型链

![图片](https://img.cdn.sugarat.top/mdImg/MTU4Mzg0NDg5ODg5Mg==583844898892)

:::tip 参考
[冴羽:JavaScript深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)<br/>
[KieSun:深度解析原型中的各个难点](https://github.com/KieSun/Dream/issues/2)
:::

