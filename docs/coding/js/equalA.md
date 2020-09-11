# 如何实现变量a同时等于多个值

```js
if(a==1&&a==2){
    console.log('yes')
}
```

## 定义[ToPrimitive]
```js
let a = {
    v:1,
    [Symbol.toPrimitive](){
        return this.v++
    }
}
```

## 定义valueOf
```js
let a = {
    v:1,
    valueOf(){
        return this.v++
    }
}
```

## 定义toString
```js
let a = {
    v:1,
    toString(){
        return this.v++
    }
}
```


<comment/>
<tongji/>