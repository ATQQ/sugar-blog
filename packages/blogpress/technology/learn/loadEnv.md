---
title: 封装dotenv库实现类似Vite加载环境变量的行为
date: 2021-06-20
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 封装dotenv库实现类似Vite加载环境变量的行为

## dotenv的作用
将`.env`文件中的环境变量加载到 `process.env` 中

### 简单使用示例
**安装依赖**
```sh
yarn add dotenv
```

编写 **.env** 文件
```sh
# 数据库相关内容
DB_USER=test
DB_PWD=123456
DB_PORT=3306
```

**test.js**
```js
const dotenv = require('dotenv')

const res = dotenv.config()

console.log(res);

console.log(process.env.DB_PORT);
```

**运行结果**

注意.env文件需在项目的根目录中（终端执行指令的目录）

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDIwMTI3OTA4NA==624201279084)

## Vite中读取.env文件的规则
这里直接贴图[原文档内容](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)，不做过多赘述

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDIwMDYxNTQ3Ng==624200615476)

很详细的叙述了Vite加载额外环境变量的规则

## 循序渐进的实现
### 指定存放环境变量文件
1. 首先通过`process.cwd()`,获取终端执行命令的路径

```js
console.log(process.cwd())
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDIwMTU1MjY4MA==624201552680)

2. `dotenv.config`的参数定义
```ts
export interface DotenvConfigOptions {
  /**
   * You may specify a custom path if your file containing environment variables is located elsewhere.
   */
  path?: string;

  /**
   * You may specify the encoding of your file containing environment variables.
   */
  encoding?: string;

  /**
   * You may turn on logging to help debug why certain keys or values are not being set as you expect.
   */
  debug?: boolean;
}
```
可以看出通过path参数指定环境变量的路径

测试代码如下
```js
const dotenv = require('dotenv')
const baseDir = process.cwd()

const res1 = dotenv.config({path:`${baseDir}/.lalala`})
const res2 = dotenv.config({path:`${baseDir}/.lalala2`})
const res3 = dotenv.config({path:`${baseDir}/.不存在`})

console.log(res1);
console.log(res2);
console.log(res3);
console.log(process.env.TEST_ENV);
```
输出内容分别如下
```js
{ parsed: { TEST_ENV: 'test1' } }
{ parsed: { TEST_ENV: 'test2' } }
{
  error: 'xxx'
}
test1
```
可以看出当指定文件存在时，解析的内容会在结果的`parsed`属性中

不存在时，解析结果只包含错误信息error

当指定了path参数后，执行多个`donEnv.config`方法，只会自动加载第一个的解析结果到process.env中去

### 加载读取的环境变量
这个步骤简单，直接遍历`parsed`属性的内容，将其添加到process.env属性上即可

```js
function load(parseEnvObj) {
  const { parsed } = parseEnvObj
  if (parsed && parsed instanceof Object) {
    Object.getOwnPropertyNames(parsed).forEach((k) => {
      process.env[k] = parsed[k]
    })
  }
}
```

测试
```js
const baseDir = process.cwd()

const res1 = dotenv.config({ path: `${baseDir}/.lalala` })
const res2 = dotenv.config({ path: `${baseDir}/.lalala2` })
const res3 = dotenv.config({ path: `${baseDir}/.不存在` })

load(res1);
load(res2);
load(res3);
console.log(process.env.TEST_ENV); // test2
```

### 实现Vite的读取规则
```js
function loadEnv() {
    const baseDir = process.cwd()
    // .env
    load(dotenv.config({ path: `${baseDir}/.env` }))
    // .env.local
    load(dotenv.config({ path: `${baseDir}/.env.local` }))
    // .env.[mode]
    load(dotenv.config({ path: `${baseDir}/.env.${process.env.NODE_ENV}` }))
    // .env.[mode].local
    load(dotenv.config({ path: `${baseDir}/.env.${process.env.NODE_ENV}.local` }))
}
```

简单封装成一个函数，直接调用`loadEnv`

`mode`的设置可以通过[cross-env](https://github.com/kentcdodds/cross-env#readme)库设置,如下所示

`package.json`
```json
{
    "scripts": {
        "dev": "cross-env NODE_ENV=development node ./tests/test.js",
    },
}
```
### 限制环境变量前缀
简单修改后的代码,添加了前缀的过滤
```js
function load(parseEnvObj, prefix = '') {
    const { parsed } = parseEnvObj
    if (parsed && parsed instanceof Object) {
        Object.getOwnPropertyNames(parsed).forEach((k) => {
            if (k.indexOf(prefix) === 0) {
                process.env[k] = parsed[k]
            }else{
                process.env[k] = undefined
            }
        })
    }
}
function loadEnv(options = {}) {
    const { prefix = '' } = options
    const baseDir = process.cwd()
    // .env
    load(dotenv.config({ path: `${baseDir}/.env` }), prefix)
    // .env.local
    load(dotenv.config({ path: `${baseDir}/.env.local` }), prefix)
    // .env.[mode]
    load(dotenv.config({ path: `${baseDir}/.env.${process.env.NODE_ENV}` }), prefix)
    // .env.[mode].local
    load(dotenv.config({ path: `${baseDir}/.env.${process.env.NODE_ENV}.local` }), prefix)
}
```

**测试**

`.env`内容
```sh
# 数据库相关内容
DB_USER=test
DB_PWD=123456
DB_PORT=3306

SUGAR_USER=sugar
```


```js
loadEnv()
console.log(process.env.DB_USER); // test
console.log(process.env.SUGAR_USER); // sugar
```

```js
loadEnv({prefix:'SUGAR'})
console.log(process.env.DB_USER); // undefined
console.log(process.env.SUGAR_USER); // sugar
```
### 最终版
```js
// 读取配置的环境变量
const dotenv = require('dotenv')

function load(parseEnvObj, prefix = '') {
  const { parsed } = parseEnvObj
  if (parsed && parsed instanceof Object) {
      Object.getOwnPropertyNames(parsed).forEach((k) => {
          if (k.indexOf(prefix) === 0) {
              process.env[k] = parsed[k]
          }else{
              process.env[k] = undefined
          }
      })
  }
}
function loadEnv(options = {}) {
  const { prefix = '' } = options
  const baseDir = process.cwd()
  // .env
  load(dotenv.config({ path: `${baseDir}/.env` }), prefix)
  // .env.local
  load(dotenv.config({ path: `${baseDir}/.env.local` }), prefix)
  // .env.[mode]
  load(dotenv.config({ path: `${baseDir}/.env.${process.env.NODE_ENV}` }), prefix)
  // .env.[mode].local
  load(dotenv.config({ path: `${baseDir}/.env.${process.env.NODE_ENV}.local` }), prefix)
}

module.exports = loadEnv
```

## 使用
```js
const loadEnv = require('modulePath')
loadEnv()
// or
loadEnv({prefix:'xx'})
```

## TODO
下一次分享一下Vite中这部分的源码实现逻辑

