import type { Ref } from 'vue'
import type { Route } from 'vitepress'

export interface AnnouncementOptions {
  /**
   * 自定义样式类名
   * @example
   * ```css
   * .theme-blog-popover a {
   *    color: var(--vp-c-brand-2);
   * }
   * ```
   */
  style?: string
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

// eslint-disable-next-line ts/no-namespace
export declare namespace Announcement {
  export interface Title {
    type: 'title'
    /**
     * 支持 markdown 和 html
     */
    content: string
    style?: string
  }

  export interface Text {
    type: 'text'
    /**
     * 支持 markdown 和 html
     */
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
