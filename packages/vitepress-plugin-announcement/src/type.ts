import type { Ref } from 'vue'
import type { Route } from 'vitepress'

// eslint-disable-next-line ts/no-namespace
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

export interface AnnouncementOptions {
  title: string
  /**
   * 细粒度的时间控制
   * 默认展示时间，-1 只展示1次，其它数字为每次都展示，一定时间后自动消失，0为不自动消失
   * 配置改变时，会重新触发展示
   * @default -1
   */
  duration?: number
  /**
   * 移动端自动最小化
   * @default false
   */
  mobileMinify?: boolean
  body?: Announcement.Value[]
  footer?: Announcement.Value[]
  /**
   * 手动重新打开
   * @default true
   */
  reopen?: boolean
  /**
   * 是否打开闪烁提示，通常需要和 reopen 搭配使用
   * @default true
   */
  twinkle?: boolean
  /**
   * 设置展示图标，svg
   * @recommend https://iconbuddy.app/search?q=fire
   */
  icon?: string
  /**
   * 设置关闭图标，svg
   * @recommend https://iconbuddy.app/search?q=fire
   */
  closeIcon?: string
  /**
   * 自定义展示策略
   * @param to 切换到的目标路由
   */
  onRouteChanged?: (to: Route, show: Ref<boolean>) => void
}
