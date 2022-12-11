---
isTimeLine: true
title: eslint插件开发教程
date: 2020-05-20
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# eslint插件开发教程

开发eslint插件目的：根据项目需要，自定义满足项目特殊需要的校验规则

参考[eslint](https://cn.eslint.org/)官方文档展开阐述
* [插件开发](https://cn.eslint.org/docs/developer-guide/working-with-plugins)
* [自定义规则](https://cn.eslint.org/docs/developer-guide/working-with-rules)
* [单元测试](https://cn.eslint.org/docs/developer-guide/unit-tests)

下面开始通过一个示例demo来介绍插件整个开发流程

**代码中出现的方法及变量的详细解释与相关文档，会在文末给大家列举出来，大家可以先把代码拷贝到自己的demo中然后结合`本文第3部分`的变量｜方法解释去理解代码**

>开发一个校验注释中是否包含指定关键词的插件(`eslint-plugin-comments-key`)

# 1. 环境准备
## 目录结构
```sh
.
├── README.md                   插件介绍文档
├── index.js                    对外暴露插件
├── lib                         
│   └── rules                   自定义规则
│       └── comments-key.js     
├── package.json
└── tests                       测试自定义规则
    └── lib
        └── rules
            └── comments-key.js
```

## 安装依赖
* eslint
* mocha
```bash
npm i eslint mocha -D
```

# 2. 开始编码

## 编写自定义规则
>不包含自定义参数校验规则

**/lib/rules/comments-key.js**

```js
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Not allowed comment words", // 规则的简述
            category: "Stylistic Issues", // 规则分类
            recommended: true //  配置文件中的 "extends": "eslint:recommended"属性是否启用该规则
        }
    },
    create: function (context) {
        // context对象包含与规则上下文相关的信息
        // 返回一个SourceCode对象，你可以使用该对象处理传递给 ESLint 的源代码
        const sourceCode = context.getSourceCode()

        // 定义不被允许出现在注释中的内容
        const notAllowWords = ['fixme', 'xxx']
        return {
            Program(node) {
                // 获取所有注释的节点
                const comments = sourceCode.getAllComments()
                // 遍历注释节点判断是否有不符合规范的
                comments.forEach(comment => {
                    let { loc, value, type } = comment
                    value = value.toLowerCase()
                    let warnWord = ''
                    // 判断注释内容是否包含不被允许的word
                    for (const word of notAllowWords) {
                        if (value.includes(word)) {
                            warnWord = word
                        }
                    }

                    if (warnWord) {
                        context.report({
                            node: comment, // 可选 与问题有关的 AST 节点
                            message: `注释中含有不被允许的字符${warnWord}` // 有问题发出的消息
                        })
                    }
                })
            }
        };
    }
};
```

## 编写测试用例
**/tests/lib/rules/comments-key.js**
```js
const { RuleTester } = require('eslint')

// 获取自定义的规则
const rule = require('../../../lib/rules/comments-key')

// TESTS
// 加入默认配置
const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2018 }
})

const errMsg = warnWord => `注释中含有不被允许的字符${warnWord}`

ruleTester.run('comments-key', rule, {
    valid: [
        '// sssss',
        '// fixdddd',
        `/**
        * 容十三内水s是说
        */`
    ],
    invalid: [
        {
            code: "// fixme: DDL 2020-4-28 测试内容",
            errors: [{ message: errMsg('fixme') }]
        },
        {
            code: "// FIXME: DDL 2020-5-23 测试内容",
            errors: [{ message: errMsg('fixme') }]
        },
        {
            code: `/**
            * xxx
            * 内容
            */`,
            errors: [{ message: errMsg('xxx') }]
        }
    ]
})
```

## 修改package.json
加入
```js
"scripts": {
  "test": "mocha tests/lib/rules"
}
```
运行脚本查看测试结果
```bash
npm run test
```

上面的示例中限定的关键词是在代码中写死了的

通常的场景中如：
```js
rules:{
    "quotes": ["error", "double"], // 只允许双引号
    "no-warning-comments": [ // 不允许注释开头出现 todo｜fixme等内容
        1,
        {
          "terms": [
            "todo",
            "fixme"
          ],
          "location": "start"
        }
      ],
}
```
大多数eslint规则都拥有可配置的属性

我们可以通过`context.options`获取配置的属性

下面示例加入可配置属性，用于自定义关键词的检测(代码中只包含修改部分，其余部分跟前面相同)
```js
module.exports = {
    meta: {
        // ...code
        schema: [ // 指定该选项 这样的 ESLint 可以避免无效的规则配置
            // 遵循 json schema 后文会有介绍文档
            {
                "keyWords": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        ]
    },
    create: function (context) {
        // ...code

        // 定义不被允许出现在注释中的内容

        // 可以使用 context.options检索一个规则的可选项，它是个数组，包含该规则的所有配置的可选项
        
        // console.log(context.options);

        // 取得设置的keywords
        let [argv0] = context.options
        let keyWords = argv0 ? argv0.keyWords ? argv0.keyWords.length > 0 ? argv0.keyWords : undefined : undefined : undefined

        // 没有设置则使用默认的
        let notAllowWords = keyWords || ['fixme', 'xxx']

        // 忽略大小写
        notAllowWords = notAllowWords.map(v => v.toLowerCase())
        // ...code
    }
};
```

## 完善我们的单元测试
```js
// ...code
ruleTester.run('comments-key', rule, {
    valid: [
        '// sssss',
        '// fixdddd',
        `/**
        * 容十三内水s是说
        */`
    ],
    invalid: [
        {
            code: "// fixme: DDL 2020-4-28 测试内容",
            errors: [{ message: errMsg('ddl') }],
            options: [{ // 通过options 配置自定义参数
                keyWords: ['ddl']
            }]
        },
        {
            code: '// FIXME: DDL 2020-5-23 测试内容 \n let a = "232"',
            errors: [{ message: errMsg('fixme') }],
            rules: { // 通过rules  配置eslint提供的一些规则
                "quotes": ["error", "double"],
            },
            options: [{
                keyWords: ['abc', 'efg', 'fixme']
            }]
        },
        {
            code: `/**
            * xxx
            * 内容
            */`,
            errors: [{ message: errMsg('xxx') }]
        },
        {
            code: '// abds asa',
            errors: [{ message: errMsg('abd') }],
            options: [{
                keyWords: ['abc', 'abd']
            }]
        }
    ]
})
```

# 3.文中一些变量｜方法的解释及其文档

* [meta](https://cn.eslint.org/docs/developer-guide/working-with-rules#rule-basics) (object) 包含规则的元数据
  * [schema](https://cn.eslint.org/docs/developer-guide/working-with-rules#options-schemas) 指定该选项 这样的 ESLint 可以避免无效的规则配置
    * 遵循 [json schema](http://json-schema.org/) 规范
* [create](https://cn.eslint.org/docs/developer-guide/working-with-rules#rule-basics) (function) 返回一个对象，其中包含了 ESLint 在遍历 JavaScript 代码的抽象语法树 AST ([ESTree](https://github.com/estree/estree) 定义的 AST) 时，用来访问节点的方法
  * [context](https://cn.eslint.org/docs/developer-guide/working-with-rules#the-context-object) 包含与规则上下文相关的信息
    * [options](https://cn.eslint.org/docs/developer-guide/working-with-rules#contextoptions) 检索一个规则的可选项，它是个数组，包含该规则的所有配置的可选项
    * `getSourceCode()` 返回一个[SourceCode](https://cn.eslint.org/docs/developer-guide/working-with-rules#contextgetsourcecode)对象，你可以使用该对象处理传递给 ESLint 的源代码
      * [getAllComments()](https://cn.eslint.org/docs/developer-guide/working-with-rules#contextgetsourcecode) 获取所有注释节点
        * 每个注释节点的属性
          * `loc` 注释在文档中的位置
          * `value` 注释中的内容
          * `type` 注释的类型 `Block`｜`Line`
    * [report()](https://cn.eslint.org/docs/developer-guide/working-with-rules#contextreport) 它用来发布警告或错误（取决于你所使用的配置）。该方法只接收一个参数，是个对象
      * `message` 有问题的消息提示
      * `node` (可选)与问题有关节点
      * `loc` (可选)用来指定问题位置的一个对象。如果同时指定的了 loc 和 node，那么位置将从loc获取而非node
      * `data` (可选) message的占位符
      * `fix` (可选) 一个用来解决问题的修复函数
* [RuleTester](https://eslint.org/docs/developer-guide/nodejs-api#ruletester) 单元测试示例介绍

**tips:AST在开发插件时不必深入研究，不同地方AST的实现和结构都有所差异**

# 4.导出
至此我们的插件算开发完成了，接下来编写对eslint暴露这个模块的代码

**index.js**
```js
'use strict';
module.exports = {
  rules: {
    'diy': require('./lib/rules/comments-key') 
  },
  rulesConfig: {
    'diy': 1
  }
};
```

# 5.发布npm
要在其它项目中使用的eslint-plugin插件的话，可以把整个插件的根目录拷贝到目标项目的node_modules中或者发布到`npm`中去，其它项目直接通过`npm install` 安装这个依赖

下面介绍发布到npm的步骤

1. 注册npm账号(有的话直接跳过这步骤)

直接点击[官网](https://www.npmjs.com/)注册

2. 设置登陆的账号
登录之前修改registry为原来的,因为国内一般用的镜像源例如淘宝源:https://registry.npm.taobao.org
```bash
npm config set registry https://registry.npmjs.org/
```

```bash
npm login
```
按提示依次输入`账号`,`密码`,`邮箱`


登录完成之后,查看当前npm用户,不报错说明登录成功
```js
npm whoami
```

1. 编写`README.md`方便指引他人使用
2. 修改packgae.json

```json
{
  "name": "eslint-plugin-comments-key",
  "version": "1.0.0",
  "description": "校验注释中是否包含指定关键词的插件",
  "main": "index.js",
  "directories": {
    "lib": "lib",
    "test": "tests"
  },
  "scripts": {
    "test": "mocha tests/lib/rules"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "eslint": "^7.0.0",
    "mocha": "^7.1.2"
  }
}
```
4. 运行`npm publish`发布npm包

至此发布整个流程完毕

# 6.项目中引入

### Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-comments-key`:

```
$ npm install eslint-plugin-comments-key --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-comments-key` globally.

### Usage

Add `comments-key` to the plugins section of your `.eslintrc` configuration file or `package.json`. You can omit the `eslint-plugin-` prefix:

`package.json` demo
```json
"eslintConfig": {
    "plugins": [
      "comments-key"
    ],
    "rules": {
      "comments-key/diy":[1,{
          "wordKeys":["fixme","xxx"]
      }]
    }
}
```

**tips：** 如果编辑器中安装了Eslint插件，在编码的时候就会给予警告⚠️

# 最后
## eslint-plugin-comments-key相关地址
* [npm](https://www.npmjs.com/package/eslint-plugin-comments-key)
* [github](https://github.com/ATQQ/eslint-plugin-comments-key/tree/master)


因笔者水平有限，内容上如有阐述不明白之处，还请斧正

