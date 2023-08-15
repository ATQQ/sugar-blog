# vitepress-plugin-rss

English | [简体中文](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-rss/README-zh.md)


## Usage

```sh
pnpm add vitepress-plugin-rss
```

use in `.vitepress/config.mts`

```ts
import { RssPlugin, RSSOptions } from 'vitepress-plugin-rss'
const baseUrl = 'https://sugarat.top'
const RSS: RSSOptions = {
  title: '粥里有勺糖',
  baseUrl,
  description: '你的指尖,拥有改变世界的力量（大前端相关技术分享）',
  id: baseUrl,
  link: baseUrl,
  language: 'zh-cn',
  image: 'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
  favicon: 'https://sugarat.top/favicon.ico',
  copyright: 'Copyright (c) 2018-present, 粥里有勺糖',
  url: `${baseUrl}/feed.rss`
}

export default defineConfig({
  vite: {
    plugins: [RssPlugin(RSS)]
  }
})
```