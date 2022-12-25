---
title: 30行代码实现合并指定目录下的所有文件的内容
date: 2021-06-02
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 30行代码实现合并指定目录下的所有文件的内容

## 背景
临近毕业，肝完论文，指导老师叫把**所有**，**所有**，**所有**的源代码放附录

感到无语（它是不知道前端代码有好多），又无法拒绝

这么多文件，手动CV是不可能手动CV的，咱给它整个脚本，把内容合并到一个文件去，直接插入word

## 准备工作
装个Node环境即可
* [Node](https://nodejs.org/zh-cn/)


## 目标
执行一行如下指令，就搞定目标目录的文件合并
```js
node index.js <target_directory>
```
## 开工
### 获取指令传参
使用process模块，argv属性上表明了所有的参数
```js
const process = require('process')

// 传入的目录
const targetDir = process.argv[2]

console.log(process.argv)
```

测试结果
```sh
node index.js /home/sugar/Documents/VueProject

# 打印结果
[
  '/home/sugar/.nvm/versions/node/v16.0.0/bin/node',
  '/home/sugar/Documents/VueProject/my-blog-vuepress/docs/technology/works/index.js',
  '/home/sugar/Documents/VueProject'
]
```

### 获取指定目录下的所有文件
 
**思路**

咱使用`path`,`fs`模块结合递归搞定:
1. `readdirSync`方法获取所有的文件（包含目录）
2. 通过`isFile`判断是否是文件
3. 使用`path.join`拼接路径

具体实现如下
```js
const path = require('path')
const fs = require('fs')
/**
 * 递归获取指定目录中的所有文件的绝对路径路径
 * @param {string} dir 目标目录
 * @param {string[]} 
 * @returns {string[]} 文件绝对路径数组
 */
function getDirFiles(dir) {
    let result = []
    let files = fs.readdirSync(dir, { withFileTypes: true })
    files.forEach(file => {
        const filepath = path.join(dir, file.name)
        if (file.isFile()) {
            result.push(filepath)
        } else if (file.isDirectory()) {
            result.push(...getDirFiles(filepath))
        }
    })
    return result;
}
```
测试
```js
console.log(getDirFiles('/home/sugar/Documents/VueProject/my-blog-vuepress/docs'));
```
打印结果，能获取到所有的文件的绝对路径
```sh
[
  '/home/sugar/Documents/VueProject/my-blog-vuepress/docs/.vuepress/comment.js',
  '/home/sugar/Documents/VueProject/my-blog-vuepress/docs/.vuepress/components/LeetCode.vue',
  ... 237 more items
]
```

结果中会出现.git，node_modules中的内容，咱**加个过滤逻辑**:
* 使用数组存放，需要排出的目录或文件的相对路径
* 使用`endsWith`方法进行匹配
* `Array.some`方法遍历，符合条件则排除

```js
/**
 * 递归获取指定目录中的所有文件的绝对路径路径
 * @param {string} dir 目标目录
 * @param {string[]} 
 * @returns {string[]} 文件绝对路径数组
 */
function getDirFiles(dir, exclude = []) {
    let result = []
    let files = fs.readdirSync(dir, { withFileTypes: true })
    files.forEach(file => {
        const filepath = path.join(dir, file.name)
        const isExclude = exclude.some(v => {
            return filepath.endsWith(v)
        })
        if (!isExclude) {
            if (file.isFile()) {
                result.push(filepath)
            } else if (file.isDirectory()) {
                result.push(...getDirFiles(filepath, exclude))
            }
        }
    })
    return result;
}
```

### 合并文件目标文件的内容
**思路**:
* 通过`readFileSync`读取指定文件的内容
* 使用`appendFileSync`方法向目标文件追加内容
* 使用`Date.now`生成时间戳，作为目标文件名

具体实现如下
```js
/**
 * 内容并入一个文件中
 * @param {string[]} files 
 */
function mergeFile(files) {
    // 写入的目标文件(时间戳命名)
    const writeFilepath = path.join(__dirname, `${Date.now()}.txt`)
    files.forEach(f => {
        // 文件中的内容
        const txt = fs.readFileSync(f, { encoding: 'utf-8' })
        // 文件的相对路径（注意，这个targetDir是外部变量表示这些文件的公共目录，此行代码主要为获取文件的相对路径）
        const dir = f.slice(targetDir.length + 1)

        // 追加内容的方式
        fs.appendFileSync(writeFilepath, `${dir}\n`)
        fs.appendFileSync(writeFilepath, `${txt}\n\n`)
    })
    console.log('ok', files.length, '个文件');
    console.log(files);
}
```
## 测试
以我[当前的项目](https://github.com/ATQQ/sugar-blog)为例子
```sh
node index.js /home/sugar/Documents/VueProject/my-blog-vuepress
```
结果
```sh
ok 309 个文件
```
![图片](https://img.cdn.sugarat.top/mdImg/MTYyMjYwODQ0MjI5OQ==622608442299)

好家伙，敲了3w多行了

## 完整代码

```js
const process = require('process')
const path = require('path')
const fs = require('fs')

// 传入的目录
const targetDir = process.argv[2]
// 忽略的内容
const ignore = ['node_modules', '.git', 'dist',
 'ignore', 'README.md', '.lock', '.png','docs','.eslintrc.js',
 '.env','LICENSE','tsconfig.json','.github','_tests_']

const files = getDirFiles(targetDir, ignore)

mergeFile(files)

/**
 * 内容并入一个文件中
 * @param {string[]} files 
 */
function mergeFile(files) {
    // 写入的目标文件(时间戳命名)
    const writeFilepath = path.join(__dirname, `${Date.now()}.txt`)
    files.forEach(f => {
        // 文件中的内容
        const txt = fs.readFileSync(f, { encoding: 'utf-8' })
        // 文件的相对路径
        const dir = f.slice(targetDir.length + 1)

        // 追加内容的方式
        fs.appendFileSync(writeFilepath, `${dir}\n`)
        fs.appendFileSync(writeFilepath, `${txt}\n\n`)
    })
    console.log('ok', files.length, '个文件');
    console.log(files);
}

/**
 * 递归获取指定目录中的所有文件的绝对路径路径
 * @param {string} dir 目标目录
 * @param {string[]} 
 * @returns {string[]} 文件绝对路径数组
 */
function getDirFiles(dir, exclude = []) {
    let result = []
    let files = fs.readdirSync(dir, { withFileTypes: true })
    files.forEach(file => {
        const filepath = path.join(dir, file.name)
        const isExclude = exclude.some(v => {
            return filepath.endsWith(v)
        })
        if (!isExclude) {
            if (file.isFile()) {
                result.push(filepath)
            } else if (file.isDirectory()) {
                result.push(...getDirFiles(filepath, exclude))
            }
        }
    })
    return result;
}
```

