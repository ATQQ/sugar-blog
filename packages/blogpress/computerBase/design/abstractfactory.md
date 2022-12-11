---
sidebar:
 title: 抽象工厂模式
 step: 1
isTimeLine: true
title: 抽象工厂模式
date: 2020-04-14
tags:
 - 计算机基础
 - 设计模式
categories:
 - 计算机基础
---
# 抽象工厂模式
围绕一个超级工厂创建其他工厂

开放封闭原则的内容：对拓展开放，对修改封闭

软件实体（类、模块、函数）可以扩展，但是不可修改

1. 一部智能手机的基本组成是操作系统（Operating System，我们下面缩写作 OS）和硬件（HardWare）组成。所以说如果我要开一个山寨手机工厂，那我这个工厂里必须是既准备好了操作系统，也准备好了硬件，才能实现手机的量产。
```js
// 抽象手机工厂
class MobilePhoneFactory {
    createOS() {
        throw new Error('不允许使用抽象工厂的方法')
    }

    createHardWare() {
        throw new Error('不允许使用抽象工厂的方法')
    }
}
// 抽象操作系统
class OS {
    controlHardWare() {
        throw new Error('不允许使用抽象工厂的方法')
    }
}
// 抽象硬件
class HandWare {
    operateByCommand() {
        throw new Error('不允许使用抽象工厂的方法')
    }
}
```
抽象工厂不干活，具体工厂（ConcreteFactory）来干活

```js
class AndroidOS extends OS {
    controlHardWare() {
        console.log('安卓的方式调用硬件')
    }
}

class IOS extends OS{
    controlHardWare() {
        console.log('苹果的方式调用硬件')
    }
}

class GTHandWare extends HandWare {
    operateByCommand() {
        console.log('高通的方式去运行指令')
    }
}

class AppleHandWare extends HandWare {
    operateByCommand() {
        console.log('苹果的方式去运行指令')
    }
}
```

制造一台山寨手机,Android,高通处理器

```js
class FakeMobile extends MobilePhoneFactory {
    createOS() {
        return new AndroidOS()
    }

    createHardWare() {
        return new GTHandWare()
    }
}
```

制作一台苹果手机,IOS,苹果处理器
```js
class AppleMobile extends MobilePhoneFactory {
    createOS() {
        return new IOS()
    }

    createHardWare() {
        return new AppleHandWare()
    }
}
```
测试
```js
let m1 = new FakeMobile()
let m2 = new AppleMobile()

m1.createOS().controlHardWare()
m1.createHardWare().operateByCommand()
m2.createOS().controlHardWare()
m2.createHardWare().operateByCommand()  
// 安卓的方式调用硬件
// 高通的方式去运行指令
// 苹果的方式调用硬件
// 苹果的方式去运行指令
```

## 抽象工厂和简单工厂之间有哪些异同?

**共同点**
* 尝试去分离一个系统中变与不变的部分

**不同点**
* 场景复杂的不一样
* 简单工厂,不苛求代码可扩展性
* 使用抽象类去降低扩展的成本

## 总结
* 抽象工厂:抽象类，它不能被用于生成具体实例,用于声明最终目标产品的共性。
* 具体工厂:用于生成产品族里的一个具体的产品,继承自抽象工厂,实现了抽象工厂里声明的那些方法，用于创建具体的产品的类。
* 抽象产品:抽象类，它不能被用于生成具体实例,具体工厂里实现的接口，会依赖一些类，这些类对应到各种各样的具体的细粒度产品（比如操作系统、硬件等），这些具体产品类的共性各自抽离，便对应到了各自的抽象产品类。
* 具体产品:用于生成产品族里的一个具体的产品所依赖的更细粒度的产品,比如具体的一种操作系统或具体的一种硬件等。

