---
isTimeLine: true
title: 类型转换
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 类型转换

**文中的值类型等价于所说的基础类型，其范围是（boolean,string,number）**
## 转换为基础类型
### 布尔值
* `undefined`， `null`， `false`， `NaN`，`''`， `0` --> <font color="red">false</font>
* 其它值都,包括所有对象 --> <font color="#3eaf7c">true</font>

### 数字
* 数组
  * `[]` --> <font color="#3eaf7c">0</font>:    空数组转为0
  * `[1]` --> <font color="#3eaf7c">1</font>:   含有一个元素且为数字则转换为数字
  * `[1,2]` --> <font color="red">NaN</font>:   其余情况转为NaN
  * `['abc',1]` --> <font color="red">NaN</font>:   其余情况转为NaN
* 值类型
  * `null` --> <font color="#3eaf7c">0</font>
  * `'123'` --> <font color="#3eaf7c">123</font>:   纯数字构成的字符串直接转换为对应的数字
  * `true` --> <font color="#3eaf7c">1</font>
  * `false` --> <font color="#3eaf7c">0</font>
  * `'124a'` --> <font color="red">NaN</font> 
  * `undefined` --> <font color="red">NaN</font> 
  * `Symbol` --> <font color="orange">**抛出错误**</font> 
* 除了数组之外的引用类型(`Object`) --> <font color="red">NaN</font>
### 字符串
* `666` --> <font color="#3eaf7c">'666'</font>: 数字可直接转为字符串
* 布尔值：布尔值直接转换
  * `true` --> <font color="#3eaf7c">'true'</font> 
  * `false` --> <font color="#3eaf7c">'false'</font> 
* 数组
  * `[]` --> <font color="#3eaf7c">''</font> ：空数组转为空串
  * `[2,'3']` --> <font color="#3eaf7c">'2,3'</font> ：非空数组的每一项转为字符串再用`,`分割
* 对象:
  * {} --> <font color="red">[object Object]</font> 
  * {a:1} --> <font color="red">[object Object]</font> 

## 对象转基础类型规则
对象在转换类型的时候，会调用内置的 [[ToPrimitive]] 函数，对于该函数来说，算法逻辑一般来说如下：

1. 如果已经是基础类型了，那就不需要转换了
2. 目标类型**为字符串**就先调用 toString
   * 转换为基础类型的话就返回转换的值
3. 目标类型**不为字符串**就先调用 valueOf
   * 结果为基础类型，就返回转换的值
   * 结果不是基础类型的话再调用 toString
4. 如果都没有返回基础类型，就会报错

各种情况举例
```js
const demo1 = {
    [Symbol.toPrimitive]: function () {
        return 2
    }
}
// 情况1
console.log(demo1 + 1); // 3

const demo2 = {
    toString() {
        return 'demo2'
    },
    valueOf() {
        return 20
    }
}
// 情况2
console.log(String(demo2)) // demo2

// 情况3-1
console.log(demo2 - 3); // 17

const demo3 = {
    toString() {
        return 30
    },
    valueOf() {
        return {}
    }
}
// 情况3-2
console.log(demo3 - 4); // 26

const demo4 = {
    toString() {
        return {}
    },
    valueOf() {
        return {}
    }
}
// 情况4
console.log(demo4 + 1); // 报错
```

## 四则运算符
### 加法

* 有一方为`String`，那么另一方也会被转为`String`
* 一方为`Number`,另一方为原始值类型，则将原始值类型转换为`Number`
* 一方为`Number`,另一方为引用类型，双方都转为`String`

### 其它

除了加法的运算符来说（-，*，/），会将非Number类型转换为Number类型

转换示例
```js
'123'+4 // '1234'

123+true // 124
123+undefined // NaN
123+null // 123

123+[] //  '123'
123+{} // '123[object Object]'
```

## 比较运算符
==
1. `NaN`不等于任何其它类型
2. `Boolean` 与其它类型进行比较,`Boolean`转换为`Number`
3. `String` 与 `Number`进行比较,`String` 转化为`Number`
4. `null` 与 `undefinde`进行比较结果为<font color="#3eaf7c">true</font> 
5. `null`,`undefined`与其它任何类型进行比较结果都为<font color="red">false</font> 
6. `引用类型`与`值类型`进行比较,引用类型先转换为`值类型`(调用[ToPrimitive])
7. `引用类型`与`引用类型`，直接判断是否指向同一对象

![图片](https://img.cdn.sugarat.top/mdImg/MTU5OTQ2OTY5MzkzMQ==599469693931)

举例
```js
[]==![] // true
// [] == false  1. 根据运算符优先级 ![] --> false
// [] == 0      2. 上面规则2
// '' == 0      3. 上面规则6
//  0 == 0      4. 上面规则3
// 所以结果为true
```

## 自测
```js
if ([]) console.log(1);             // 1 -- 对象始终为true
if ({}) console.log(2);             // 2 -- 对象始终为true
if ([] == false) console.log(3);    // 3 -- [] == 0 --> '' == 0 --> 0 == 0
if ({} == false) console.log(4);    //   -- {} == 0 --> '[object Object]' == 0  --> NaN == 0 --> NaN不等于任何值
if ([] == ![]) console.log(5);      // 5 -- [] == false --> 同3
if ({} == !{}) console.log(6);      //   -- {} == false --> 同4
if ('' == false) console.log(7);    // 7 -- '' == 0 --> 0 == 0
if (false == 0) console.log(8);     // 8 -- 0 == 0
if (1 == true) console.log(9);      // 9 -- 1 == 1
if ('' == 0) console.log(10);       // 10 -- 0 == 0
if (NaN == NaN) console.log(11);    //    -- NaN不等于任何值
if ([] == !true) console.log(12);   // 12 -- [] == false --> [] == 0 --> '' == 0 ->> 0 == 0
if ([] == false) console.log(13);   // 13 -- 同12 的步骤
if ([] == 0) console.log(14);       // 14 -- '' == 0 --> 0 == 0
if (+0 == -0) console.log(15);      // 15
if (NaN == false) console.log(16);  //    -- NaN不等于任何值
```

```js
{ } +1              // 1 {} 被解析为是代码块
1 + {}              // '1[object Object]' -- 1 + ’[object Object]‘ --> '1' + [object Object]
[] + 1              // '1' -- '' + 1 --> '' + '1'
1 + []              // '1' -- 1 + '' --> '1' + ''
[1, 2, 3] + 0       // '1,2,30' -- '1,2,3' + 0 --> '1,2,3' + '0'
[1, 2, 3] + '0'     // 同上
1 + '0'             // '10' --  '1' + '0'
1 + 0               // 1
1 + true            // 2 -- 1 + 1
1 + false           // 1 -- 1 + 0
'1' + true          // '1true' -- '1' + 'true'
'1' + false         // '1false' -- '1' + 'false'
![] + []            // 'false' -- false + [] --> false + '' --> 'false' + ''
1 - true            // 0 -- 1 - 1
'0' - 0             // 0 -- 0 - 0
0 - '1'             // -1 -- 0 - 1
false - true        // -1 -- 0 - 1
{ } -[]             // -0 -- -0
[] - {}             // NaN -- '' - [object Object] --> 0 - NaN
false - []          // 0 -- 0 - '' --> 0 - 0
```

:::tip 参考

[思否-前端碎碎念 之 为什么[] == ![] ?](https://segmentfault.com/a/1190000008594792)

[freeCodeCamp-Javascript 隐式类型转换，一篇就够了](https://chinese.freecodecamp.org/news/javascript-implicit-type-conversion/)
:::
<comment/>
<tongji/>