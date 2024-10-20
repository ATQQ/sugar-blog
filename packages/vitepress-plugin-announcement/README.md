# vitepress-plugin-announcement

[English](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-announcement/README-en.md) | 简体中文

![](https://cdn.upyun.sugarat.top/mdImg/sugar/7af94a65e3b4dd05e61e3411daba7fdd)

*介绍文章：[VitePress 公告插件开发实记](https://sugarat.top/technology/works/vitepress-plugin-announcement.html) · [archive](https://web.archive.org/web/20240921095008/https://sugarat.top/technology/works/vitepress-plugin-announcement.html) · [translated](https://sugarat-top.translate.goog/technology/works/vitepress-plugin-announcement.html?_x_tr_sl=zh-CN&_x_tr_tl=en&_x_tr_hl=zh-CN&_x_tr_pto=wapp)*
## 使用
安装依赖 `pnpm/npm/yarn`
```sh
pnpm add vitepress-plugin-announcement
```

引入插件在 `.vitepress/config.ts` 配置文件中

```ts
import { defineConfig } from 'vitepress'
import { AnnouncementPlugin } from 'vitepress-plugin-announcement'

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

## 更多用法
### 关闭后不再弹出
*tip：下次配置修改后再展示*
```js
AnnouncementPlugin({
  duration: -1
})
```

### 不展示再次打开按钮
```js
AnnouncementPlugin({
  reopen: false
})
```

### 引导闪烁

```js
AnnouncementPlugin({
  twinkle: true
})
```

### 按钮
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

### 修改样式
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

## 完整配置
```ts
import type { Ref } from 'vue'
import type { Route } from 'vitepress'

export interface AnnouncementOptions {
  /**
   * 公告标题
   */
  title: string
  /**
   * 公告主要内容
   */
  body?: Announcement.Value[]
  /**
   * 公告底部内容
   */
  footer?: Announcement.Value[]

  /**
   * 是否只在浏览器环境渲染组件
   * @default false
   * @doc https://vitepress.dev/guide/ssr-compat#clientonly
   */
  clientOnly?: boolean

  /**
   * 展示时机控制
   *
   * -1 只展示1次；>= 0 每次都展示，一定时间后自动消失，0 不自动消失
   *
   * 配置发生改变时，会重新触发此规则
   * @default 0
   */
  duration?: number

  /**
   * 移动端自动最小化
   * @default false
   */
  mobileMinify?: boolean

  /**
   * 支持重新打开（右上角 icon 悬浮）
   * @default true
   */
  reopen?: boolean

  /**
   * 是否打开闪烁提示，通常需要和 reopen 搭配使用
   * @default false
   */
  twinkle?: boolean

  /**
   * 设置展示图标，svg
   */
  icon?: string

  /**
   * 设置关闭图标，svg
   */
  closeIcon?: string

  /**
   * 自定义展示策略
   * @param to 切换到的目标路由
   */
  onRouteChanged?: (to: Route, show: Ref<boolean>) => void

  /**
   * 国际化
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
样式参考了 [reco-1.x 主题](https://github.com/vuepress-reco/vuepress-theme-reco-1.x) 中的 [@vuepress-reco/vuepress-plugin-bulletin-popover](https://github.com/vuepress-reco/vuepress-theme-reco-1.x/tree/master/packages/%40vuepress-reco/vuepress-plugin-bulletin-popover) 插件