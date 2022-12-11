---
isTimeLine: true
title: DNS预解析
date: 2020-04-14
tags:
 - 大前端
 - 性能优化
categories:
 - 大前端
---
# DNS 预解析

DNS预解析是浏览器试图在用户访问链接之前解析域名

## 如何启用?

**X-DNS-Prefetch-Control**:``on``|``off``
```html
<meta http-equiv="x-dns-prefetch-control" content="off">
```
## 使用示例
```html
<!-- 打开DNS预解析 -->
<meta http-equiv="x-dns-prefetch-control" content="no">
<!-- 强制查询特定主机名 -->
<link rel="dns-prefetch" href="//sugarat.top">
```

