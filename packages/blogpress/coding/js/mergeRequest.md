---
sidebar:
 title: 中等-请求合并
 step: 13
title: 场景题-请求合并
date: 2021-03-06
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 场景题-请求合并
> 面试中常考的一个代码题,也是业务开发中经常会遇到的问题

## 题目描述
短时间内需要请求多个同类型的资源

期望多个请求合并成一个请求发送

例如:
* 有一个接口其请求路径为 /path
* query有一个id参数支持传一个或者多个id
  * `/path?id=1`
  * `/path?id=1,2,3`
* 对应的响应格式为
```js
{
    code:0,
    data:{
        1:{},
    },
    errMsg:'success'
}
// or
{
    code:0,
    data:{
        1:{},
        2:{},
        3:{}
    },
    errMsg:'success'
}
```

`request` 方法示例
```js
request({
    url:'/path',
    query:{
        id: '0'
    }
})
```
### 要求
实现一个 `getArticle` 方法,每个方法回调最终拿到的是自己需要的内容,且**短时间内**只发出了一次请求
```js
getArticle(3).then(res=>{})
getArticle(4).then(res=>{})
getArticle(5).then(res=>{})
getArticle(6).then(res=>{})

// request({
//     url:'/path',
//     query:{
//         id:'3,4,5,6'
//     }
// })
```

## 题目分析
### 场景分析
常见需要短时间请求多个同类型资源的场景就是**资源懒加载**的时候
* 如:一个文章列表的中,获取每个展示文章点赞/评论数是单独的一个接口
* 当一次性需要展示多条新闻,那么就要发起多个查询点赞/评论的请求

后端为了减少处理请求的压力,通常会让一个接口支持同时查询多条数据的能力

### 考点
1. 怎么确定这个**短时间**是多久?
   * 其实这里就是考察到了**event loop**,这个短时间就是指同一个周期内,然后就变成了**合并同一个周期内的请求**,如何保证在一个周期内,这里就可以用到**防抖**,让请求在执行宏任务的时候发出
2. 如何让每个方法拿到自己需要的数据?
   * 这里可以在方法内部用一个map将每个方法的Promise的resolve存起来,每个方法传参的id作为key,在接口响应后,将对应数据通过key取出,然后从map中取出对应Promise的resolve然后执行`resolve(data[id])`即可

### 需要考虑的问题
1. 如果多个请求参数是一样的那么,最终请求的参数只有一个
   * 如 连续调用两次 `getArticle(3)`
   * 那么 请求的query依旧是 `{id:'3'}`而不是 `{id:'3,3'}`
   * 并且这两个请求的方法都需要得到响应
2. 如果这个请求没有被按时响应,不能影响下一次发送


## 代码实现
```js
var getArticle = (function () {
    let timer = null;
    let resolveMap = new Map();
    return function (id) {
        return new Promise((resolve) => {
            // 这里用string类型作为key
            const key = `${id}`;
            const resolves = resolveMap.get(key);

            // 不存在则创建,因为可能有重复的id,所以这里value为数组
            if (!resolves) {
                resolveMap.set(key, [resolve]);
            } else {
                // 存在则加入,因为是对象,map里存的引用,所以这里不需要重新执行set
                resolves.push(resolve)
            }

            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                // 这里将把请求发出去,需要重置状态
                // 所以将现有的保存下来
                const _resolvesMap = resolveMap

                const keys = [..._resolvesMap.keys()]
                request({
                    url: '/path',
                    query: keys.join(',')
                }).then(res => {
                    const { data } = res
                    // 执行resolve
                    for (const key of keys) {
                        const resolves = _resolvesMap.get(key)
                        const v = data[key]
                        resolves.forEach(r => r(v))
                    }
                })


                // 请求发出后就初始化,以便用于下次请求
                timer = null;
                resolveMap = new Map();
            })
        });
    };
})();
```

## 测试
模拟实现一个`request`
```js
function request(options = {}) {
    console.log(new Date(), '发起一次请求', '-------参数为:', options.query)
    return new Promise(res => {
        const { query } = options
        if (!query) {
            res({ data: {} })
            return
        }

        const ids = query.split(',')
        const testData = ids.reduce((pre, id) => {
            pre[id] = {
                id,
                rand: Math.random()
            }
            return pre
        }, {})

        // 模拟响应延迟
        setTimeout(() => {
            res({
                code: 0,
                data: testData,
                errMsg: 'ok'
            })
        }, 500)
    })
}
```

测试用例
```js
getArticle(1).then(console.log)
getArticle(3).then(console.log)
getArticle(2).then(console.log)
getArticle(2).then(console.log)
getArticle(1).then(console.log)

new Promise((res) => {
    getArticle(4).then(console.log)
    res()
})

setTimeout(() => {
    getArticle(1).then(console.log)
    getArticle(3).then(console.log)
    getArticle(2).then(console.log)
    getArticle(2).then(console.log)
    getArticle(1).then(console.log)
}, 400)
```

打印结果

![图片](https://img.cdn.sugarat.top/mdImg/MTYxNTAxNjc1ODk0Mw==615016758943)

## 总结
1. 考察知识点 **event loop**,**防抖**,**Promise**
2. 这是一个很常见的业务问题,考察面试者的动手实践能力

>代码仅供参考,如有考虑不周之处,还请斧正


