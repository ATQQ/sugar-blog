---
title: Mac上抓包秒通关羊了个羊
date: 2022-09-19
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# Mac上抓包秒通关羊了个羊

最近这游戏是火得不行，睡前玩几把，几天了从未通过。那只能上科技了。。。

## 前言

看网上**大部分是 Windows 微信小游戏**的抓包教程通关文章，因为Mac微信不支持小游戏（尴尬了。）

对于真机抓包的话，高版本Android配置CA太麻烦（Root），相信 大部分都是10左右的安卓

手里只有台Mac，那咱就直接用 Mac 配安卓模拟器搞定抓包（`Whistle` + `MuMu`）

PS：文中有最终演示视频

## 工具介绍&使用
### Whistle

[whistle](https://github.com/avwo/whistle)，是基于 Node 实现的跨平台抓包调试工具

对咱前端同学比较友好，安装配置都很简单

安装
```sh
npm i -g whistle
```
启动

```sh
w2 start
```
访问 `http://localhost:8899/#network` 即可看到 

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2NjE2NzMwMg==663566167302)

然后就是配置CA证书，参照[官方文档: Mac安装根证书](http://wproxy.org/whistle/webui/https.html)，这里不再赘述（CV），只有几个步骤1分钟就能完成配置。

获取一下ip，后面会用到
```sh
172.30.43.170
```
![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2NjIyNjg3MQ==663566226871)

### MuMu

[MuMu模拟器](https://mumu.163.com/mac/index.html) 网易出品的安卓模拟器（Android6），在Mac上运行稳定，用来娱乐或者开发调试都还是比较方便

安装就是官网下载，一顿下一步就行，下面介绍模拟器中的配置（当然大家装完后把微信安装并登录上）

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2NjQ3NjE0NA==663566476144)

登录微信后，咱就开始配置CA证书

先配置模拟器网络，添加代理，IP就是咱们前面获取的本机ip

长按Wifi名  => 修改网络 => 代理（手动） 

输入本机ip，端口`8899`，whistle使用

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2NjY4ODc0Ng==663566688746)

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2NjU0MzE4OQ==663566543189)

使用浏览器访问 `rootca.pro` 安装CA证书 

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU4NjA4MjIzNQ==663586082235)

配置完毕，不出意外的话，咱们打开羊了个羊就看见网络请求了

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2NzAxMDc0MQ==663567010741)

## 方案1：修改关卡数据
咱把第二关的数据改成第一关，享受游戏的乐趣

点击加入羊群（开始游戏），可以看到两个接口  /maps/xxxx.txt

”PS:如果看到的是一个就操作删除羊了个羊小程序，重新打开“

返回的就是游戏地图数据

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2ODA2MDg4MQ==663568060881)

好家伙：第二关比第一关的数据多了不是点吧点

下面开始一顿操作修改关卡数据

1. 复制第一关的数据，添加到whistle Values 面板

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2OTM2OTcyNw==663569369727)

2. 添加转发规则，在whistle Rules 面板操作

```sh
^cat-match-static.easygame2021.com/maps/***.txt$ resBody://{羊1}
```
![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2OTk5OTIxNQ==663569999215)

3. 删除小游戏重新进入

”羊了个羊“会使用已经拉取的关卡数据，不会重复请求，所以需要删除，重新进入

再次打开即可看见，2关都是用的咱们修改后的数据

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2OTczNTA0Mg==663569735042)

下面是演示录屏
<video controls style="width:100%;" src="https://img.cdn.sugarat.top/mdImg/MTY2MzU4MTkxODU3Mw==羊了个羊.mp4"></video>

## 方案2：直接调用成功接口
* ~~接口1：`https://cat-match.easygame2021.com/sheep/v1/game/game_over?rank_score=1&rank_state=1&rank_time=40&rank_role=1&skin=1`~~ 过了一天换接口了
* 接口2：POST https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex
* 鉴权：request header 上的 t 参数，扒拉下来就能用
![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU2NzI2NzkzNA==663567267934)

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU4MjE5MjQwNw==663582192407)

使用 whistle 直接发起请求

选择目标请求
![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU4MjM5Nzk2OQ==663582397969)

修改参数，点击右上角小飞机发起请求

![图片](https://img.cdn.sugarat.top/mdImg/MTY2MzU4NjIyMjcyNQ==663586222725)


## 最后
Whistle 这个工具真的很好用，再次安利一下

如果上述方法有问题，欢迎评论区交流

