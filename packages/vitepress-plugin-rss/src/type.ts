import type { Author, FeedOptions } from 'feed'
import type { MarkdownEnv, MarkdownOptions, SiteConfig } from 'vitepress'

export type TransformHtml = (content: string, vitePressConfig: SiteConfig) => string | Promise<string>

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
   * 相对路径静态资源的基础地址（图片）
   * @example 'https://sugarat.top'
   * @default baseUrl
   */
  assetsBaseUrl?: string
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
   * Feed 的全局作者信息；文章默认作者信息；同时也作为 feed Options 的 author 传入
   */
  author?: Author
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
   * 文章 HTML 渲染完成后的处理钩子（可对每篇文章的最终 HTML 做二次加工）
   */
  transform?: TransformHtml | TransformHtml[]
  /**
   * 限制输出文件包含的文章数量
   * @default 0
   * @description (0 不限制；> 1 会按照日期排序对输出内容进行调整)
   */
  limit?: number
  /**
   * RSS 社交链接图标的 aria-label（默认 "RSS"）
   */
  ariaLabel?: string
  /**
   * 手动控制生成 HTML的逻辑，或不是用 vitepress 内置的 HTML 渲染逻辑
   * @default true
   */
  renderHTML?: ((filecontent: string, config: SiteConfig, options: RSSOptions) => string | Promise<string>) | boolean
  /**
   * 国际化支持（locale 配置未声明的字段会继承全局 RSSOptions，除 locales 本身外）
   */
  locales?: Record<string, Partial<Omit<RSSOptions, 'locales'>>>

  /**
   * 是否缓存文档渲染结果
   * @default true
   */
  cache?: boolean
  /**
   * 重载 vitepress 的 Markdown 配置
   */
  markdownOptions?: Omit<MarkdownOptions, 'config'> & {
    style?: string
    svg2img?: boolean | 'base64' | 'png'
  }
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
