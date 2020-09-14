# 如何判断变量类型是对象
>指广义上的对象这里，Array,RegExp,function。。。。等等
## 1. instanceof

```js
{} instanceof Object // true
[] instanceof Object // true
```


## 2. typeof
```js
function isObject(obj) {
    const type = typeof obj
    return obj && type === 'object' || type === 'function'
}
```

其余方案,编写`isObject`函数稍许麻烦
* constructor
* Object.prototype.toString.call

<comment/>
<tongji/>