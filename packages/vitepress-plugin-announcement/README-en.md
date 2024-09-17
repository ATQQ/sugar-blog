# vitepress-plugin-announcement

[简体中文](./README.md) | English

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
          { type: 'text', content: '下方插入了二维码' },
          {
            type: 'image',
            src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210~fmt.webp'
          },
          {
            type: 'button',
            content: '作者博客',
            link: 'https://sugarat.top'
          },
        ],
        footer: [
          {
            type: 'text',
            content: '底部内容'
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

## Full configuration
```ts
import type { Ref } from 'vue'
import type { Route } from 'vitepress'

export interface AnnouncementOptions {
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
    props?: any
  }

  export type Value = Title | Text | Image | Button
}
```

## Thanks
The style references the [reco-1.x theme](https://github.com/vuepress-reco/vuepress-theme-reco-1.x) [@vuepress-reco/vuepress-plugin-bulletin-popover](https://github.com/vuepress-reco/vuepress-theme-reco-1.x/tree/master/packages/%40vuepress-reco/vuepress-plugin-bulletin-popover) plugin.