# BFC

BFC规范(块级格式化上下文：block formatting context)

规定了内部的Block Box如何布局
* 内部的Box会在垂直方向上一个接一个放置
* Box垂直方向的距离由margin决定
* 每个元素的margin box 的左边，与包含块border box的左边相接触
* BFC的区域不会与float box重叠
* 属于同一个BFC的两个相邻Box的margin会发生重叠
* 计算BFC的高度时，浮动元素也会参与计算
* 隔离的独立容器，容器里面的子元素不会影响到外面的元素

**触发BFC条件**
* 根元素:html
* float值不为``none``
* overflow**不为**``visible``
* display的值**为**inline-block、table-cell、table-caption
* position的值为absolute或fixed