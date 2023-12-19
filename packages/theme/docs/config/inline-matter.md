---
description: 介绍Vitepress内置常用能力
title: VitePress - 常用配置
tag:
 - 配置
sticky: 5
---

# 文章配置
介绍常用的一些 官方默认主题 提供的能力: 
* https://vitepress.dev/guide/markdown
* https://vitepress.dev/reference/site-config

## outline
* Type: `number | [number, number] | 'deep' | false`
* Default: `2`

设置文章自动生成的目录，和 [config.themeConfig.outline](https://vitepress.dev/reference/default-theme-config#outline) 表现一样，文章里单独设置的优先级更高

```md
---
# 取二三级标题生成目录
outline: [2,3]
---
```

![](https://img.cdn.sugarat.top/mdImg/MTY3NzE2MzY5MzMyMA==677163693320)

## cleanUrls
:::warning 需要服务器支持
要使用 VitePress 提供干净的 URL，需要服务器端支持。

详见：[generating-clean-url](https://vitepress.dev/guide/routing#generating-clean-url)
:::

默认情况下，VitePress 解析以 `.html` 结尾的 URL 的入站链接。但是，某些用户可能更喜欢不带 `.html` 扩展名的“干净 URL” - 例如， `example.com/path` 而不是 `example.com/path.html` 。

可以先通过修改 VitePress 配置在购建时支持将路由处理成无 `.html` 后缀
```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  // 详见：https://vitepress.dev/reference/site-config#cleanurls
  cleanUrls: true,
})
```

紧接着是修改服务端的配置，下面是常用的平台配置

::: code-group
```sh [Nginx]
location / {
   try_files $uri $uri/ $uri.html /404.html;
}
```

```json [Vercel]
{
  "cleanUrls": true
}
```
:::danger 如果不配置 VitePress cleanUrls 又想没有后缀的路由能够正常访问？
只需要配置服务端配置即可
:::