---
title: 学习笔记：TypeScript装饰器
date: 2021-06-24
tags:
 - 技术笔记
 - 学习笔记
categories:
 - 技术笔记
---
# 学习笔记：TypeScript装饰器
使用装饰器可以装饰一个类或类中的属性

在不修改装饰对象中的源代代码，情况下改变目标对象的行为
## 测试环境
下面的实践均采用ts编写，使用ts-node直接运行，需在全局安装`typescipt`与`ts-node`

全局安装依赖
```sh
npm i typescript ts-node -g
```

运行ts文件
```sh
ts-node xx.ts
```

## 类装饰器
装饰器对象是一个类

```ts
function classDecorator(target){
    return target
}

@classDecorator
class C{
    hello(){
        console.log('hello world')
    }
}
```

* target表示装饰的目标类

示例：在目标类上拓展 sayHello 方法
```ts
function helloWorld(target){
    // target === 目标类
    target.prototype.sayHello = function(){
        console.log('hello world');
    }
    return target
}

@helloWorld
class Router {
    sayHello() {
        throw new Error("Method not implemented.");
    }

}


const r = new Router()

r.sayHello() // hello world
```

## 函数装饰器
装饰对象的值是一个函数
```ts
function funDecorator(target, name, descriptor){
    return descriptor.value
}
class C{
    @funDecorator
    hello(){
        console.log('hello world')
    }
}
```

* target: 目标类的原型
* name: 属性名
* descriptor：属性描述符号
  * value：属性值
  * writable：是否可以被重写
  * enumerable：是否可枚举
  * configurable：是否可配置

示例：提示某个方法已经失效
```ts
function expired(target, name, descriptor): any {
    console.log('fun:',name, 'is expired');
    return descriptor.value
}

@helloWorld
class Router {
    @expired
    hello() {
        // ...code
    }
    @expired
    hello2(){
        // ...code
    }
}
// fun: hello is expired
// fun: hello2 is expired
``` 

## get/set装饰器
装饰存/取器的装饰器

* target: 静态方法指向类的构造函数，实例方法指向类的原型
* name: 属性名
* descriptor：属性描述符号
  * value：属性值
  * writable：是否可以被重写
  * enumerable：是否可枚举
  * configurable：是否可配置

```ts
function getDecorator(target,name,descriptor){

}

function getDecorator(target,name,descriptor){
    
}

class C{
    private _x: number
    private _y: number
    constructor(x, y) {
        this._x = x
        this._y = y
    }

    @getDecorator
    get x() {
        return this._x
    }

    @getDecorator
    get y() {
        return this._y
    }
        
    @setDecorator
    set x(v) {
        this._x = v
    }

    @getDecorator
    set y(v) {
        this._y = v
    }
}
```

emmmm，暂没想到用武之地

## 属性装饰器
简而言之就是装饰对象是一个普通的属性,参数和上述函数装饰器一致

函数也可以看做是类的一个属性，只不过其属性值是`function`

```ts
function propertyDecorator(target,name){

}

class C{
    @propertyDecorator
    private property:string|undefined
}
```

示例：设置默认值
```ts
function defaultValue(v: any) {
    return function (target, name) {
        target[name] = v
    }
}

class Router {
    @defaultValue('666')
    public name: string | undefined
}


const r = new Router()

console.log(r.name);
```
其中装饰器传参实现，可以看做是一个闭包调用

在设置装饰器的时候传递参数，然后返回一个函数去真正装饰目标对象

这个被装饰的对象可以使用传递的参数

## 函数参数装饰器
顾名思义，装饰对象是函数中的一个参数

```ts
function paramDecorator(target,name,idx){

}

class C{
    fun1(@paramDecorator a){

    }
    static func2(@paramDecorator a){

    }
}
```
* target: 静态方法指向类的构造函数，实例方法指向类的原型
* name：属性名
* idx：参数在函数中所处位置

示例：获取参数在函数中的相对位置
```ts
function printParamPos(target, name, idx) {
    console.log('paramCount:', target[name].length, 'paramPos:', idx);
}

class Router {
    hello3(@printParamPos name: string) {
        console.log('hello3', name);
    }
    static hello4(@printParamPos name: string) {
        console.log('hello4', name);
    }
}

const r = new Router()
Router.hello4('123')
r.hello3('456')
// paramCount: 1 paramPos: 0
// paramCount: 1 paramPos: 0
// hello4 123
// hello3 456
```

## 实例
这里参考了一下[core-decorators](https://github.com/jayphelps/core-decorators)中的源码

### 弃用API提示
```ts
/**
 * 弃用指定API提示
 * @param msg 
 * @returns 
 */
export function deprecate(msg = 'This function will be removed in future versions.') {
    return function (target, key, descriptor) {
        const methodSignature = `${target.constructor.name}#${key}`;
        return {
            ...descriptor,
            value: function () {
                console.warn(`DEPRECATION ${methodSignature}: ${msg}`);
                return descriptor.value.apply(this, arguments);
            }
        };
    }
}
```

测试代码
```ts
import { deprecate } from './decorators/index'

class TestClass {
    @deprecate()
    hello(name: string) {
        console.log('hello', name);
    }
}

const a = new TestClass()

a.hello('world')
```

运行结果:
```sh
DEPRECATION TestClass#hello: This function will be removed in future versions.
hello world
```

## 参考
* [TypeScript-decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators)
* [core-decorators源码](https://github.com/jayphelps/core-decorators)

