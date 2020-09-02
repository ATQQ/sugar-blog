# 腾讯视频二面

## 算法与数据结构
### 1.二叉树的深度优先(DFS)与广度优先(BFS)遍历分别使用什么数据结构?如何实现?
* DFS:栈
* BFS:队列
```js
// DFS
function dfs(root){
    let stack = []
    if(!root){
        stack.push(root)
    }
    while(stack.length!==0){
        let node = stack.pop()
        console.log(node.value)
        if(node.right){
            stack.push(node.right)
        }
        if(node.left){
            stack.push(node.left)
        }
    }
}
// BFS
function bfs(root){
    let queue = []
    if(!root){
        queue.push(root)
    }
    while(queue.length!==0){
        let node = queue.shift()
        console.log(node.value)
        if(node.left){
            stack.push(node.left)
        }
        if(node.right){
            stack.push(node.right)
        }
    }
}
```
### 2.哈希表冲突处理规则?
* 线性探测再散列:冲突后存储在冲突后一个位置，如果仍然冲突继续向后
* 链地址法:产生hash冲突后在存储数据后面加一个指针，指向后面冲突的数据
![图片](http://img.cdn.sugarat.top/mdImg/MTU4NTEyNjUyNjM5OQ==585126526399)

### 3.统计一篇英文文章中出现次数最多的N个单词?(提示使用某种数据结构)
1. 暴力解法排序:使用map统计后排序,O(NlogN)
2. 使用局部排序(冒泡):
```js
function swap(array, left, right) {
  let t = array[left]
  array[left] = array[right]
  array[right] = t;
}

function topK(arr, k) {
  for (let i = 0; i < k; i++) {
    for (let j = arr.length - 1; j > i; j--) {
      if (arr[j].count > arr[j - 1].count) {
        swap(arr, j, j - 1)
      }
    }
  }
  return arr.slice(0, k);
}
// 统计
let testStr = 'Hello1 World2 Hello1 World3 Hello1 World1 Hello2 World2 Hello3 World3'
let wordsMap = {}
testStr.split(' ').forEach(v => {
  if (wordsMap[v]) {
    wordsMap[v]++
  } else {
    wordsMap[v] = 1
  }
})

// 转为数组
let wordsArr = Object.keys(wordsMap).map(v => {
  return {
    value: v,
    count: wordsMap[v]
  }
})

// 输出结果
topK(wordsArr, 3).forEach(v => console.log(v.value))
```
### 4.给你root1和root2两颗二叉搜索树,请你返回一个列表,其中包含两课树中所有整数并按升序排序。
### 5.快排的时间复杂度?最坏是什么情况?最好是什么情况?

## js
### 1.跨域的原因是什么?你有哪些方案可以解决?
### 2.Cookie,sessionStorage/localStorage之间有什么区别?
### 3.浏览器中打开多个标签(同一个地址),标签之间有哪些本地通信方案?
### 3.简单介绍一下闭包,他有什么作用?
### 4.[浏览器的全局属性有哪些](https://www.cnblogs.com/xiaohuochai/p/5033039.html)?
### 5.常用操作dom方法有哪些?
### 6.事件代理你了解吗?原理是什么?

## html/css
### 1.指定样式的方法有哪些?
### 2.样式优先级计算策略?
### 3.你知道的[默认内联样式](https://www.cnblogs.com/l-hf/p/11542150.html)的标签有哪些?
### 4.display有哪些属性?
### 5.display:none;与visible:hidden有什么区别

## 浏览器安全
### 1.什么是CSRF?一般是如何伪造CSRF的?如何预防?

## 性能优化
### 1.如何加快首屏渲染?你有哪些方案?
### 2.操作dom应注意什么?有什么优化方案?

## 网络
### 1.浏览器输入url到页面渲染发生了什么?
### 2.在浏览器中http有请求数量限制吗?它的策略是怎样的?
### 3.http与https有什么区别?
### 4.https是如何保证数据安全的?
### 5.Http2是如何消除队头阻塞的?
### 6.TLS协议如何工作的?

## 数据库
### 1.你了解哪些数据库?
### 2.mysql中如何更改表的结构?
### 3.你使用redis的场景是什么?

## 非技术性问题
### 1.你是如何学习前端的?
### 2.你对未来有什么规划?
### 3.有考研的打算吗?为什么不考研?

<comment/>
<tongji/>