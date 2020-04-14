# 原始类型有哪些
* string
* number
* boolean
* null
* undefined
* Symbol
* Bigint(ES2020)

**性质**
* 原始类型都为值类型,没有函数可以调用
* string类型不可变,无论自身调用什么方法,不会改变自身
* numnber是浮点类型 0.1+0.2!==0.3
  * 因为JavaScript使用IEEE浮点类型双精度。转换为二进制在计算但是小数无限延伸，二进制截取53位导致精度丢失。
  * Number.EPSILON的精度是2^-52，所以只要丢失精度小于Number.EPSILON基本可以确认相等。

```js
function compareNum(num1,num2){
    return Math.abs(num1-num2)<Number.EPSILON
}
console.log(compareNum(0.1+0.2,0.3)) // true
```
