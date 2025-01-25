import type { Author, FeedOptions } from 'feed'
import type { MarkdownEnv } from 'vitepress'

export type RSSOptions = Omit<FeedOptions, 'id'> & {
  id?: string
  /**
   * 过滤目标文章
   * @param post 文章相关信息
   */
  filter?: (value: PostInfo, index: number, array: PostInfo[]) => boolean
  /**
   * 你的站点地址
   * @example 'https://sugarat.top'
   */
  baseUrl: string
  /**
   * 线上访问的RSS地址
   * @default
   * ```ts
   * `${baseUrl + VPConfig.site.base + (filename || 'feed.rss'}`
   * ```
   */
  url?: string
  /**
   * 输出的RSS文件名
   * @default 'feed.rss'
   */
  filename?: string
  /**
   * RSS的图标展示（你也可以传入一个svg字符串进行自定义，SVG 图标可访问 https://www.xicons.org/# 获取）
   * @default true
   */
  icon?: boolean | string
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
   * 是否忽略 frontmatter publish 控制
   * @default false
   */
  ignorePublish?: boolean
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
  /**
   * 限制输出文件包含的文章数量
   * @default 0
   * @description (0 不限制；> 1 会按照日期排序对输出内容进行调整)
   */
  limit?: number
  ariaLabel?: string
  /**
   * 手动控制生成 HTML的逻辑，或不是用 vitepress 内置的 HTML 渲染逻辑
   * @default true
   */
  renderHTML?: ((filecontent: string) => string | Promise<string>) | boolean
  locales?: Record<string, Omit<RSSOptions, 'locales'>>
  /**
   * (可选)文章解析完成后调用，可对文章内容进行进一步处理
   */
  transform?: (content: string) => string
}

export interface PostInfo {
  filepath: string
  fileContent: string
  html?: string
  description: string
  date: string
  title: string
  url: string
  frontmatter: {
    [key: string]: any
  }
  env: MarkdownEnv
}
