---
title: 源码学习：Vite中加载环境变量（loadEnv）的实现
date: 2021-06-21
tags:
 - 技术笔记
 - 源码学习
categories:
 - 技术笔记
---
# 源码学习：Vite中加载环境变量（loadEnv）的实现

## 前言
昨天在[封装dotenv库实现类似Vite加载环境变量的行为](./../learn/loadEnv.md)的文章中，模拟实现了Vite加载环境变量的方法

本文进入源码，进一步学习一下的原本的加载逻辑

源码位置：[vitejs/vite/packages/vite/src/node/config.ts](https://github.com/vitejs/vite/blob/6e3653fe62bc381deb86d28921e1ae7375456d0b/packages/vite/src/node/config.ts#L903)

## 方法的定义
```ts
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

export function loadEnv(
    mode: string,
    envDir: string,
    prefix = 'VITE_'
): Record<string, string> {

}
```

### 传入参数

可以看到传入了三个参数：
* `mode`：模式
* `envDir`：环境变量配置文件所在目录
* `prefix`：接受的环境变量前缀，默认为 **VITE_**，这就应证了文档中提到的内容

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNDI4MzYwNTYwMA==624283605600)

### 返回值
一个键与值都是`string`类型的对象

## 方法调用逻辑
调用`loadEnv`方法的逻辑如下

```ts
// defaultMode = ‘development’
let mode = inlineConfig.mode || defaultMode

// 。。。more code

// resolve root
const resolvedRoot = normalizePath(
  config.root ? path.resolve(config.root) : process.cwd()
)

// 。。。more code

// load .env files
const envDir = config.envDir
  ? normalizePath(path.resolve(resolvedRoot, config.envDir))
  : resolvedRoot
const userEnv = inlineConfig.envFile !== false && loadEnv(mode, envDir)
```
### envDir
环境变量所在目录（envDir）计算：
1. 判断配置`config.envDir`是否为`true`，如果是则目录（resolvedRoot）与`config.envDir`的拼接
2. 否则就直接是根目录
### resolveRoot
根目录（resolveRoot）计算：
1. 判断是否配置了`config.root`，是则就是`config.root`，否则就是`process.cwd()`即终端中执行指令的路径

### mode
模式（mode）计算：
1. 如果配置文件`mode`就按配置文件的内容，否则就默认`development`

### userEnv
用户配置的环境变量`userEnv`：
1. 如果配置文件中`envFile`属性不为`false`，就调用`loadEnv`

## loadEnv方法实现
这里源码篇幅稍微有一点点大，咱就直接在源码中加注释进行解读
```ts
import dotenvExpand from 'dotenv-expand'

export function loadEnv(
  mode: string,
  envDir: string,
  prefix = 'VITE_'
): Record<string, string> {
  // 如果设置的模式是 local 就抛出错误 
  // 即避免与.loacl 后缀文件冲突
  if (mode === 'local') {
    throw new Error(
      `"local" cannot be used as a mode name because it conflicts with ` +
        `the .local postfix for .env files.`
    )
  }

  // 初始化 {}
  const env: Record<string, string> = {}

  // 环境变量文件，符合规矩的四种命名
  // 这也说明了环境变量的文件的加载顺序
  // 1. 本地下的 指定模式
  // 2. 指定模式
  // 3. 本地通用
  // 4. 通用的
  const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ `.env.local`,
    /** default file */ `.env`
  ]

  // 检查是否已经有以VITE_开头的环境变量
  // 如果有 且 在已有的env中未定义 那么直接引入此类变量
  // 机翻原句：这些通常是内联提供的，应该优先考虑
  for (const key in process.env) {
    if (key.startsWith(prefix) && env[key] === undefined) {
      env[key] = process.env[key] as string
    }
  }
  
  // 遍历环境遍历配置文件
  for (const file of envFiles) {
    // 判断配置文件是否存在，lookupFile源码后文贴出  
    const path = lookupFile(envDir, [file], true)
    // 如果文件存在
    if (path) {
      // 调用 dotenv 解析文件内容
      const parsed = dotenv.parse(fs.readFileSync(path), {
        debug: !!process.env.DEBUG || undefined
      })

      // 机翻：让环境变量互相使用
      // 用于在机器上扩展环境变量
      // 但不写入到process.env上
      // 好家伙，怪不得在代码中用 process.env 取不到对应变量
      dotenvExpand({
        parsed,
        // 机翻：如果设置了 ignoreProcessEnv，则不会写入到 process.env
        ignoreProcessEnv: true
      } as any)

      // 机翻：只有以指定前缀开头的键才会暴露给客户端
      for (const [key, value] of Object.entries(parsed)) {
        if (key.startsWith(prefix) && env[key] === undefined) {
          // 暴露到env变量上
          env[key] = value
        } else if (key === 'NODE_ENV') {
          //机翻：使用配置文件中的NODE_ENV覆盖现有的NODE_ENV
          process.env.VITE_USER_NODE_ENV = value
        }
      }
    }
  }
  // 返回出的解析的环境变量
  return env
}
```

### lookupFile
判断目标文件是否存在或者读取目标文件中的内容，根据`pathOnly`参数判断返回的内容：
* true：返回文件的绝对路径
* false：返回文件的内容

如果文件不存在则返回`undefined`

```ts
export function lookupFile(
  dir: string,
  formats: string[],
  pathOnly = false
): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format)
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return pathOnly ? fullPath : fs.readFileSync(fullPath, 'utf-8')
    }
  }
  const parentDir = path.dirname(dir)
  if (parentDir !== dir) {
    return lookupFile(parentDir, formats, pathOnly)
  }
}
```

## 独立迁移
### TS版
```ts
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import nodepath from 'path'
import fs from 'fs'

type Record<K extends keyof any, T> = {
  [P in K]: T;
};

interface Options {
  // 模式
  mode?: string
  // 环境变量配置文件所在目录
  envDir?: string
  // 允许前缀
  prefix?: string
  // 不写入到process.env上
  ignoreProcessEnv?: boolean
}

const defaultOptions: Options = {
  mode: 'development',
  envDir: process.cwd(),
  prefix: '',
  ignoreProcessEnv: false
}
export function loadEnv(options?: Options): Record<string, string> {
  // 设置默认值
  options = Boolean(options) ? options : {}
  Object.assign(options, defaultOptions, options)
  const { mode, envDir, prefix, ignoreProcessEnv } = options

  if (mode === 'local') {
    throw new Error(
      `"local" cannot be used as a mode name because it conflicts with ` +
      `the .local postfix for .env files.`
    )
  }

  const env: Record<string, string> = {}

  const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ `.env.local`,
    /** default file */ `.env`
  ]

  for (const key in process.env) {
    if (key.startsWith(prefix) && env[key] === undefined) {
      env[key] = process.env[key] as string
    }
  }

  for (const file of envFiles) {
    const fullpath = nodepath.join(envDir, file)
    const path = fs.existsSync(fullpath) ? fullpath : undefined

    if (path) {
      const parsed = dotenv.parse(fs.readFileSync(path), {
        debug: !!process.env.DEBUG || undefined
      })

      dotenvExpand({
        parsed,
        ignoreProcessEnv
      } as any)

      for (const [key, value] of Object.entries(parsed)) {
        if (key.startsWith(prefix) && env[key] === undefined) {
          env[key] = value
        } else if (key === 'NODE_ENV') {
          process.env.NODE_ENV = value
        }
      }
    }
  }

  return env
}
```

### JS版
```js
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const nodepath = require('path')
const fs = require('fs')

function loadEnv(options){
  // 设置默认值
  options = Boolean(options) ? options : {}
  Object.assign(options, defaultOptions, options)
  const { mode, envDir, prefix, ignoreProcessEnv } = options
  if (mode === 'local') {
    throw new Error(
      `"local" cannot be used as a mode name because it conflicts with ` +
      `the .local postfix for .env files.`
    )
  }

  const env = {}

  const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ `.env.local`,
    /** default file */ `.env`
  ]

  for (const key in process.env) {
    if (key.startsWith(prefix) && env[key] === undefined) {
      env[key] = process.env[key]
    }
  }

  for (const file of envFiles) {
    const fullpath = nodepath.join(envDir, file)
    const path = fs.existsSync(fullpath) ? fullpath : undefined

    if (path) {
      const parsed = dotenv.parse(fs.readFileSync(path), {
        debug: !!process.env.DEBUG || undefined
      })

      dotenvExpand({
        parsed,
        ignoreProcessEnv
      })

      for (const [key, value] of Object.entries(parsed)) {
        if (key.startsWith(prefix) && env[key] === undefined) {
          env[key] = value
        } else if (key === 'NODE_ENV') {
          process.env.NODE_ENV = value
        }
      }
    }
  }
  return env
}
module.exports = {
    loadEnv
}
```

## 最后
* 这部分源码还是不复杂，有很多可借鉴的写法
* 如果自己的node项目需要读取环境变量文件，可以根据此配置做迁移

