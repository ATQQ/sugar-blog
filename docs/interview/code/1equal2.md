# 如何让a == 1 且 a == 2结果为true
>可通过重新定义对象的隐式转换行为实现

* valueOf
* toString
* [Symbol.toPrimitive]
```js
let a = {
    i: 1,
    valueOf() {
        return this.i++
    }
}
let b = {
    i: 1,
    toString() {
        return this.i++
    }
}

let c = {
    i: 1,
    [Symbol.toPrimitive]() {
        return this.i++
    }
}
console.log(a == 1 && a == 2);
console.log(b == 1 && b == 2);
console.log(c == 1 && c == 2);
```

<tongji/>