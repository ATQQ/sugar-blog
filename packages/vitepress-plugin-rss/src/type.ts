import type { FeedOptions, Author } from 'feed'

export type RSSOptions = FeedOptions & {
  /**
   * 你的站点地址
   * @example 'https://sugarat.top'
   */
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
  /**
   * 是否过滤 layout:home
   * @default true
   */
  ignoreHome?: boolean
  /**
   * 博客站点内容涉及的作者列表
   */
  authors?: Author[]
  /**
   * 自定义文章摘要生成逻辑
   */
  renderExpect?: (
    fileContent: string,
    frontmatter: Record<string, any>
  ) => string | Promise<string>
}

export interface PostInfo {
  filepath: string
  fileContent: string
  html: string
  description: string
  date: string
  title: string
  url: string
  frontmatter: {
    [key: string]: any
  }
}
