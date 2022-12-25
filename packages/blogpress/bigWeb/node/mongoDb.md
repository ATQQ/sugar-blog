---
title: 使用TS封装操作MongoDB数据库的工具方法
date: 2021-05-16
tags:
 - 大前端
 - node.js
categories:
 - 大前端
---
# 使用TS封装操作MongoDB数据库的工具方法
## 前言
在做毕业设计过程中采用了MongoDb存储应用的日志信息，总结了一些CRUD方法与大家分享一下

关于MongoDb的入门教程推荐大家阅读：
>[菜鸟教程: MongoDB](https://www.runoob.com/mongodb/mongodb-tutorial.html)<br>
[菜鸟教程: Node.js 连接 MongoDB](https://www.runoob.com/nodejs/nodejs-mongodb.html)

## 获取数据库链接
```ts
const {
  host, port, user, password, database,
} = mongodbConfig
const url = `mongodb://${user}:${password}@${host}:${port}/${database}`

// 如果没有设置账号与密码，可以省略
// const url = `mongodb://${host}:${port}/${database}`

interface Res {
    db: MongoClient
    Db: Db
}

function getDBConnection(): Promise<Res> {
  return new Promise((res, rej) => {
    MongoClient.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }).then((db) => {
      res({
        db,
        Db: db.db(database),
      })
    }).catch((err) => {
      rej(err)
    })
  })
}
```

使用**Promise**对其进行包装，返回db（连接实例）与DB（数据库实例）

## 包装数据库查询方法
```ts
// 传入的回调函数类型定义
type Callback<T> = (db: Db, resolve: (value: T | PromiseLike<T>) => void) => void

export function query<T>(callback: Callback<T>): Promise<T> {
  const p = new Promise<T>((resolve, rej) => {
    getDBConnection().then(({ db, Db }) => {
      // 执行回调
      callback(Db, resolve)
      // resolve后关闭
      p.catch((e) => rej(e))
        .finally(() => {
          db.close()
        })
    })
  })
  return p
}
```

获取到链接实例，由调用方传入需要执行的回调函数，在执行resolve后自动通过finally中的回调断开数据库的链接

## CRUD
### 插入数据
```ts
function insertCollection<T>(collection: string, data: T[] | T, many = false){
    return mongoDbQuery<InsertOneWriteOpResult<WithId<T>>>((db, resolve) => {
        if (many && Array.isArray(data)) {
            db.collection<T>(collection).insertMany(data as any).then(resolve as any)
            return
        }
        db.collection<T>(collection).insertOne(data as any).then(resolve)
    })
}
```
参数：
1. 目标的数据表名
2. 待插入的数据
3. 是否同时插入多个数据

### 查询数据
```ts
function findCollection<T>(collection: string, query: FilterQuery<T>){
    return mongoDbQuery<T[]>((db, resolve) => {
        db.collection<T>(collection).find(query).toArray().then((data) => {
            resolve(data)
        })
    })
}
```
参数：
1. 目标的数据表名
2. 查询条件

### 更新数据
```ts
function updateCollection<T>(collection: string, query: FilterQuery<T>, data: UpdateQuery<T> | Partial<T>, many = false){
    return mongoDbQuery<UpdateWriteOpResult>((db, resolve) => {
        if (many) {
            db.collection<T>(collection).updateMany(query, data).then(resolve)
            return
        }
        db.collection<T>(collection).updateOne(query, data).then(resolve)
    })
}
```
参数：
1. 目标的数据表名
2. 查询条件
3. 新的数据
4. 是否批量更新

### 删除数据
```ts
function deleteCollection<T>(collection: string, query: FilterQuery<T>, many = false) {
    return mongoDbQuery<DeleteWriteOpResultObject>((db, resolve) => {
        if (many) {
            db.collection(collection).deleteMany(query).then(resolve)
            return
        }
        db.collection(collection).deleteOne(query).then(resolve)
    })
}
```
## 业务调用示例
方法封装好后，业务调用就很简单明了与语义化了，跟直接在mongoDB Shell中写指令一样顺手
```ts
function addUser(userId: string, options = {}) {
  const defaultOptions = {
    nickname: '随机',
    gender: Gender.MALE,
    lastLogin: new Date(),
    loginCount: 0,
    avatar: '/static/logo.png',
  }
  const ops = Object.assign(defaultOptions, options)
  return insertCollection('user', { userId, ...ops })
}

function findUser(user:User) {
  return findCollection<User>('user', user)
}

function updateUserInfo(userId: string, info: User) {
    return updateCollection<User>('user', {
        userId,
    }, {
        $set: info,
    })
}

function deleteUser(userId: number) {
    return deleteCollection<User>('user', { id: userId })
}
```

## 最后
完整源码地址移步[这里](https://github.com/ATQQ/node-server/blob/master/src/lib/dbConnect/mongodb.ts)

