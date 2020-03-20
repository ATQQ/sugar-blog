# 原始类型有哪几种？null 是对象嘛？

**原始类型**:值类型,没有函数可以调用
* string:无论自身调用什么方法,不会改变自身
* number
* boolean
* null
* undefined
* Symbol

null不是对象

**typeof null === 'object' ?**
>这是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object