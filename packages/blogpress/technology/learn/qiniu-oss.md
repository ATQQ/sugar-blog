---
title: 分享封装的一些七牛云OSS操作方法
date: 2021-06-03
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 分享封装的一些七牛云OSS操作方法

## 前言
最近在用[七牛云对象存储服务](https://www.qiniu.com/products/kodo)做了一个[小应用](https://ep2.sugarat.top)

对一些使用频率较高的方法进行了封装,和大家分享一下,帮助大家开发提效

## 准备工作

项目中安装`qiniu`依赖
```sh
npm i qiniu
```

鉴权代码，通过`accessKey`与`secretKey`鉴权
```js
const qiniu = require('qiniu')
const qiniuConfig = {
    accessKey: process.env.qiniu_accessKey,
    secretKey: process.env.qiniu_secretKey
}
const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey)
```

公共参数
```js
// 空间名称
const bucket = 'bucket'
// 空间绑定的域名
const privateBucketDomain = 'http://example.com'
```

## 方法汇总
### 上传凭证获取
凭证默认1小时有效,客户端需要此凭证进行上传鉴权
```js
function getUploadToken(): string {
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
    // expires: 3600,
    // returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
  })
  return putPolicy.uploadToken(mac)
}
```
通过returnBody可以自定义上传成功的响应

### 客户端上传
注:这里客户端是指浏览器

安装依赖
```sh
npm install qiniu-js
```

客户端直传，封装了三个回调:
* success: 上传成功
* error: 上传出错
* process: 上传中

```js
import * as qiniu from 'qiniu-js'

/**
 * 七牛云上传
 * @param token 上传凭证
 * @param file 待上传的文件
 * @param key 最终存储在OSS中资源的key
 * @param options 成功/失败/上传中回调
 */
function qiniuUpload(token, file, key, options) {
  const observable = qiniu.upload(file, key, token)
  const { success, error, process } = options || {}
  const subscription = observable.subscribe({
    // subscription.close() // 取消上传
    next(res) {
      const { total: { percent } } = res
      if (process) {
        process(percent.toFixed(2), res, subscription)
      }
    },
    error(err) {
      if (error) {
        error(err, subscription)
      }
    },
    complete(res) {
      if (success) {
        success(res, subscription)
      }
    },
  })
```
<details>
<summary>调用示例</summary>

```js
qiniuUpload(uploadToken, file, key, {
  success(data) {
    console.log('上传成功')
  },
  process(per) {
    // 打印上传进度
    console.log(~~(per))
  },
})
```
</details>

### 获取OSS文件的下载链接
```js
const getDeadline = () => {
    // 12小时过期
    return Math.floor(Date.now() / 1000) + 3600 * 12
}
/**
 * 获取OSS上文件的下载链接
 * @param key 文件的key
 * @param expiredTime 链接过期的具体时间
 */
function createDownloadUrl(key, expiredTime = getDeadline()) {
    const config = new qiniu.conf.Config()
    const bucketManager = new qiniu.rs.BucketManager(mac, config)
    return bucketManager.privateDownloadUrl(privateBucketDomain, key, expiredTime)
}
```

### 单个删除指定资源
```js
function deleteSourceByKey(key){
  const config = new qiniu.conf.Config()
  const bucketManager = new qiniu.rs.BucketManager(mac, config)
  bucketManager.delete(bucket, key, (err) => {
    if (err) {
      console.log('------删除失败-------')
      console.log(key)
      console.log(err)
    }
  })
}
```

### 批量删除指定资源
```js
function batchDeleteFiles(keys) {
  const config = new qiniu.conf.Config()
  const delOptions = keys.map((k) => qiniu.rs.deleteOp(bucket, k))
  const bucketManager = new qiniu.rs.BucketManager(mac, config)
  bucketManager.batch(delOptions, (err, respBody, respInfo) => {
    if (err) {
      console.log(err)
    } else {
      // 200 is success, 298 is part success
      if (parseInt(`${respInfo.statusCode / 100}`, 10) === 2) {
        respBody.forEach((item) => {
          if ((+item.code) === 200) {
            console.log(`${item.code}\tsuccess`)
          } else {
            console.log(`${item.code}\t${item.data.error}`)
          }
        })
      } else {
        console.log(respInfo.deleteusCode)
        console.log(respBody)
      }
    }
  })
}
```

### 删除指定前缀资源
```js
function deleteFilesBuPrefix(prefix){
  const config = new qiniu.conf.Config()
  const bucketManager = new qiniu.rs.BucketManager(mac, config)
  bucketManager.listPrefix(bucket, {
    limit: 1000,
    prefix,
  }, (err, respBody) => {
    const files = respBody.items
    // 调用批量删除接口
    batchDeleteFiles(files.map((f) => f.key))
  })
}
```

### 判断资源是否存在
`bucketManager.stat`这个方法用于查看资源信息
```js
function judgeFileIsExist(key){
  return new Promise((res) => {
    const config = new qiniu.conf.Config()
    const bucketManager = new qiniu.rs.BucketManager(mac, config)
    bucketManager.stat(bucket, key, (err, respBody, respInfo) => {
      if(respInfo?.statusCode){
        res(respInfo.statusCode !== 612)
      }else{
        res(false)
      }
    })
  })
}
```

### 批量查询文件信息
```js
export function batchFileStatus(keys){
  return new Promise((resolve, reject) => {
    const statOperations = keys.map((k) => qiniu.rs.statOp(bucket, k))
    const config = new qiniu.conf.Config()
    const bucketManager = new qiniu.rs.BucketManager(mac, config)
    bucketManager.batch(statOperations, (err, respBody, respInfo) => {
      if (err) {
        console.log(err)
        // throw err;
      } else {
        // 200 is success, 298 is part success
        if (parseInt(`${respInfo.statusCode / 100}`) == 2) {
          resolve(respBody)
        } else {
          console.log(respInfo.statusCode)
          console.log(respBody)
        }
      }
    })
  })
}
```

### 多个文件归档为压缩包
这个地方文档非常模糊，需要耗费不少时间试错，需要用到前面提到的：
* 获取资源下载链接方法
* 获取资源上传凭证方法

由于代码较长，为避免影响阅读，固进行折叠
<details>
<summary>
资源归档方法
</summary>

```js
const path = require('path')
const qiniu = require('qiniu')
const { urlsafeBase64Encode } = qiniu.util

function getKeyInfo(key: string) {
  const { name, base, ext } = path.parse(key)
  return {
    name, base, ext,
  }
}
/**
 * 资源归档为zip
 * @param {string[]} keys 需要归档的资源
 * @param {string} zipName 压缩包名称 
 * @returns 
 */
function makeZipWithKeys(keys, zipName){
  return new Promise((res) => {
    const names = []
    const content = keys.map((key) => {
      // 拼接原始url
      // 链接加密并进行Base64编码，别名去除前缀目录。
      const keyInfo = getKeyInfo(key)
      const { name, ext } = keyInfo
      let { base } = keyInfo

      // 判断别名是否存在,存在则后缀+数字自增
      let i = 1
      while (names.includes(base)) {
        base = `${name}_${i}${ext}`
        i += 1
      }
      names.push(base)
      const safeUrl = `/url/${urlsafeBase64Encode(createDownloadUrl(key))}/alias/${urlsafeBase64Encode(base)}`
      return safeUrl
    }).join('\n')
    const config = new qiniu.conf.Config({ zone: qiniu.zone.Zone_z2 })
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    const key = `${Date.now()}-${~~(Math.random() * 1000)}.txt`

    formUploader.put(getUploadToken(), key, content, putExtra, (respErr,
      respBody, respInfo) => {
      if (respErr) {
        throw respErr
      }
      if (respInfo.statusCode == 200) {
        const { key } = respBody
        // 执行压缩 设置压缩资源的保存路径
        const zipKey = urlsafeBase64Encode(`${bucket}:temp_package/${Date.now()}/${zipName}.zip`)

        const fops = `mkzip/4/encoding/${urlsafeBase64Encode('gbk')}|saveas/${zipKey}`
        const operManager = new qiniu.fop.OperationManager(mac, config)
        const pipeline = '' // 使用公共队列
        // 下行。不知用处
        const options = { force: false }
        operManager.pfop(bucket, key, [fops], pipeline, options, (err, respBody, respInfo) => {
          if (err) {
            throw err
          }
          if (respInfo.statusCode == 200) {
            // 可直接通过statusUrl查询处理状态
            const statusUrl = `http://api.qiniu.com/status/get/prefop?id=${respBody.persistentId}`
            console.log(statusUrl)
            // 这里只返回任务id，转由客户端发请求查询
            res(respBody.persistentId)
          } else {
            console.log(respInfo.statusCode)
            console.log(respBody)
          }
        })
      } else {
        console.log(respInfo.statusCode)
        console.log(respBody)
      }
    })
  })
}
```
</details>

<details>
<summary>
查看资源归档完成状态
</summary>

```js
/**
 * 查询Fop任务完成状态
 * @param {string} persistentId 
 * @returns 
 */
function checkFopTaskStatus(persistentId){
  const config = new qiniu.conf.Config()
  const operManager = new qiniu.fop.OperationManager(null, config)
  return new Promise((res) => {
    operManager.prefop(persistentId, (err, respBody, respInfo) => {
      if (err) {
        console.log(err)
        throw err
      }
      if (respInfo.statusCode == 200) {
        // 结构 ![图片](https://img.cdn.sugarat.top/mdImg/MTYxMjg0MTQyODQ1Mg==612841428452)
        const item = respBody.items[0]
        const { code, key } = item
        res({ code, key })
      } else {
        console.log(respInfo.statusCode)
        console.log(respBody)
      }
    })
  })
}
```
</details>

归档完成后即可调用下载资源文件的方法

## 参考
* [七牛云-Node.js SDK](https://developer.qiniu.com/kodo/1289/nodejs)

