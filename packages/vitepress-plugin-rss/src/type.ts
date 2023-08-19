import type { FeedOptions } from 'feed'

export type RSSOptions = FeedOptions & {
  baseUrl: string
  /**
   * 线上访问的RSS地址
   */
  url: string
  /**
   * 输出的RSS文件名
   * @default 'feed.rss'
   */
  filename?: string
  /**
   * 是否展示RSS的图标
   * @default true
   */
  showIcon?: boolean
  /**
   * 是否打印过程提示
   * @default true
   */
  log?: boolean
}
