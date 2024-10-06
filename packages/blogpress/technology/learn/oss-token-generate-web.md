---
description: 使用 Web Crypto API，btoa，spark-md5（第三方库），在前端中生成 OSS 上传令牌，支持七牛云，又拍云
outline: [2,4]
tag: 技术笔记
---

# 浏览器中生成 OSS 令牌 | Web Crypto API

笔者写文章的时候，都会把图片通过自己搭建的一个简单站点 [https://imgbed.sugarat.top/](https://imgbed.sugarat.top/) 把图片上传到各种云的对象存储服务（OSS）上。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/bb46127e4d9ac97e565a00b7fd4cffe4)

然后通过CDN访问，保证图片有可靠的访问速度和质量。

本着尽可能简单，减少对后端依赖的原则，上传令牌是在本地（Node.js）生成并设置一个过期时间，在浏览器中直接粘贴，存放在 LocalStorage 中，过期就在本地重新生成一次就行。

但现在生成的时候也还有2个麻烦点：① 依赖 Node.js 环境 ② 关键的秘钥存储在本地文件中

本次迭代就是把这2个麻烦点解决掉！

## 生成原理
### 又拍云
>参考文档：[token 认证生成](https://docs.upyun.com/api/authorization/#token_2)

![](https://cdn.upyun.sugarat.top/mdImg/sugar/f3044eae178aaf7dbe23534ed74afcfd)

简化成 JS 代码如下
```js
// 基本配置
const operator = '账号'
const password = '密码'
const method = 'PUT' // 上传时用到的请求方法
const urlPrefix = 'bucketName/sourcePrefix' // 资源在OSS上的桶名称和公共路径前缀
const expire = Math.floor(Date.now() / 1000) + 3600 // 过期时间 1小时后过期

// 计算token
const token = base64(hmacSha1(MD5(password), `${method}&${urlPrefix}&${expire}`))

// 最终上传用到的请求头
const Authorization = `UPYUN ${operator}:${token}`
```

依赖的算法
* base64：将数据转换为 ASCII 字符串的编码
* HMAC_SHA-1：基于 SHA-1 哈希算法的消息认证码，用于验证消息的完整性和真实性
* MD5：哈希函数，用于生成数据的数字指纹

### 七牛云
>参考文档：[上传凭证](https://developer.qiniu.com/kodo/1208/upload-token)，[URL安全的Base64编码](https://developer.qiniu.com/kodo/1231/appendix#urlsafe-base64)

![](https://cdn.upyun.sugarat.top/mdImg/sugar/292fe7579ff8268583ab9828e3cc0b57)

简化成 JS 代码如下
```js
// 基本配置
const accessKey = 'ACCESS_KEY'
const secretKey = 'SECRET_KEY'
const bucket = 'BUCKET_NAME' // OSS 桶名称
const expires = Math.floor(Date.now() / 1000) + 3600 // 过期时间 1小时后过期

const encodedFlags = base64ToUrlSafe(base64(JSON.stringify({
  scope: bucket,
  deadline: expires,
})))
const encodedSign = base64ToUrlSafe(base64(hmacSha1(secretKey, encodedFlags)))

// 最终上传用到的令牌
const uploadToken = `${accessKey}:${encodedSign}:${encodedFlags}`
```

其中 `base64ToUrlSafe` 是 “URL安全的Base64编码” 相关的方法

>URL安全的Base64编码适用于以URL方式传递Base64编码结果的场景。该编码方式的基本过程是先将内容以Base64格式编码为字符串，然后检查该结果字符串，将字符串中的加号`+`换成中划线`-`，并且将斜杠`/`换成下划线`_`。

```ts
// 实现如下
function base64ToUrlSafe(v: string) {
  return v.replace(/\//g, '_').replace(/\+/g, '-')
}
```

其它依赖算法和又拍云基本一致 `hmacSha1` 和 `base64`。

## 加密方法的实现
这里分别介绍浏览器和 Node.js 环境下的简单实现。

### 前端浏览器侧实现
base64 和 HMAC_SHA-1 算法都有现成的实现，分别可以使用浏览器提供的 [btoa](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/btoa) 和 [Crypto](https://developer.mozilla.org/zh-CN/docs/Web/API/Crypto) API。

```ts
function base64(value: string) {
  return btoa(value)
}
```

#### HMAC_SHA-1

在阅读 [MDN: Crypto API](https://developer.mozilla.org/zh-CN/docs/Web/API/Crypto) 文档时先可以看到 [Crypto.subtle](https://developer.mozilla.org/zh-CN/docs/Web/API/Crypto/subtle) 的描述。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/b008d315a51e56ad94fd2cbc7ef97cae)

从字面意思不难看出就是我们需要的API。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/ae7795f430003984deb7d20245a2c50b)

![](https://cdn.upyun.sugarat.top/mdImg/sugar/a5b2a5c91885780dbe0ec537db2abd96)

从 `HMAC` 的例子中，就可以找到我们需要的关键信息：

![](https://cdn.upyun.sugarat.top/mdImg/sugar/f62dbfd450a64f8ec8beb1032c542fe6)

关键代码如下
```ts
const encoder = new TextEncoder()
const encoded = encoder.encode(value)
const signature = await window.crypto.subtle.sign('HMAC', key, encoded)
```

其中 `key` 是我们需要的密钥，可以用 [SubtleCrypto.importKey()](https://developer.mozilla.org/zh-CN/docs/Web/API/SubtleCrypto/importKey#%E8%AF%AD%E6%B3%95) 导入生成。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/f7d5989e3ce45fdf7ea0c2d9bb37f61b)

```ts
const encoder = new TextEncoder()
const key = await window.crypto.subtle.importKey(
  'raw',
  encoder.encode(password), // password 是我们的密钥
  { name: 'HMAC', hash: { name: 'SHA-1' } },
  false,
  ['sign'],
)
```

最终我们的方法实现如下。

```ts
async function hmacSha1(key: string, value: string) {
  const encoder = new TextEncoder()

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: { name: 'SHA-1' } },
    false,
    ['sign'],
  )

  const data = encoder.encode(value)
  const hashBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, data)

  return arrayBufferToBase64(hashBuffer) // 返回 base64 格式的结果
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer)
  const base64String = String.fromCharCode(...uint8Array)
  return btoa(base64String)
}
```
#### MD5
MD5 可以使用 开源库 [spark-md5](https://www.npmjs.com/package/spark-md5)

```ts
import SparkMD5 from 'spark-md5'

export function MD5(str: string): string {
  return SparkMD5.hash(str)
}
```
### Node.js 实现
Node.js 环境下，可以直接使用内置 [node:crypto](https://nodejs.cn/api/crypto.html) 模块提供的各种加密算法，十分方便。

#### HMAC_SHA-1
```ts
import crypto from 'crypto'

function hmacSha1(key: string, value: string) {
  const hmac = crypto.createHmac('sha1', key)
  hmac.update(value) // 设置用于计算校验值的字符串
  return hmac.digest('base64') // 计算校验值，并按照 base64 返回
}
```

#### MD5
```ts
import crypto from 'crypto'

function MD5(value: string) {
  const md5 = crypto.createHash('md5')
  md5.update(value) // 设置用于计算 MD5 值的字符串
  return md5.digest('hex') // 计算 MD5 值，并直接以十六进制字符串返回
}
```

## 安全问题
针对存储 账号&密码 等敏感信息的可以使用浏览器提供的账号密码管理能力存储。

例如 Chrome 中提供的 [PasswordCredential](https://developer.mozilla.org/en-US/docs/Web/API/PasswordCredential) 相关API。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/33718f80b75831246df5674b7e1652ec)

调用后就可以唤起存储的弹窗。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/a727475bc375a37e6825016face1541e)

## 最后
总结一下：浏览器中也可以使用`window.crypto`提供的 API，完成常用的加密算法调用，同时也可以在 [Web Worker 中使用](https://developer.mozilla.org/zh-CN/docs/Web/API/WorkerGlobalScope/crypto)，可以有效提升性能。

当前这一版图床，应该也还不是最终版，后续计划将部分管理功能以某种可能得形式完成纯静态的支持。

*欢迎评论区交流想法&意见*