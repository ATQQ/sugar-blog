---
title: 在linux-deepin上使用deepin-wine5完美运行腾讯会议/QQ/微信等此类应用
date: 2021-05-20
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 在linux-deepin上使用deepin-wine5完美运行腾讯会议/QQ/微信等此类应用

## 效果
捣鼓了一下午，终于把腾讯会议整好了

咱先上效果免得说骗人

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTUyNDAxNTE2NA==621524015164)

* 腾讯会议:支持屏幕共享、语音、录屏等等
* QQ/微信:常用功能均可用

笔者是用的deepin-15.11，如果是其它linux发行版，请先安装deepin-wine5

如果是deepin用户，先看看是否有deepin-wine5环境

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTUyNDI0Mzk1NA==621524243954)


没试用过其它发行版，各位如不是deepin，不妨也可试试看
## 开始
### 安装deepin-wine5
添加源
```sh
sudo vim /etc/apt/sources.list
```

加入下述内容

```sh
deb [by-hash=force] https://community-packages.deepin.com/deepin/ apricot main contrib non-free
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTUyNDQyODMyMA==621524428320)

更新源
```sh
sudo apt update
```

安装deepin-wine5
```sh
sudo apt install deepin-wine5
```

安装完后,查看是否安装成功
```sh
deepin-wine5 --version
```

### 安装腾讯会议
添加deepin-wine移植的仓库地址
```sh
wget -O- https://deepin-wine.i-m.dev/setup.sh | sh
```

更新源信息
```sh
sudo apt-get update
```

安装腾讯会议
```sh
sudo apt-get install com.tencent.meeting.deepin
```

其它应用的名称请前往 [此链接](https://deepin-wine.i-m.dev/) 查看，如：
* QQ：com.qq.im.deepin
* 微信：com.qq.weixin.deepin

大工告成，**重启一下系统**就找到菜单中的相应的运行图标了

## QA
### 没有运行的图标
如重启系统仍然在菜单中找不到，那采用手动的方式

手动进入安装目录

记得**替换user**为你自己的用户名
```sh
/home/user/.deepinwine/Deepin-WeMeet/drive_c/Program Files/Tencent/WeMeet
```

运行
```sh
deepin-wine5 wemeetapp.exe
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyMTUyNTEzNTA3OA==621525135078)


如果过程中遇到问题的老哥，欢迎评论区交流

## 参考
* [Github:zq1997/deepin-wine](https://github.com/zq1997/deepin-wine)
* [简书:记录完整的在Ubuntu 20.04下使用deepin-wine5安装微信3.0的过程](https://www.jianshu.com/p/6740f6c73033)

