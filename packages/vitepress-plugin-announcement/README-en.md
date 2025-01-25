# vitepress-plugin-announcement

[简体中文](./README.md) | English

![](https://cdn.upyun.sugarat.top/mdImg/sugar/7af94a65e3b4dd05e61e3411daba7fdd)

*article：[VitePress 公告插件开发实记](https://sugarat.top/technology/works/vitepress-plugin-announcement.html) · [archive](https://web.archive.org/web/20240921095008/https://sugarat.top/technology/works/vitepress-plugin-announcement.html) · [translated](https://sugarat-top.translate.goog/technology/works/vitepress-plugin-announcement.html?_x_tr_sl=zh-CN&_x_tr_tl=en&_x_tr_hl=zh-CN&_x_tr_pto=wapp)*

## Usage
Install dependencies `pnpm/npm/yarn`
```sh
pnpm add vitepress-plugin-announcement
```

use the plugin in the `.vitepress/config.ts` configuration file

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: {
    // ↓↓↓↓↓
    plugins: [
      AnnouncementPlugin({
        title: '公告',
        body: [
          { type: 'text', content: '👇公众号👇 ---👇 赞赏 👇' },
          {
            type: 'image',
            src: 'https://cdn.upyun.sugarat.top/mdImg/sugar/85c9554d023be2fcc5aab94effeef033',
            style: 'display: inline-block;width:46%;padding-right:6px'
          },
          {
            type: 'image',
            src: 'https://cdn.upyun.sugarat.top/mdImg/sugar/54eacf3e730af9c1e3542a4800a422ea',
            style: 'display: inline-block;width:46%;padding-left:6px'
          }
        ],
        footer: [
          {
            type: 'text',
            content: 'footer content'
          },
          {
            type: 'button',
            content: '作者博客',
            link: 'https://sugarat.top'
          },
          {
            type: 'button',
            content: '博客主题',
            link: 'https://theme.sugarat.top',
            props: {
              type: 'success'
            }
          },
        ],
      })
    ]
    // ↑↑↑↑↑
  }
})
```

## More Usage
### show once
*tip: next time the configuration is modified to show*

```js
AnnouncementPlugin({
  duration: -1
})
```
### reopen
```js
AnnouncementPlugin({
  reopen: false
})
```

### twinkle
```js
AnnouncementPlugin({
  twinkle: true
})
```

### button
```js
AnnouncementPlugin({
  title: '公告',
  body: [
    {
      type: 'button',
      content: '博客主题',
      link: 'https://theme.sugarat.top',
      props: {
        type: 'success'
      }
    },
  ],
})
```

### rewrites style
inline style
```js
AnnouncementPlugin({
  title: '公告',
  body: [
    {
      type: '',
      content: '',
      // ↓↓↓↓↓
      style: 'color: #000; font-size: 16px;'
      // ↑↑↑↑↑
    }
  ]
})
```

inline style tag
```js
AnnouncementPlugin({
  style: `.theme-blog-popover a {
      color: var(--vp-c-brand-2);
   }
  `
})
```
### markdown
`content`,`title` support markdown syntax
* `# title` title
* `[link](url)` link
* `**strong**` bold
* `*italic*` italic

```js
AnnouncementPlugin({
  title: '公告',
  body: [
    {
      type: 'text',
      content: '**加粗的内容 *斜体[链接](url)***'
    },
  ]
})
```

## Full configuration
```ts
import type { Ref } from 'vue'
import type { Route } from 'vitepress'

export interface AnnouncementOptions {
  /**
   * @example
   * ```css
   * .theme-blog-popover a {
   *    color: var(--vp-c-brand-2);
   * }
   * ```
   */
  style?: string
  title: string
  body?: Announcement.Value[]
  footer?: Announcement.Value[]

  /**
   * @default false
   * @doc https://vitepress.dev/guide/ssr-compat#clientonly
   */
  clientOnly?: boolean

  /**
   * showtime duration
   *
   * -1 once before close；>= 0 every times， auto close，0 not close
   *
   * when the configuration changes, this rule will be triggered again
   * @default 0
   */
  duration?: number

  /**
   * @default false
   */
  mobileMinify?: boolean

  /**
   * 支持重新打开（右上角 icon 悬浮）
   * @default true
   */
  reopen?: boolean

  /**
   * @default false
   */
  twinkle?: boolean

  icon?: string

  closeIcon?: string

  /**
   * Custom display strategy
   * @param to target route
   */
  onRouteChanged?: (to: Route, show: Ref<boolean>) => void

  /**
   * i18n
   */
  locales?: Record<string, Omit<AnnouncementOptions, 'locales'>>
}

export declare namespace Announcement {
  export interface Title {
    type: 'title'
    content: string
    style?: string
  }

  export interface Text {
    type: 'text'
    content: string
    style?: string
  }

  export interface Image {
    type: 'image'
    src: string
    style?: string
  }

  export interface Button {
    type: 'button'
    link: string
    content: string
    style?: string
    props?: {
      type: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'text' | 'default'
    }
  }

  export type Value = Title | Text | Image | Button
}
```

## Thanks
The style references the [reco-1.x theme](https://github.com/vuepress-reco/vuepress-theme-reco-1.x) [@vuepress-reco/vuepress-plugin-bulletin-popover](https://github.com/vuepress-reco/vuepress-theme-reco-1.x/tree/master/packages/%40vuepress-reco/vuepress-plugin-bulletin-popover) plugin.