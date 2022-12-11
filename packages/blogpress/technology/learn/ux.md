---
title: 为什么'\x1B'.length===1？\x与\u知识延伸
date: 2021-10-04
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 为什么'\x1B'.length === 1？\x与\u知识延伸

## 背景
先讲一下背景，再说原因

大多数库都会在日志中使用`chalk`库为console的内容进行上色

被`chalk`处理后，其原本的内容会被‘\x1B...’所包裹
```js
console.log(chalk.blue('green'));
console.log([chalk.blue('green')]);
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzE1NzQ3MjA5OQ==633157472099)

在开发[vite-plugin-monitor](https://github.com/ATQQ/vite-plugin-monitor)时，为了获取原始的日志内容（上色之前），需要将上色后的字符串还原
```sh
\x1B[34mgreen\x1B[39m => green
```

在使用正则处理内容的时候发现了一个问题
```js
'\x1B'.replace(/\\x/,'') // 结果？？
```

通过`.length`查看其长度，结果就如标题所示

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzE1ODMwMzk5Ng==633158303996)

## 原因
反斜杠`"\"`通常标识转义字符，如`\n(换行符)`,`\t(制表符)`

而`\x`就标识16进制，后面跟上两位16进制数

与此同时还有`\u`也是标识16进制，但其后面需跟上4位16进制数

因此这里的`\x1B`实际上就是一个字符

```js
'\x41' === 'A'   // true
'A' === '\u0041' // true
```

## \x
`\xhh`匹配一个以两位十六进制数（`\x00`-`\xFF`）表示的字符

主要用于[ASCII码](https://tool.oschina.net/commons?type=4)的表示

```js
'\x41' === ‘A’
'A' === String.fromCharCode(65)

'\x61' === ‘a’
'a' === String.fromCharCode(97)
```
`\x`后必须跟着两位16进制的字符，否则会报错，其中 `A`-`F` 不区分大小写

```js
'\x1' // Uncaught SyntaxError: Invalid hexadecimal escape sequence
'\xfg' // Uncaught SyntaxError: Invalid hexadecimal escape sequence
```

## \u
`\uhhhh`匹配一个以四位十六进制数（`\u0000`-`\uFFFF`）表示的 Unicode 字符。

在正则表达式中常见于匹配中文字符
```js
const r = /[\u4e00-\u9fa5]/
r.test('中文') // true
r.test('English') // false
```

## 常规字符与Unicode字符互转
### str2Unicode
1. 使用`String.prototype.charCodeAt`获取指定位置的 Unicode 码点（十进制表示）
2. 使用`String.prototype.toString`将其转为十六进制字符,转为16进制字符不会自动补0
3. 通过`String.prototype.padStart`进行补`0`

编写的通用处理方法如下
```js
function str2Unicode(str) {
    let s = ''
    for (const c of str) {
        s += `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`
    }
    return s
}

str2Unicode('1a中文') // '\\u0031\\u0061\\u4e2d\\u6587'
```

### unicode2Str
1. 通过正则`/\\u[\da-f]{4}/g`匹配出所有的unicode字符
2. 使用`Number`将`0x${matchStr}`转换为10进制数
3. 使用`String.fromCodePoint`将unicode码点转为字符
4. 使用`String.prototype.replace`进行逐字符的转换

```js
function unicode2Str(str) {
    const unicodeList = str.match(/\\u[\da-f]{4}/g) || []
    return unicodeList.reduce((pre, u) => {
        return pre.replace(u, String.fromCodePoint(Number(`0x${u.slice(2)}`)))
    }, str)
}

unicode2Str('1\\u0061\\u4e2d文') // 1a中文
```

## 还原chalk处理后的字符串
自己从0-1写一个正则难免会有许多边界情况考虑不周全，于是在chalk的README中找到了[chalk/ansi-regex](https://github.com/chalk/ansi-regex)这个库

可以将色值相关的 `ANSI转义码` 匹配出来
```js
import ansiRegex from 'ansi-regex';

'\u001B[4mcake\u001B[0m'.match(ansiRegex());
//=> ['\u001B[4m', '\u001B[0m']

'\u001B[4mcake\u001B[0m'.match(ansiRegex({onlyFirst: true}));
//=> ['\u001B[4m']
```
编写一下处理方法

```js
function resetChalkStr(str) {
    return str.replace(ansiRegex(), '')
}
```
测试
```js
console.log(chalk.green('green'), chalk.greenBright('greenBright'));

console.log([chalk.green('green'), chalk.greenBright('greenBright')]);

console.log(resetChalkStr(`${chalk.green('green')} ${chalk.greenBright('greenBright')}`));
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYzMzMzMzExNzEzOA==633333117138)

## 总结
重拾了一下`\x`与`\u`相关的内容，突然额外想到一个点，使用\u去做字符串的加解密(下来再捋一捋)

解决了一个`chalk`相关的问题“还原终端中的彩色内容”

