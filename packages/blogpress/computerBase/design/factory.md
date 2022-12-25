---
sidebar:
 title: 工厂模式
 step: 0
isTimeLine: true
title: 简单工厂模式
date: 2020-04-14
tags:
 - 计算机基础
 - 设计模式
categories:
 - 计算机基础
---
# 简单工厂模式
将创建对象的过程单独封装
## 需求
一个信息录入系统
* 姓名
* 年龄
* 职业
* 职责

不同职业拥有不同的职责(假设职业上10种)

* 程序员:写代码,修bug,系统分析报告
* 产品经理:订会议室,写需求,催更
* ...

### ES5
```js
function User(name, age, career, works) {
    this.name = name
    this.age = age
    this.career = career
    this.works = works
}

function Factory(name, age, career) {
    let works = []

    switch (career) {
        case 'coder':
            works = ['写代码', '修bug', '系统分析报告']
            break;
        case 'product manager':
            works = ['订会议室', '写需求', '催更']
            break;
        case 'boss':
            works = ['喝茶', '看报', '见客户']
            break;
        default:
            break;
    }
    return new User(name, age, career, works)
}

console.log(Factory('小明', 18, 'coder'))
console.log(Factory('小红', 20, 'product manager'))
```


### ES6
```js
class User {
    constructor(name, age, career, works) {
        this.name = name
        this.age = age
        this.career = career
        this.works = works
    }
}

class Factory {
    static create(name, age, career) {
        let works = []
        switch (career) {
            case 'coder':
                works = ['写代码', '修bug', '系统分析报告']
                break;
            case 'product manager':
                works = ['订会议室', '写需求', '催更']
                break;
            case 'boss':
                works = ['喝茶', '看报', '见客户']
                break;
            default:
                break;
        }
        return new User(name, age, career, works)
    }
}
```

