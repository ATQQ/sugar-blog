---
isTimeLine: true
title: 快手-最大的前端团队
date: 2020-10-23
tags:
 - 备战春秋
 - 2020秋招
categories:
 - 备战春秋
---
# 快手-最大的前端团队
## 终面
### 大文件上传
1. 大文件上传方案
2. 如何进行的分片上传
3. 如何判断数据(分片)传输完成
4. 如何做秒传
5. 如何做断点续传
6. 文件hash是如何做的

### 模板字符串
```js
var str = `
a
{{      obj.a   | filter |             filter2        }
b
{obj.b.c}
c
{obj.c.d}
`
var obj = {
    a:function(){},
    b:{c:{e:123}},
    c:{}
}
var g = {
    filter(str) {return 'aaa' + str },
    filter2(str) {return str + 'bbb'}
}
```
请写一个方法实现模板字符串的替换,要求如下
* 如果对应的键值不存在则不处理
* `|`后面跟着的是`filter`函数
* 如果结果是对象则进行`JSON.stringify()`
* 如果是函数则进行`toString`

最终期望结果
```js
// a
// {aaafunction () { }bbb
// b
// {"e":123}
// c
// {obj.c.d}
```
## HR面
>因为春招的时候有过沟通，就没有问什么刁钻的问题，就问了一些很平常的问题就结束了

