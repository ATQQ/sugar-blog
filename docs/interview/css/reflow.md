# 回流与重绘

## 浏览器的渲染过程
1. 解析HTML-->DOM树,解析CSS-->CSSOM树
2. DOM树 + CSSOM树 --> Render Tree(渲染树)
3. ``回流``(Layout):根据生成的渲染树,回流得到节点的几何信息(位置,尺寸)
4. ``重绘``(Painting):根据渲染树与回流得到的几点几何信息,得到节点的绝对像素
5. 将像素发送给``GPU``绘制,然后展示在页面上

## 生成渲染树过程
1. 从DOM根节点开始遍历每个可见的节点
   * 不可见节点:
      * 不能渲染输出的节点:link,script,meta等等
      * 使用css隐藏的节点:display:none; 
2. 对于每个节点在CSSOM树中找到对应的规则并应用
3. 根据每个可见节点与其对应的css样式,组合生产渲染树

## 回流
计算可见的Dom节点在设备视口的位置和尺寸,这个计算阶段就是回流

为了知道每个可见节点在视口的确切大小和位置,浏览器从渲染树的根节点进行遍历

## 重绘
经过生成的渲染树和回流阶段,得到了所有可见节点具体的几何信息与样式,然后将渲染树的每个节点转换成屏幕上的实际像素,这个阶段就叫``重绘``节点

## 回流与重绘何时发生?
### 回流
* 页面第一次加载时
* 浏览器窗口尺寸变化
* 页面布局发生变化
  * 添加/删除可见元素
* 节点几何信息发生变化
  * 元素的位置发生变化
  * 元素的尺寸(外/内边框,外边距,高/宽)
  * 内容发生变化
    * 文本
    * 图片(被另一尺寸图片替换)
  
### 重绘
* 回流一定触发重绘
* 可见节点样式发生改变

:::tip
回流一定触发重绘,重绘不一定触发回流
:::

## 减少回流与重绘
### 最小化重绘与重排
1. 减少发生次数:合并多次修改
```js
const e = document.querySelector('#test')
e.style.color = 'white'
e.style.fontSize = '18px'
```
* cssText
    ```js
    const e = document.querySelector('#test')
    e.style.cssText += 'color:white;font-size:18px;'
    ```
* class
    ```js
    const e = document.querySelector('#test')
    el.className +='active'
    ```

### 批量修改DOM
需要对dom进行一系列修改时候,减少回流重绘次数方案
1. 使元素脱离文档流
2. 进行修改
3. 将元素放回源文档中

脱离文档流的方式
* 隐藏元素
* 使用``DocumentFragment``构建一个子树,然后拷贝会源文档(``document.createDocumentFragment()``)
* 拷贝元素到脱离文档流的节点中,修改节点后,在替换原来的节点
* 绝对定位
* 浮动
* 固定定位

:::tip 参考
[你真的了解回流和重绘吗?](https://github.com/chenjigeng/blog/blob/master/%E4%BD%A0%E7%9C%9F%E7%9A%84%E4%BA%86%E8%A7%A3%E5%9B%9E%E6%B5%81%E5%92%8C%E9%87%8D%E7%BB%98%E5%90%97.md)
:::