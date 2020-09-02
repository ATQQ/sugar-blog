# 快手A站二面
## 综合
### 一个复杂的web工程，内部有很多的静态资源代码，js，css，html，image，用哪种数据结构可以准确描述所有静态资源之间的依赖关系
### 浏览器输入URL到页面展示整个阶段发生了什么

## 手撕代码
### 问题1
```js
问题2：
斐波那契数列示例： 
1，1，2，3，5，8，13，21，34 。。。。
实现这样一个函数，得到指定位置上数列的值。
函数签名：function fib(index: number): number;
调用效果：
fib(2) => 1
fib(4) => 3

使用迭代实现
```

### 问题2
```js
如果问题2中的参数和返回值调换一下，比如输入8得到该值在数列中的位置6，不存在则返回-1。
函数签名：function getFibIndex(value: number): number; 假定参数value大于1。
调用效果：
getFibIndex(4) => -1
getFibIndex(21) => 8
```

## JS
### 阅读代码,10秒内用户能看到什么,并说明原因
#### 示例1
```html
<head>
    <link rel="stylesheet" href="xxx.css"> 加载耗费10s
</head>
<body>
    <p> 1 </p>
    <p> 2 </p>
</body>
```
#### 示例2
```html
<head>
</head>
<body>
    <p> 1 </p>
        <script src='xxx.js'></script> 加载耗费10s
    <p> 2 </p>
</body>
```

#### 示例3
```html
<head>
</head>
<body>
    <p> 1 </p>
        <script>
            ...code,执行了10s
        </script> 
    <p> 2 </p>
</body>
```

<comment/>
<tongji/>