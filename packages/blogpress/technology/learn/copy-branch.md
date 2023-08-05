# 实现一个快速复制当前分支的CLI

## 前言
在工作中，协作场景下，避免不了要告诉同事你当前的开发分支，通常情况下需要2步

① 查看当前分支
```sh
git branch
```

这里还有个case，分支多的话需要翻页查看，才能找到当前分支

![](https://img.cdn.sugarat.top/mdImg/MTY5MTI0NTYxOTQzMw==691245619433)

要准确获取需要加上`--show-current`参数

```sh
git branch --show-current
```

② 鼠标右键复制当前分支

本文就实现一个 Node CLI 来帮助大家节省时间，实现一步到位

![](https://img.cdn.sugarat.top/mdImg/MTY5MTI0NTc5MDM2OQ==691245790369)

## 核心原理

## CLI实现

## 最后
CLI 通过 npm 发布了，大家可以按照如下方式使用

```sh
npx bcy
# 或
npm i bcy -g
bcy
```

关于包名的由来如下

*包名实在是难取，简单语义化一点的都被占用了，让GPT 辅助了一下*

![](https://img.cdn.sugarat.top/mdImg/MTY5MTI0NTI4NDAxNQ==691245284015)

最后用了搜了一圈不重复的只有`bcy`