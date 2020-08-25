# for in遍历数组的坑
* 除了遍历数组元素外，还会遍历自定义属性与原型链上的属性
```js
let a = [1, 2, 3, 4]
a.name = 'xiaoming'
Array.prototype.age = 12

for (const key in a) {
    console.log(key);
}
// 0 1 2 3 name age
```
* 某些情况下，这段代码可能按照随机顺序遍历数组元素
```js

```
* for-in是为普通对象设计的，不适用于数组遍历
* for-in循环用来遍历对象属性,for-of循环更适合用来遍历数组

<tongji/>