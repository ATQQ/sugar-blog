---
title: 优秀装饰器源码学习（三）
date: 2021-08-02
tags:
 - 技术笔记
 - 源码学习
categories:
 - 技术笔记
---
# 优秀装饰器源码学习（三）

## 前言
通过前两篇文章[《优秀装饰器源码学习（一）：time》](./core-decorators-1.md),[《优秀装饰器源码学习（二）》](core-decorators-2.md)学习了

`@time`,`@deprecate`, `@readonly`, `@enumerable`, `@nonconfigurable`等基础的装饰器

本文和大家一起学习几个稍微复杂一点的装饰器：
* `@mixin`：混入方法到类中
* `@lazyInitialize`：在使用的时候才初始化目标属性

## @mixin
混入对象中的方法到类中

### 使用示例
通过`@mixin(obj1,obj2,obj3,..)`就能将对象中的属性，挂载到目标类的原型上

就行Vue中通过mixin混入一些公共的方法
```ts
import { mixin } from '../index'
const obj1 = {
    logA() {
        console.log(this.a);
    }
}
const obj2 = {
    printKeys() {
        console.log(Object.keys(this));
    }
}

@mixin(obj1, obj2)
class Test {
    public a = 1
}

const t: any = new Test()

t.logA() // 1
t.printKeys() // ['a']
```

### 函数结构
传入参数:
* objs：rest参数，支持传入多个对象进行混入的操作

```ts
function handleClass(target, mixins) {
    if (!mixins.length) {
        throw new SyntaxError(`@mixin() class ${target.name} requires at least one mixin as an argument`);
    }
}
export default function mixin(...objs) {
    return function (target) {
        return handleClass(target, objs)
    }
}
```

### 实现原理
* 类装饰器第一个参数`target`标识装饰的类
* target.prototype标识类的原型
* 遍历传入的对象，通过Object上的`getOwnPropertyNames`与`getOwnPropertyDescriptor`方法分别获取目标对象的自有属性（不包括Symbol属性）与指定属性的描述符
* 在通过`Object.defineProperty`实现在`Class.prototype`上进行拓展

### handleClass的完整实现
```ts
/**
 * 获取对象上的每个属性的描述符
 */
function getOwnPropertyDescriptors(obj) {
    const descs = {};
    Object.getOwnPropertyNames(obj).forEach(key => {
        descs[key] = Object.getOwnPropertyDescriptor(obj, key)
    })
    return descs;
}

function handleClass(target, mixins) {
    if (!mixins.length) {
        throw new SyntaxError(`@mixin() class ${target.name} requires at least one mixin as an argument`);
    }
    for (let i = 0; i < mixins.length; i++) {
        const descs = getOwnPropertyDescriptors(mixins[i])
        const keys = Object.getOwnPropertyNames(mixins[i])

        for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            if (!target.prototype.hasOwnProperty(key)) {
                Object.defineProperty(target.prototype, key, descs[key])
            }
        }
    }
}
```

## lazyInitialize
懒加载指定属性，即在使用的时候才初始化目标属性

### 使用示例
将需要懒执行的逻辑放入到`@lazyInitialize`之中

```ts
import { lazyInitialize } from "..";

function getMaxArray(str=''){
    console.log(str,'init huge array');
    return new Array(100)
}

class Test{
    @lazyInitialize(()=>getMaxArray('a'))
    public a
    public b = getMaxArray('b')
}

const t = new Test()
const k = new Test()
k.a
```

**运行结果**

```sh
b init huge array
b init huge array
a init huge array
```
### 实现原理
* 使用闭包存储值初始化的函数
* 修改属性的get行为，当调用get的时候再执行初始化逻辑
* 将初始化后的内容使用中间变量暂存
* 再次get调用属性的时候，直接返回暂存的内容

### 函数实现
```ts
function createDefaultSetter(key) {
    return function set(newValue) {
        Object.defineProperty(this, key, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: newValue
        });
        return newValue;
    };
}

export default function lazyInitialize(initializer): any {
    let t
    return function (target, key) {
        return {
            get() {
                t = t === undefined? initializer.call(this) : t
                return t;
            },
            set: createDefaultSetter(key)
        }
    }
}
```

## 未完待续
下一篇将学习:
* `@debounce`：防抖
* `@throttle`：节流

