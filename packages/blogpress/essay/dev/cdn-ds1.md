# 记一次 CDN 流量被盗刷经历

先说损失，被刷了 70 多RMB，还好止损相对即时了，亏得不算多，PCDN 真可恶啊。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/2aac543c5426b02a67c9666d8ff7a7f4)

600多G流量，100多万次请求。

## 怎么发现的

先是看到鱼皮大佬发了一篇推文突发，[众多网站流量被盗刷！我特么也中招了](https://mp.weixin.qq.com/s/XZMLMqgF_gv_QNNrfHvoPQ)。

抱着看热闹的心情点开阅读了。。。心想，看看自己的中招没，结果就真中招了 🍉。

## 被盗刷资源分析
笔者在 `缤纷云`，`七牛云`，`又拍云` 都有存放一些图片资源。本次中招的是 `缤纷云`，下面是被刷的资源。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/4f293f2ddd706c756b8883abc9328bed)

### IP来源
查了几个 IP 和文章里描述的大差不差，都是来自山西联通的请求。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/1df53e3628e0745216e4c7fb452dde07)

### 大小流量计算
按日志时间算的话，QPS 大概在 20 左右，单文件 632 K，1分钟大概就760MB ，1小时约 45G 左右。

看了几天前的日志，都是 1 小时刷 40G 就停下，从 9 点左右开始，刷到 12 点。

|                                      07-09                                      |                                      07-08                                      |
| :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
| ![](https://cdn.upyun.sugarat.top/mdImg/sugar/80abd2526ecf3503e474860f2f6f489e) | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/c5723480c12c5aca0faf18b390f27462) |

但是 10 号的就变多了，60-70 GB 1次了。也是这天晚上才开始做的反制，不知道是不是加策略的时候影响到它计算流量大小了 😝。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/ad0abdef680288a55ad2ec4587339985)

## 反制手段

### Referer 限制

通过观察这些资源的请求头，发现 `Referer` 和请求资源一致，通常情况下，不应该这样，应该是笔者的博客地址`https://sugarat.top`。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/c6a33d8aa82bea53371ec92e3acaf469)

于是第一次就限制了 `Referer` 头不能为空，同时将 `cdn.bitiful.sugarat.top` 的来源都拉黑。

这个办法还比较好使，后面的请求都给 403 了。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/8e0934d612bc6884552d6c84a286bce4)

但这个还是临时解决方案，在 V 站上看到讨论，说资源是人为筛选的，意味着 Referer 换个资源还是会发生变化。

### IP 限制

有 GitHub 仓库 [unclemcz/ban-pcdn-ip](https://github.com/unclemcz/ban-pcdn-ip) 收集了此次恶意刷流量的 IP。

CDN 平台一般支持按 IP 或 IP 段屏蔽请求（虽然后者可能会屏蔽一些正常请求），可以将 IP 段配置到平台上，这样就能限制掉这些 IP 的请求。

缤纷云上这块限制还比较弱，我就直接把缤纷云的 CDN 直接关了，七牛云和又拍云上都加上了 IP 和 地域运营商的限制，等这阵风头过去再恢复。

|                                     七牛云                                      |                                     又拍云                                      |
| :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
| ![](https://cdn.upyun.sugarat.top/mdImg/sugar/2575c2b78175405f64fd2c63026c349c) | ![](https://cdn.upyun.sugarat.top/mdImg/sugar/731ae02b64e7e5fdf0fb38076249ccca) |

### 限速

限制单 IP 的QPS和峰值流量。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/48e0434cdeba4e8fd1b95a18c7a48405)

但是这个只能避免说让它刷得慢一点，还是不治本。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/d1722bb89b9a6375dc121ba836cba8bb)


## 最后

用了CDN的话，日常还是多看看，能加阈值控制的平台优先加上，常规的访问控制防盗链的啥的安排上。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/fbb1b5771c16c9d715c026e5aa2154b7)