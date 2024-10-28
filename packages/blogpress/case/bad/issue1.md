---
description: 工作中遇到了许多的 💩 代码，单独开个系列和大家分享&吐槽一下，一起品(xue)鉴(xi)一下。
cover: https://cdn.upyun.sugarat.top/mdImg/sugar/20d763d684bf6f1398f024c279dbbedb
---
# 迷惑代码赏析第1期

开发工作中遇到了许多的 💩⛰ 代码，这个系列里就大家分享&吐槽一下。

**同时也分享一下最近深度使用的专业编程显示器👨🏻‍💻👍🏻 🖥**

*攒够素材就更新下一期，有好的素材也欢迎投稿，推荐！*

## 1 random了寂寞
目的是将目标值和一个`[0,100)`的随机数比较，但结果一直是 `FAILED`。

让我们来看一下现在实现的代码 ↓：
```js
function can(compareTo) {
  return Number.parseInt(Math.random * 100) > compareTo
    ? Status.SUCCESS
    : Status.FAILED
}
```

💩 问题：`Math.random`，没有被调用，所以判断执行值始终是 `NaN`。

最终生效判断代码如下：
```js
function can(compareTo) {
  return NaN > compareTo
    ? Status.SUCCESS
    : Status.FAILED
}
```

`NaN` 与其它值进行 `><=` 运算都是 `false` 所以这里逻辑不符合预期。

**遇到这种💩，你觉得修还是不修！**

*一点补充：这段代码跑了好多年了，说明这个错误的执行结果符合现状。*

## 2 执行一次的定时器
使用定时器的场景很常见，比如延后执行一次逻辑：

但看到下面这种代码你说难受不难受？
```js
const timer = setTimeout(() => {
  clearTimeout(timer)
  console.log('exec once')
}, 1000)
```
💩问题: `setTimeout`，本身就只执行一次，所以这里的 `clearTimeout` 多余。

```js
const timer = setInterval(() => {
  clearInterval(timer)
  console.log('exec interval once')
}, 1000)
```

💩问题: `setInterval`，用于循环执行，这种执行一次的场景，建议使用 `setTimeout` 。

代码功能没问题，但对于有代码洁癖的来说，看着比较难受。

***很多仓库都有这个💩，不知道是谁带的头！***

## 3 非必要的 async

经常看到一些方法，内部就只是同步逻辑，但不知道是什么坏习惯性加了 `async`

这会导致返回内容始终为一个 `Promise`
```js
async function test() {
  return 'hello'
}
```  
调用的时候同步取值就需要 `await` ，同时方法本身也需要被迫添加 `async`！

💩 问题：容易破坏存量代码结构，甚至影响执行顺序。

下面就是同步和异步的执行结果区别

![](https://cdn.upyun.sugarat.top/mdImg/sugar/e983ba2d0f85779066d150c59dae1e7d)

*这种坑还是少一点好。*

## 4 非必要的判断
返回值是 `boolean` 的时候，通常可以简化掉相关的判断。

来看看 bad case：
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
💩 问题：判断条件执行结果本来就是 `boolean`，不需要再多此一举。

```js
function case() {
  return 判断条件
}
```
*我相信大部分同学都遇到过这种冗余的判断，如果是为了凑代码量，那我建议多写注释。*

## 5 冗余的else-if
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
💩 问题：重复浓度过高，一屏都是这种 `else-if` 

个人倾向这种场景做成配置化，便于拓展，不用频繁改代码。

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

*猜测写第一版的人可能只写了几个 `else-if` 然后后面修改的人就不断的 `CV`，才导致现在这样冗长。*

## 6 假同步执行

页面上有个功能时好时坏，让我们看看怎么回事 🤔。

看下代码的调用：

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
💩 问题: 异步方法返回内部没有等待内部逻辑执行完就提前结束了

时好时坏的原因就看网络情况，接口请求快就能拿到依赖的数据，慢就没数据。

正确写法是等待内部所有异步结束，或返回其执行结果，否则默认返回值是 `Promise.resolve(undefined)` 

```js
async function rightCode() {
  return request('/api')
}

async function rightCode() {
  await request('/api')
}
```

*这个问题一个项目里处理了好几次，不能说每次都粗心吧，**写的人真就是没认真学习！***

## 7 非预期的执行顺序

场景：有个接口返回结果常规的调用接口，返回结果为空时，根据 ok 值真假取不同的兜底值

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
💩 问题：不一样的原因是 `逻辑或 ||` 运算符优先级高于 `三元表达式` 

这种时候就建议不熟悉同学优先用`()` 处理执行的代码块

```js
const data = result || (ok ? obj1 : obj2)
```

## 8 v-for 不熟练

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
💩 问题：`v-for` 遍历数组本身提供了下标 `idx`。

```vue
<template>
  <ul>
    <li v-for="(item, idx) in list2" :key="idx" @click="handleDelete(idx)">
      {{ item.name }}
    </li>
  </ul>
</template>
```

*功能没问题，但是不优雅，知识学习没到位。*

![](https://cdn.upyun.sugarat.top/mdImg/sugar/7f597681e188caec1fe07b6e613fbdc3)

## 9 冗余重复代码

① 重复的字符串拼接
```js
const baseURL = {
  dev: location.protocol + '//' +  'domain1',
  test: location.protocol + '//' +  'domain2',
  st: location.protocol + '//' +  'domain3',
  prod: location.protocol + '//' +  'domain4',
  mock: location.protocol + '//' +  'domain5',
}

const host = baseURL[env]
```
💩 问题：书写有些冗余，有简化空间

```js
const baseURL = {
  dev: 'domain1',
  test: 'domain2',
  st: 'domain3',
  prod: 'domain4',
  mock: 'domain5',
}

const host = `${location.protocol}//${baseURL[env]}`
```

**最佳做法** 还是通过构建工具注入，这样避免代码中存在其它环境的值。
```js
const host = `${location.protocol}//${process.env.VUE_APP_DOMAIN}`
```

*为什么拉出来吐槽，因为这种代码是在单组件仓库中出现的，C端场景当页面引入几十个组件时候，就多了很多重复代码。*

② CSS 冗余写法
```css
.box {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
```

💩 问题：能简写的属性没有简写
```css
.box {
  margin: 10px;
}
```

*推荐**常用属性能简写的简写。***

## 10 手搓 getQuery

先看看“手搓”的代码。
```js
function getQuery() {
  const query = {}
  const href = window.location.href
  const searchArray = href.split('?')[1].split('&')
  searchArray.forEach(item => {
    const [key, value] = item.split('=')
    query[key] = value
  })
  return query
}
```
💩 问题：只考虑了有 Query 的情况，没有 Query 的时候调用就报错了

```js
href.split('?')[1].split
// Cannot read properties of undefined (reading 'split')
```

当然也有可优化点，location 提供了 search 属性可直接使用

```js
function getQuery() {
  const search = location.search
  if(!search){
    return {}
  }
  return search
    .slice(1)
    .split('&')
    .reduce((acc, cur) => {
      const [key, value] = cur.split('=')
      acc[key] = value
      return acc
    }, {})
}
```
事实上内置的 `URLSearchParams` 对象，可以直接解析 `Query`。

```js
function getQuery() {
  const searchParams = new URLSearchParams(location.search)
  return Object.fromEntries(
    searchParams.entries()
  )
}
```

*兼容性允许的情况下，优先推荐使用内置对象或方法实现功能*

---
屏幕看太久，眼睛容易累？下面分享一款 NB 的外设。

## 编码“物理外挂”

>*别急着划走🤭，后面还有内容 🙏🏻！*

近期深度使用了一款 **「程序员专用」** 显示器 [明基RD280U](https://www.benq.com.cn/zh-cn/monitor/programming/rd280u.html)，分享几个我觉得很棒的地方！

![https://www.benq.com.cn/zh-cn/monitor/programming/rd280u.html](https://cdn.upyun.sugarat.top/mdImg/sugar/77bcf23599a88aabd6ad0cea4512358d)

### IDE 编码显示优化

你能想象一个显示器居然针对编码的IDE，提供了专门的显示优化！

轻触 logo 即可切换 深色/亮色 模式。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/9abe73788bf0a2a877f9577680bda4ed)

对比一下其它显示器的显示效果！

|                                  三星S32A600N                                   |                                   明基RD280U                                    |
| :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
| ![](https://cdn.upyun.sugarat.top/mdImg/sugar/2202b497d8be58ac8585f38f9eb571c6) | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/e7e64a290a90eae405655f44029d2977) |

可以比较明显的看出后者在优化后展示效果更棒，同时屏幕抗环境灯光能力也更强，前者在室内过亮时有些许泛白反光。

使用下来也确实眼睛看着更加的舒服👍🏻！

### 超Nice的夜间模式
自带背光灯，同时屏幕亮度等显示效果都能随环境光线强弱进行自动调节适应！

关闭室内所有灯光，效果如下

|                                    显示效果                                     |                                     背光灯                                      |
| :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
| ![](https://cdn.upyun.sugarat.top/mdImg/sugar/0ac038f7486a564a3db7103124e6f875) | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/9bceb691862684a1a0c98cd450886315) |

[明基RD280U](https://www.benq.com.cn/zh-cn/monitor/programming/rd280u.html)在无环境光的时候，使用体验也非常不错👍🏻，眼睛不会有不适，屏幕不泛白。

### 休息提醒

|                                      设置                                       |
| :-----------------------------------------------------------------------------: |
| ![](https://cdn.upyun.sugarat.top/mdImg/sugar/167113c9a28811a8aed196d062e5237b) |

显示器自带的定时休息提示（屏幕右下角弹窗），👨🏻‍💻 日常大部分时间都在坐着，用这个提醒喝水&上厕所&站一站再好不过！

*比安装各种提醒软件省事多了！*

### 配套软件特色功能
显示器有一个配套的软件，除了完成硬件配置的功能外，还有一些增强！

|                                    配置窗口                                     |                                    桌面分区                                     |                                  自动任务&切换                                  |
| :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
| ![](https://cdn.upyun.sugarat.top/mdImg/sugar/11cf9e614cd591ba09a96586a802d586) | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/d96bc6738a5ff9bf51923488287aa44a) | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/842ae7e4dec81ba86224fb9ce96bd894) |


① 桌面分区

这个比较赞，Mac 系统本身应用分区功能比较弱，需要靠软件补齐这部分能力。


拖动窗口就能自动在鼠标唤起，选择目标分区，窗口就会自动贴合。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/2cd87ebcc064a0ed0a722001adae05af)

② 自动任务

可以设定不同的自动任务流程，不同的模式**一键打开设定的一系列应用，同时屏幕调成对应的预设状态**。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/0af07bcdb05cec9cd862a6b6b795e017)

*这个功能也是很 nice，一键切换工作/娱乐模式。关机的时候也可不用选择保留关机前的应用了。*

接下来咱继续“品鉴代码”

## 11 冗长的取值判断

场景：深层次嵌套，变量名很长的取值判断。

```js
function isOk(){
  return (
    testData && 
    testData.helloResult && 
    testData.helloResult.infoDetail && 
    testData.helloResult.infoDetail.type === 'test' &&
    testData.helloResult.infoDetail.status === 'ok'
  )
}
```

💩 问题：又臭又长的判断，看着比较难受

使用可选链后
```js
function isOk(){
  return (
    testData?.helloResult?.infoDetail?.type === 'test' &&
    testData?.helloResult?.infoDetail?.status === 'ok'
  )
}
```

*与时俱进的了解新语法还是很有必要*

## 12 莫名其妙的转换
直接看代码

判断有值的时候才做进一步处理
```js
const value = await fetchData()

if(value && String(value)){
  // 进一步处理
}
```
💩 问题：再加 `String` 转换后判断，不是画蛇添足吗？

*屏幕前的各位有遇到过没 🤦🏻‍♀️*

## 13 处处 for 循环

① 数量不够时补全数据
```js
const data = await fetchData()
const count = Math.max(data.length, MIN_COUNT)
for (let i = 0; i < count; i++) {
  if(!data[i]){
    data[i] = {
      id: randomId(),
      otherKey: 'default'
    }
  }
}
```

💩 问题：不管数量够不够都会存在无意义的遍历！

```js
const data = await fetchData()
const addedCount = MIN_COUNT - data.length
for(let i = 0; i < addedCount; i++){
  data.push({
    id: randomId(),
    otherKey: 'default'
  })
}
```
当然也可以使用更优雅的 `Array.from` 方法生成新数组的过程中完成数据填充
```js
const data = await fetchData()
if(data.length < MIN_COUNT){
  const addedData = Array.from({length: MIN_COUNT - data.length}, () => ({
    id: randomId(),
    otherKey: 'default'
  }))
  data.push(...addedData)
}
```

② 根据条件过滤数据
```js
const data = await fetchData()
const result = []
for (let i = 0; i < data.length; i++) {
  if(data[i].value>xx){
    result.push(data[i])
  }
}
```
💩 问题：过滤场景优先推荐使用 `filter` 方法

```js
const data = await fetchData()
const result = data.filter(item => item.value>xx)
```

③ 增加数据字段
```js
const data = await fetchData()
for (let i = 0; i < data.length; i++) {
  data[i].newField = getNewField(data[i])
}
```

💩 问题：这种场景建议使用 `map` 方法，也不会影响原数组

```js
const data = await fetchData()
const newData = data.map(item => ({
 ...item,
  newField: getNewField(item)
}))
```

*有些人真只会 `for` 基础循环一把羧！*

## 最后

*真心喜欢写代码的只占少数，草台班子过多🤦🏻‍♀️！*

![](https://cdn.upyun.sugarat.top/mdImg/sugar/9d193200054f61a2923779a361e047b8)