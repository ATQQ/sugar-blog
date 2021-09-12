# 优雅的处理挂载window上的函数可能不存在的情况

## 背景
在做一个JS SDK（A）时，内部会用到另一个JS SDK（B）的方法。（文中后续用A/B代替两者）

B通常会提供Script和NPM包两种使用方式

**如果使用NPM引入的方式。**
* 优点：省事，稳定
* 缺点：增加包体积，如果这个SDK被Web应用已经引入过页面，那么理论上可直接使用，不必要再整一个

```ts
/**
 * 处理window上的XX方法可能不存在的情况
 * @param key window[key] 要判断的属性
 * @param value window[key] = value 属性不存在时的取值
 * @param options 可选配置项
 * @returns
 */
export function patchWindowFun(
  key: string,
  value: string | Function,
  options?: {
    afterScriptLoad?: Function
    beforeAppendScript?: Function
    alreadyExistCB?: Function
    async?: boolean
    defer?: boolean
  },
) {
  // 存在不处理
  const { alreadyExistCB, afterScriptLoad, beforeAppendScript, defer, async } = options || {}

  if (window[key]) {
    alreadyExistCB && alreadyExistCB()
    console.log(key, 'already exist')
    return
  }

  // 函数直接赋值
  if (typeof value === 'function') {
    window[key] = value
    return
  }

  // script url
  if (typeof value === 'string') {
    let params = []
    window[key] = function () {
      params.push(arguments)
    }

    const script = document.createElement('script')
    script.src = value
    script.async = !!defer
    script.defer = !!async
    script.onload = function () {
      afterScriptLoad && afterScriptLoad()
      // 处理原来没处理的
      params.forEach(param => {
        window[key].apply(this, param)
      })
    }
    beforeAppendScript && beforeAppendScript()
    document.body.append(script)
  }
}
```