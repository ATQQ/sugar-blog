---
title: 实践：给女朋友个性化定制应用-体重记录（三）
date: 2021-06-18
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# 实践：给女朋友个性化定制应用-体重记录（三）

**此系列的目的是帮助前端新人，熟悉现代前端工程化开发方式与相关技术的使用，普及一些通识内容**

## 前景回顾
* [实践：给女朋友个性化定制应用-体重记录（一）](./timeLover-1.md)，主要阐述了应用前端工程的搭建与部分页面开发
* [实践：给女朋友个性化定制应用-体重记录（二）](./timeLover-2.md)，主要阐述了体重记录页面的开发，后端接口设计，数据库设计

本文详细介绍一下后端开发和部署，前后端联调的内容

## 本文涉及内容
* 接口开发
* 接口鉴权
* 前后端联调
* 后端部署

## 一期最终效果展示
[体验地址](https://lover.sugarat.top/)

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDAyNzI3ODI1MA==624027278250)

* 提供了测试账号一键登录
* bug: 短信登录线上还有点小问题,发不出验证码

## 前端联调配置
### Vite 
前端构建工具使用的`Vite`

在`vite.config.ts`中配置proxy，在开发环境时，根据指定的接口路径前缀，将请求转发到本地的后端服务

并且使用proxy能解决前端跨域的问题

```ts
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
})
```
### 环境变量
主要配置`axios`请求的baseUrl路径

开发环境访问接口，统一添加 `/api` 前缀，通过proxy转发到本地开发环境 
`.env`
```sh
VITE_APP_AXIOS_BASE_URL=/api
```

由于前端应用生产环境使用serverless-静态资源站点部署，不提供请求转发功能

所以在生产环境直接请求线上(serverless)的后端服务

为此通过后端开启`CORS`(跨域资源共享)来解决请求跨域的问题
`.env.production`

```sh
VITE_APP_AXIOS_BASE_URL=https://service-pfwgr4kl-1256505457.cd.apigw.tencentcs.com/release
```

### Axios配置
* 通过刚刚设置的Vite环境变量，动态指定请求的Base路径
* 使用token鉴权，登录成功后，将返回的token存入的`Localstorage`中
* 每次请求通过axios请求拦截器自动附带
```ts
import axios from 'axios'

const instance = axios.create({
  // 通过刚刚设置的Vite环境变量，动态指定请求的Base路径
  baseURL: import.meta.env.VITE_APP_AXIOS_BASE_URL,
})

/**
 * 请求拦截
 */
instance.interceptors.request.use((config) => {
  const { method, params } = config
  // 附带鉴权的token
  const headers: any = {
    token: localStorage.getItem('token'),
  }
  // 不缓存get请求
  if (method === 'get') {
    headers['Cache-Control'] = 'no-cache'
  }
  // delete请求参数放入body中
  if (method === 'delete') {
    headers['Content-type'] = 'application/json;'
    Object.assign(config, {
      data: params,
      params: {},
    })
  }

  return {
    ...config,
    headers,
  }
})
```

在axios响应拦截器中加入了简单的鉴权逻辑：
* 响应`code`（业务定义）为401时，自定跳转到应用首页
* 其它非0的`code`使用Promise.reject处理，业务调用方在catch回调中处理非正常的业务逻辑
```ts
/**
 * 响应拦截
 */
instance.interceptors.response.use((v) => {
  if (v.data?.code === 401) {
    localStorage.removeItem('token')
    // 未登录
    window.location.href = '/'
    return v.data
  }
  if (v.status === 200) {
    if (v.data.code !== 0) {
      return Promise.reject(v.data)
    }
    return v.data
  }
})
export default instance
```

## 后端联调配置
### 跨域配置
在构造函数拦截器中配置：
* 使用`allowOrigins`配置允许访问的域名
* 使用`Array.includes`在请求的时候，判断来源域名是否被允许
* 允许访问的域名添加到`Access-Control-Allow-Origin`请求头中
* 判断请求方法如果是`options`，默认其为预检请求，就直接返回

```ts
import { Middleware } from '@/lib/server/types'
// 允许跨域访问的源
const allowOrigins = ['https://lover.sugarat.top', 'http://lover.sugarat.top']

const interceptor: Middleware = (req, res) => {
    const { method } = req
    if (allowOrigins.includes(req.headers.origin)) {
        // 允许跨域
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    }
    //跨域允许的header类型
    res.setHeader('Access-Control-Allow-Headers', '*')
    // 允许跨域携带cookie
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    // 允许的方法
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    // 设置响应头
    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    // 对预检请求放行
    if (method === 'OPTIONS') {
        res.statusCode = 204
        res.end()
    }
}
export default interceptor
```

### 环境变量
将一些敏感的数据库密码或第三方服务的身份验证凭据放入到环境变量中

本地用：`.env.local`
```sh
# 服务相关
PORT=3000

# 腾讯云相关
secretId=****
secretKey=****
envId=time-lover-1g02fg37bf3148fa

# 短信模板
TENCENT_MESSAGE_TemplateID=****
TENCENT_MESSAGE_SmsSdkAppid=****

# redis相关配置
REDIS_DB_HOST=****
REDIS_DB_PORT=****
REDIS_DB_PASSWORD=****
```
线上prod环境:`.env.production.local`

同时将`*.local`添加进`.gitignore`中，防止秘钥不小心泄露到GitHub上

## 接口开发
营养不高，也是体力活：
* [完整接口源码查看仓库](https://github.com/ATQQ/time-lover-server/tree/master/src/routes)
* [详细的接口文档](https://easy2.w.eolinker.com/share/index?shareCode=nJMZ5t)

这里简单贴一下`User部分`的接口开发，为接口添加了尽可能详尽的注释帮助理解

后端部分，使用的是[自己diy的玩具模板框架](https://github.com/ATQQ/node-server)，后面出文详细介绍此部分的详细设计与实现

### 用户部分接口
[src/routes/modules/user.ts](https://github.com/ATQQ/time-lover-server/blob/master/src/routes/modules/user.ts)

```ts
import { GlobalError, UserError } from '@/constants/errorMsg'
import { expiredRedisKey, getRedisVal, setRedisValue } from '@/db/redisDb'
import { inserUser, queryUserList } from '@/db/userDb'
import Router from '@/lib/Router'
import { randomNumStr } from '@/utils/randUtil'
import { rMobilePhone, rVerCode } from '@/utils/regExp'
import { getUniqueKey } from '@/utils/stringUtil'
import { sendMessage } from '@/utils/tencent'
import tokenUtil from '@/utils/tokenUtil'

// 设置此部分路由的公共前缀
const router = new Router('user')

// 用户登录接口
router.post('login', async (req, res) => {
    const { phone, code } = req.body
    
    // 测试账号数据，直接放行测试账号
    if (phone === '13245678910' && code === '1234') {
        // 通过手机号查询用户信息
        const [user] = await queryUserList({
            phone
        })
        // 直接调用createToken根据用户信息生成token（身份凭证），30天有效（自动存入redis中）
        const token = await tokenUtil.createToken(user, 60 * 60 * 24 * 30)
        res.success({
            token
        })
        return
    }
    // 参数格式不正确
    if (!rMobilePhone.test(phone) || !rVerCode.test(code)) {
        res.failWithError(GlobalError.paramsError)
        return
    }
    const v = await getRedisVal(`code-${phone}`)
    if (code !== v) {
        res.failWithError(UserError.errorCode)
        return
    }
    let [user] = await queryUserList({
        phone
    })
    // 不存在就插入
    if (!user) {
        user = {
            userId: getUniqueKey(),
            phone,
            joinTime: new Date()
        }
        await inserUser(user)
    }
    const token = await tokenUtil.createToken(user, 60 * 60 * 24 * 30)
    // 过期验证码
    expiredRedisKey(`code-${phone}`)
    res.success({
        token
    })
})

// 获取登录验证码
router.get('code', (req, res) => {
    const { phone } = req.query
    // 参数格式不正确
    if (!rMobilePhone.test(phone)) {
        res.failWithError(GlobalError.paramsError)
        return
    }
    // 随机生成一个4位长的数字
    const code = randomNumStr(4)
    if (process.env.NODE_ENV !== 'development') {
        // 调用封装的腾讯云SDK方法发送验证码
        sendMessage(phone, code, 2)
    }
    // 存入redis中，120s有效时间
    setRedisValue(`code-${phone}`, code, 120)
    console.log(code)
    res.success()
})

export default router
```

### 汇总各模块路由
```ts
// types
import { Route } from '@/lib/server/types'

// router
import user from './modules/user'
import family from './modules/family'
import record from './modules/record'

// 这里注册路由
const routers = [user, family, record]

export default routers.reduce((pre: Route[], router) => {
    return pre.concat(router.getRoutes())
}, [])
```
### 注册路由&启动服务
```ts
// polyfill
import 'core-js/es/array'

console.time('server-start')
// 从.env加载环境变量
import loadEnv from './utils/loadEnv'

loadEnv()

// 路径映射
import loadModuleAlias from './utils/moduleAlias'

loadModuleAlias()
// 配置文件
import { serverConfig } from './config'

// diy module 自建模块
import FW from './lib/server'

// routes
import routes from './routes'

// interceptor
import { serverInterceptor, routeInterceptor } from './middleware'

const app = new FW(serverInterceptor, {
    beforeRunRoute: routeInterceptor
})

// 注册路由
app.addRoutes(routes)

app.listen(serverConfig.port, serverConfig.hostname, () => {
    console.log('-----', new Date().toLocaleString(), '-----')
    if (process.env.NODE_ENV === 'development') {
        // 写入测试用逻辑
    }
    console.timeEnd('server-start')
    console.log('server start success', `http://${serverConfig.hostname}:${serverConfig.port}`)
})

module.exports = app
```
## 接口鉴权

在路由拦截器中判断请求携带的token是否有效，无效则直接响应无权限状态码

通过路由配置的options参数来判断路由是否需要鉴权
```ts
import { GlobalError } from '@/constants/errorMsg'
import { Middleware } from '@/lib/server/types'
import { getUserInfo } from '@/utils/tokenUtil'

const interceptor: Middleware = async (req, res) => {
    const { options } = req.route
    console.log(`路由拦截:${req.method} - ${req.url}`)
    if (options && options.needLogin) {
        const user = await getUserInfo(req)
        if(!user){
            res.failWithError(GlobalError.powerError)
        }
    }
}
export default interceptor
```
路由上的`option`参数在router.xxx的第三个参数的位置,如下示例所示

```ts
router.post('add', async (req, res) => {
    const { name } = req.body
    const { userId } = await getUserInfo(req)
    const familyId = getUniqueKey()
    await insertFamily({
        name,
        userId,
        familyId
    })
    res.success({
        familyId
    })
    // 这个路由的options配置
},{
    needLogin:true
})
```


## 工具方法

介绍一些开发时用到的工具方法
### loadEnv
封装`dotenv`库，封装为`loadEnv`方法

自动按顺序依次读取项目根目录的`.env`，`.env.local`，`.env.[mode].local`，`.env.[mode]`中的环境变量文件

```ts
// 读取配置的环境变量
import dotenv from 'dotenv'

function load(parseEnvObj) {
  const { parsed } = parseEnvObj
  if (parsed && parsed instanceof Object) {
    Object.getOwnPropertyNames(parsed).forEach((k) => {
      process.env[k] = parsed[k]
    })
  }
}

export default function loadEnv() {
  const baseDir = `${process.cwd()}/`
  // .env
  dotenv.config()
  // .env.local
  load(dotenv.config({ path: `${baseDir}.env.local` }))
  // .env.[mode].local
  load(dotenv.config({ path: `${baseDir}.env.${process.env.NODE_ENV}.local` }))
  // .env.[mode]
  load(dotenv.config({ path: `${baseDir}.env.${process.env.NODE_ENV}` }))
}

```
### loadModuleAlias
添加`module-alias`路径映射库，映射项目中使用的`@`开头或其它自定义的路径

```ts
// 编译后的绝对路径映射插件
// 下面这行从package.json读取配置
// import 'module-alias/register'
import moduleAlias from 'module-alias'

export default function loadModuleAlias() {
  moduleAlias.addAliases({
    '@': `${__dirname}/../`,
  })
}

```

### createToken
根据用户的`userId`,`phone`,`当前时间`拼接成一个字符串

调用`encryption`方法生成这个字符串的md5 hash摘要作为最终的用户登录凭证

将凭证作为key，用户信息序列化后的值作为value，存入redis中
```ts
function createToken(user: User, timeout = 60 * 60 * 24) {
    const { phone, userId } = user
    const token = encryption([phone, userId, Date.now()].join())
    await setRedisValue(token, JSON.stringify(user), timeout)
    return token
}
```

### encryption
利用 `crypto`库的提供的方法，计算指定字符串的md5 hash摘要值，并以base64编码返回摘要结果
```ts
import crypto from 'crypto'
/**
 * 加密字符串(md5+base64)
 * @param str 待加密的字符串
 */
export function encryption(str: string): string {
    return crypto.createHash('md5').update(str).digest('base64')
}
```

### getUniqueKey
利用 `MongoDB` 提供的`ObjectId`对象生成一个唯一的标识

关于ObjectId的介绍可以查看文章[源码学习：探究MongoDB - ObjectId最新的生成原理](https://juejin.cn/post/6972191054321680421)
```ts
import { ObjectId } from 'mongodb'

export function getUniqueKey() {
    return new ObjectId().toHexString()
}
```


### 后端部署
使用腾讯云Serverless服务部署后端的Node应用，详细教程移步：[Serverless实践-Node服务上线部署](https://juejin.cn/post/6974416943600107533)

## 资料汇总
* [前端项目源代码](https://github.com/ATQQ/timeLover)
* [后端项目源代码](https://github.com/ATQQ/time-lover-server)
* [后端项目模板](https://github.com/ATQQ/node-server)
* [数据库设计](https://github.com/ATQQ/time-lover-server/blob/master/docs/db.md)
* [详细接口设计](https://easy2.w.eolinker.com/share/project/api/?groupID=-1&shareCode=nJMZ5t&shareToken=$2y$10$gNK48kATh9yIeQokemYpaefvSzmyUwCtpyZ6lEkHh7nQdoZ9PbGrm&shareID=322197)
* [项目线上预览地址](https://lover.sugarat.top/dashboard)
* [源码学习：探究MongoDB - ObjectId最新的生成原理](https://juejin.cn/post/6972191054321680421)
* [module-alias](https://github.com/ilearnio/module-alias)
* [dotenv](https://github.com/motdotla/dotenv)

