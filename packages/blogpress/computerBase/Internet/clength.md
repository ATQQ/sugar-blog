---
sidebar:
 title: Content-Length
 step: 4
isTimeLine: true
title: Content-Length
date: 2020-04-14
tags:
 - 计算机基础
 - 计算机网络
categories:
 - 计算机基础
---
# Content-Length

>如果响应头Content-Length=0那么是发出来被截取了还是没发出来?
发出来被截取了

* Content-Length比实际的长度大, 服务端/客户端读取到消息结尾后, 会等待下一个字节,无响应直到超时
* Content-Length < 实际长度:首次请求的消息会被截取

**总结**
* Content-Length如果存在且生效, 必须是正确的, 否则会发生异常
* 如果报文中包含Transfer-Encoding: chunked首部, 那么Content-Length将被忽略.

:::tip 参考
[简书:用了这么久HTTP, 你是否了解Content-Length?](https://www.jianshu.com/p/ea12be063b2e)
:::

