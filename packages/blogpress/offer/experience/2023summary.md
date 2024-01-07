---
outline: [2,3]
cover: https://img.cdn.sugarat.top/mdImg/MTcwNDAwMzUwMzY3OA==704003503678
description: 时间不在于你拥有多少，而在于你怎样使用
sticky: 10
date: 2024-01-01
tag: 
 - 心得总结
---
# 2023年度总结

**“时光啊，就像潮水，它带来一切，也能带走一切” - 佐伊**

**时间不在于你拥有多少，而在于你怎样使用 - 艾克”**

这是今年听得最多的几句与时间相关的句子了，O(∩_∩)O😄。

这不又到年末了，let me look look🧐 3202 年看看留下了什么。。。

## 工作
仍在 ”开水团“ 搬砖，工作内容有一些变化，项目越来越具有挑战！

*对笔者工作内容上一些技术细节感兴趣的同学可以小窗交流，一起进步。*

### 做什么
#### DevOps
**面向大前端的 `DevOps` 平台**，将分散的多平台能力整理聚合起来，统一标准的研发流程，降低用户的上手成本。

详细内容可以看前几天整理的对外的文章 [美团到店终端从标准化到数字化的演进之路](https://mp.weixin.qq.com/s/mSGokHYAt7pmf9wc6ZmPQw)。

*这个方向还是比较有前景的，能做的事非常的多，有深度有广度，其中良好的系统架构设计是最重要的，能保证系统未来长久的可维护迭代。*

#### 灰度
**Web前端页面的灰度**，由于种种原因，团队负责的前端 CI/CD 系统需要做灰度的系统架构升级，以应对未来的变化和应用接入。

主要内容是做底层网关的升级，灰度能力还是比较常规的（百分比，cookie，query，用户白名单），平替之前的灰度能力。

*灰度能力主要是降低异常影响范围，减小异常带来的损失。*

#### 低代码
**面向B端中后台系统的搭建系统**，基于 [阿里开源 - LowCodeEngine](https://lowcode-engine.cn/index) 做上层的应用建设。

低代码对于常规的四表一局（表单，表格，列表，图表，常规布局）页面还是很有杀伤力了，拖拽开发，上线部署效率都比 procode 高。

*这个没什么说的，DDDD*

### 变化
由于组织的调整以及个人的选择，直属上级也发生了一些变化。

不同的”老板“，做事风格，侧重点大不相同，当然也额外会带来新的机会和不确定的磨合成本。

*上述的几项工作内容，恰好是不同老板带来的不同机会👍🏻。*


## 内容创作
今年主要还是在[掘金](https://juejin.cn/user/1028798615918983)，[公众号](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA4ODMyMTk5OA%3D%3D&action=getalbum&album_id=2744191050839457793#wechat_redirect)，[个人博客](https://sugarat.top/)三个渠道发文，相比往年的频率更高了（主要还是[技术周刊](https://juejin.cn/column/7187956135570194491)有稳定的频率），技术性的干货文章倒不是很多。

### 写作
本年度纯技术相关的原创文章大约10篇左右，由于今年重构了博客，所以有一大部分都是 VitePress 相关的。

其次由于工作确实太忙了，虽吸收了很多东西，产出了很多方案，但缺少时间，将其沉淀为一篇技术经验的文章和大家分享（这部分就留到24年整理咯）。

### 周刊
23年一共 52 周，总共输出了 49 期（五一，国庆，元旦🕊了）😋。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAxMDU4OTUwMQ==704010589501)

明年再接再厉，只多不少，同时结构内容做做优化。

### 课程
上半年受掘金运营同学的邀请，撰写了一本免费的掘金小册[《Node.js 入门教程》](https://juejin.cn/book/7304230207953567755)，用户反馈挺好的。

截止当前有 2700+ 的人加入了”收藏“学习。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAxMDk1MTUwNg==704010951506)

*明年有时间&机会的话再整些免费的课程😋。*

### 数据
|                                  掘金                                   |                                 公众号                                  |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTcwNDAxMjQ0MzY0MA==704012443640) | ![](https://img.cdn.sugarat.top/mdImg/MTcwNDAxMjYxNjMxMQ==704012616311) |

*稳定的慢慢的增长ღ( ´･ᴗ･` )，希望明年能翻个倍吧*

## 开源
先看一下 GitHub 的数据，今年和去年水得差不多。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAxMjgxMTUxMQ==704012811511)

再[看看价值](https://github-worth.vercel.app/)😝（1700$）：

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAxMjk4OTMyMg==704012989322)

主要维护的几个项目 Star 情况如下（相比去年增长趋势更高）。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAyOTM5OTY2Mg==704029399662)

下面简单介绍几个笔者还觉得做得不错的项目。

### Web应用/EasyPicker
>附上作品 [介绍文档](https://docs.ep.sugarat.top/)

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAzMDA2MzM0NQ==704030063345)

>这个项目是大学时期的作品，主要场景就是收发文件，相信大家大学时期都被收发文件多少折磨过，这个项目相信是能解放双手的。


今年大大小小一共更新了 6 个版本。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAzMTM3NjI5NQ==704031376295)

今年的话，仍靠用户的口口相传，注册用户增长100+，访问数据也还比较可观（虽然免费试用，但和打赏的收入基本平衡）。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAzMDk1MjcyMQ==704030952721)

### VitePress主题|[@sugarat/theme](https://theme.sugarat.top/)

如题，这是一个 VitePress 的博客主题，也是今年投入时间比较多的一个项目。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAzMjA0MDIzOA==704032040239)

大大小小的一共发了 69 个版本。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAzMTk2MDU3NA==704031960574)

### 其它
#### [@sugarat/cli](https://github.com/ATQQ/tools/tree/main/packages/cli/dynamic-cli/core)

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAzMjI2ODY2MQ==704032268661)

这个项目主要是基于 Commander 做了一个的插件化的 CLI（主要是将个人常用的一些场景能力做了命令行的封装，”解放双手“）。

目前主要有[@sugarat/cli-plugin-blog](https://github.com/ATQQ/tools/tree/main/packages/cli/dynamic-cli/plugins/cli-plugin-blog)，[@sugarat/cli-plugin-ep](https://github.com/ATQQ/tools/tree/main/packages/cli/dynamic-cli/plugins/cli-plugin-ep) 两个插件

前者主要用于我日常文章的自动创建与各平台文章的自动格式化。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAzMjQwMDE0OQ==704032400149)

后者主要用于 [EasyPicker](https://docs.ep.sugarat.top/) 项目的 [一键部署](https://docs.ep.sugarat.top/deploy/online-new.html)。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAzMjU2MzE0Nw==704032563147)


#### [uni-vue3-ts-template](https://github.com/ATQQ/uni-vue3-ts-template)

这个就是一个 uni-app CLI版的开发模板，集成了常用的工程能力，开箱即用。

---

*欢迎对笔者项目感兴趣的同学小窗交流*

## 生活

### 健康
今年体检情况比去年好一点。

但今年去医院复查身体（多年前住院做过手术），不太乐观，有一些恶化的情况，因此又加了一味常吃的药。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAzMzk2NzgyMg==704033967822)

*家人们保重身体，除了常规体检也多关注一下心血管方面的健康问题*

### 环境
`外部的变化 + 个人的决定 + 新的机会` => 我从 北京 回到了 成都。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAwODg3MjQ0Ng==704008872446)

*定了当天最早的机票溜溜，* 工作正式告别了北京这座城市，有得有失吧。

*不过回了成都后还是觉得自己选择是明智的，日子滋润多了，烟火气息比北京强了不止一星半点，离家也是更近了。*

昔日的同学&好友也大部分在这座城市，周末聚一聚也方便。

### 住所

今年上半年买了一个小房子（1居室）了，下半年装修，刚好赶在年前搬进了新家。

![](https://img.cdn.sugarat.top/mdImg/MTcwNDAwMzUwMzY3OA==704003503678)

*上图（左一），是新入手的一个32寸的2k显示器（1k多点，比较实惠）。*

## 总结

这一年值得纪念事很多，又多了许多的“第一次”经验。

最值得关注的还是**健康**，只有身体好了，才有精力去做更多的事情。

*希望明年能有更多的收获，也希望自己能有更多的成长。*

## Next

* 坚持写作；
* 保持长期学习的习惯；
* 持续开源，多分享；
* 健康乐观的生活。

**祝愿大家2024年诸事顺遂。** 

支付宝口令红包（base64） **“Mjc5MjIxMzI=”**