# 迷惑代码赏析第1期

工作中遇到了许多的 💩，单独开个系列和大家分享&吐槽一下。

*不定期更新，有好的素材也欢迎投稿，推荐！*

## 1 随机了寂寞
方法的作用是将目标值和一个`[0,100)`的随机数比较，但结果一直是 `FAILED`。

```js
const Status = {
  SUCCESS: 0,
  FAILED: 1,
}

function can(compareTo) {
  return Number.parseInt(Math.random * 100) > compareTo
    ? Status.SUCCESS
    : Status.FAILED
}
```

问题就在 `Math.random` 上，没有被调用，所以前面执行值是 NaN。

最终生效判断代码如下：
```js
function can(compareTo) {
  return NaN > compareTo
    ? Status.SUCCESS
    : Status.FAILED
}
```

`NaN` 与其它值进行 `><=` 运算都是 `false` 所以这里逻辑不符合预期。

*这段代码跑了好多年了，说明这个错误的执行结果符合现状。*

遇到这种💩，你觉得修还是不修！

## 2 执行一次的定时器
使用定时器的场景很常见，比如延后执行一次逻辑：

但看到下面这种代码你说难受不难受？
```js
const timer = setTimeout(() => {
  clearTimeout(timer)
  console.log('exec once')
}, 1000)
```

```js
const timer = setInterval(() => {
  clearInterval(timer)
  console.log('exec interval once')
}, 1000)
```

代码本身功能没问题，但对于有代码洁癖的来说，看着就很难受。

*很多仓库都有这个💩，不知道是谁带的头！*

## 3 不必要的async

经常看到一些方法，内部就只是同步逻辑，都就是习惯性的加了 `async`

会导致返回内容始终为一个 Promise
```js
async function test() {
  return 'hello'
}
```  
调用的时候同步取值就需要 `await` ,同时方法本身也需要被迫添加 `async`.

*这种代码还是少一点好，容易破坏存量代码结构，甚至影响执行顺序。*

下面就是同步和异步的执行结果区别

![](https://cdn.upyun.sugarat.top/mdImg/sugar/e983ba2d0f85779066d150c59dae1e7d)

## 4 不必要的判断
返回值是 `boolean` 的时候，通常可以简化掉相关的判断。

```js
function case1() {
  if (xx) {
    return true
  }
  return false
}

function case2() {
  return xx ? true : false
}
```

*我相信大部分同学都遇到过这种冗余的判断，直接返回判断条件就好了。*

## 5 冗余的if-else
一个取配置的场景：从不同的配置对象中取出同一意义的值

```js
function getConfigValue(type, cfg) {
  if (type === 'xxx') {
    return cfg.id
  }
  else if (type === 'yyy') {
    return cfg.key
  }
  else if (type === 'zzz') {
    return cfg.secret
  }
  // 此处省略数十个判断。。。
}
```
个人倾向这种场景做成配置化,便于拓展,不用频繁改代码。

```js
const config = {
  xxx: 'id',
  yyy: 'key',
  zzz: 'secret',
}

function getConfigValue(type, cfg) {
  return cfg[config[type]]
}
```

*纯粹吐槽一下，可能之前的人写了一个 `if` 然后就不断的 `CV`。*

## 6 假同步执行

遇到用户反馈，说页面上有个功能时好时坏。

让我们看下一这个代码的调用

```js
async function mounted() {
  await getProductList()
  await getUserInfo()
  await getUserTags()
  // 此处省略其它处理代码
}

mounted()
```

*大家不妨先按经验推测一下，可能原因，为什么一段代码功能会时好时坏？*

下面揭晓一下
```js
const data = {}

async function getProductList() {
  request('productList').then((res) => {
    data.list = res
  })
}

function getUserInfo() {
  return userSdk.getUserInfo()
}

async function getUserTags() {
  request('userTags', {
    ids: data.list.map(item => item.id)
  }).then((res) => {})
}
```

导致时好时坏的原因就看网络情况，接口请求快就能拿到依赖的数据，慢就没数据。

*我只能是无语看到这种。*

正确写法是将请求的 `promise` 返回，否则默认返回值是 `Promise.resolve(undefined)` 

```js
async function rightCode() {
  return request('/api')
}
```

## 7 非预期的执行顺序

常规的调用接口，返回结果为空时，根据 ok 值真假取不同的兜底值

```js
const { result, ok } = await fetchData()
const data = result || ok ? obj1 : obj2
```
*如果你看不出问题在哪里，咱们看一下下面的运行结果是什么？*

```js
// 期望返回 1
const value1 = 1 || 2 ? 3 : 4

// 实际返回 3
```
不一样的原因是 `逻辑或 ||` 运算符优先级高于 `三元表达式` 

这种时候就建议不熟悉同学优先用`()`

```js
const data = result || (ok ? obj1 : obj2)
```

## 8 v-for 业务不熟练

① 移除列表元素
```vue
<script setup>
function handleDelete(item) {
  list1.splice(list1.findIndex(item => item.id === id), 1)
}
</script>

<template>
  <ul>
    <li v-for="item in list1" :key="item.id" @click="handleDelete(item)">
      {{ item.name }}
    </li>
  </ul>
</template>
```

② 列表渲染添加默认 key

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  const data = await getData()
  for (let i = 0; i < data.length; i++) {
    list2.push({ ...data[i], id: i })
  }
})
</script>

<template>
  <ul>
    <li v-for="item in list2" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>
```
代码功能没问题，但是不优雅，`v-for` 遍历数组本身提供了下标 `idx`。

```vue
<template>
  <ul>
    <li v-for="(item, idx) in list2" :key="idx" @click="handleDelete(idx)">
      {{ item.name }}
    </li>
  </ul>
</template>
```

得到的回应是从来没见过带 `idx` 的写法。

*拉出来在这里吐槽一下同学学习知识内容不到位。*