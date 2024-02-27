# 我如何使用Coze来分析掘金热榜数据 | Coze插件开发

## 前言
[掘金热榜](https://juejin.cn/hot/collected-articles)想必大家会偶尔扫一扫，看看感兴趣的进行进一步阅读。

![](https://img.cdn.sugarat.top/mdImg/sugar/e873781d6738026921ae38111f8a4019)

文章相关的榜单主要就是`掘金文章榜`，`文章收藏榜`这两个。

>[扣子（coze.cn）](https://www.coze.cn/)是一款用来开发新一代 AI Chat Bot 的应用编辑平台。

![](https://img.cdn.sugarat.top/mdImg/sugar/6c959d43f030a07fb0dfaca615052cfb)

可以理解是 `对话机器人` 定制工厂。

![](https://img.cdn.sugarat.top/mdImg/sugar/f380f324533336c360e8fb25b595a430)

`Coze` 上开放的定制能力主要有 4 个`Bots`，`插件`，`工作流`，`知识库`。

咱们这里要想让机器人读取掘金热榜的数据就要借助插件的能力咯。

**下面进入正题，看看如何把这两者结合起来？**

*想要体验最后效果的可以直接访问这个已经搭建好的机器人：[掘金热榜分析](https://www.coze.cn/store/bot/7339921359969108031?from=bots_card)。*

|                                     页面                                      |                                     效果                                      |
| :---------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/sugar/1bd1e494dd695ac020eb46ef555696e5) | ![](https://img.cdn.sugarat.top/mdImg/sugar/1d5ee81c4478932399eeb7bcad204a7e) |

## 开发插件
### 创建插件
切换到 `个人空间` -> `插件` 目录下，点击创建插件。

![](https://img.cdn.sugarat.top/mdImg/sugar/ef51089c3a2486fdd34151f39a47cf74)

录入 API 信息

![](https://img.cdn.sugarat.top/mdImg/sugar/679de7e34a46396ea04777eb55e1c9ba)

从填的`插件URL`，`Header 列表`，`授权方式`这几项配置我相信大家就能看出 "插件" 本质是什么了。

**没错插件就是一个支持调用的服务端接口**

这里相当于是配置接口调用的 `base 路径` 和 `公共鉴权` 参数

由此咱们可以把一些开放的公共查询接口都可以录入到插件中，比如 [API Hub](https://apifox.com/apihub/) 上收集的公共API。

![](https://img.cdn.sugarat.top/mdImg/sugar/73fc2cc273c1f5c22d358f0d02232029)

这里的 `api.juejin.cn` 就是我在 devTools 中看到（ba）的🤭。

### 创建工具

进入创建的插件后，就可以创建工具了。

![](https://img.cdn.sugarat.top/mdImg/sugar/a2265ab81ab50cc5f921fb266080d666)

*乍一看怎么又有一个新概念，“工具”？打开配置窗口一看就悟了！*

![](https://img.cdn.sugarat.top/mdImg/sugar/4dba81d401be69b5fda62c5603daf8e7)

哦😯，这个**工具就是录入具体的功能API，配置一下具体API的`请求路径，方法，参数`**

下面是配置过程截图
|                                   输入参数                                    |                           输出参数（支持自动解析）                            |                                   调试校验                                    |
| :---------------------------------------------------------------------------: | :---------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/sugar/83ca062018f61c26201b5be01d9e8d29) | ![](https://img.cdn.sugarat.top/mdImg/sugar/031e3432096d19c9f1f8e903991e16cd) | ![](https://img.cdn.sugarat.top/mdImg/sugar/6c0c2526984304d8aa66714691768345) |

### 发布

先发布工具

![](https://img.cdn.sugarat.top/mdImg/sugar/a90fa856a60df0cb64a80d5395a3591a)

再上架插件，就大工告成了，过程中填写的表单都可以AI自动生成辅助填写（美滋滋）。

![](https://img.cdn.sugarat.top/mdImg/sugar/01f487c484c8d6e316e7a479a81640fe)

插件上架后，大家就可以公开使用咯，使用的机器人也能公开。

## 开发bot
### 创建bot
这个就很简单了，主要就是写 "魔法咒语"，过程也有AI辅助。

在创建入口，填写一下机器人的 `名字` 和 `介绍` 即可，`logo` 直接用自动生成。

![](https://img.cdn.sugarat.top/mdImg/sugar/8099d2f705be95b1e20c737cd94599ad)


### 编辑bot

编辑页面长下面这样子，咱们这里主要关注`人设`与`插件`部分即可。

![](https://img.cdn.sugarat.top/mdImg/sugar/e260c84cb2c6180072c9866a4fc55c20)

可以先添加插件，直接搜索咱们开发的插件名即可。

将咱们录入的工具（API） 添加进去即可
![](https://img.cdn.sugarat.top/mdImg/sugar/86832534b77d6ba3204477638ed78db7)


接下来就是写“咒语”，比如我只简单写了下面这一句话：
```txt
你是一个资深的互联网资讯分析师，可以根据用户的需求从掘金热榜中筛选数据，并按要求格式分析输出。
```

然后用`AI优化`功能，就给我扩展完善了。

![](https://img.cdn.sugarat.top/mdImg/sugar/e24f2f6488dbf4038a45b13ef802bb70)

```txt
# 角色
你是一个资深的互联网资讯分析师，可以根据用户的需求从掘金热榜中筛选数据，并按要求格式分析输出。

## 技能
- 从掘金热榜中筛选出符合用户需求的数据
- 对筛选出的数据进行分析
- 按照要求格式输出分析结果

## 限制
- 只能从掘金热榜中筛选数据
- 输出结果必须符合要求格式
```
至此核心部分就完成了，下面可以简单测试一下。

![](https://img.cdn.sugarat.top/mdImg/sugar/524097eb12ea5438b7f8b98b334b61d3)

![](https://img.cdn.sugarat.top/mdImg/sugar/c55b1b104e4e5341cbae7cc2df01b0d1)

## 优化
### 提示词优化
咱们咒语里没有体现查询哪个榜单的数据，默认调用 API 时都是查的综合榜单。

用户在提问的时候可以说查询 后端/Android 等榜单，此时咱们就需要将这些榜单对应的查询参数写到 提示词 里。

向下面这样，这样查询结果更加符合用户需要的榜单数据。
```sh
### 掘金热榜插件参数对照
* 综合：1
* 后端：6809637767543259144
* 安卓：6809635626879549454
```

### 插件优化
API 查询结果中有很多不需要的无关参数，咱们可以使用一层服务对传入参数过滤后再配置到平台上，避免导致结果过大，超出对话上下文限制的 tokens 数量。


## 最后
欢迎大家踊跃[贡献插件](https://www.coze.cn/store/plugin)，理论上配合自定义API，机器人就有无限的可能。

体验文章搭建的[掘金热榜分析机器人](https://www.coze.cn/store/bot/7339921359969108031?from=bots_card)

bot ID；7339921359969108031