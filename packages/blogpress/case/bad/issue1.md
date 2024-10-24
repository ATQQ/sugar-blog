# 迷惑代码赏析第1期
[[toc]]
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

*我相信大部分同学都遇到过这种冗余的判断。*

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

## 6 假同步执行

遇到一个用户反馈，说页面上有个功能时好时坏。

*大家不妨按经验推测一下，可能得原因是什么，代码并没有变，为什么功能会突然失效？*

让我们看下一这个代码

```js
//
```