# instanceof能正确判断对象的原因是什么?
* 通过原型链进行判断的
* 每个对象都有一个原型,instanceof会沿着原型链进行判断,直到最顶层原型为止
* 可以通过``Symbol.hasInstance``重定义instanceof的行为,所以instanceof的结果不一定绝对正确