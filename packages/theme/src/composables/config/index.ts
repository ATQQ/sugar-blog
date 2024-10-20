/* eslint-disable ts/no-namespace */
import type { DefaultTheme } from 'vitepress'
import type { RSSOptions } from 'vitepress-plugin-rss'
import type { Mapping, Repo } from '@giscus/vue'
import type { Options as Oml2dOptions } from 'oh-my-live2d'
import type { PagefindConfig } from 'vitepress-plugin-pagefind'
import type { AnnouncementOptions } from 'vitepress-plugin-announcement'

type RSSPluginOptions = RSSOptions

export type ThemeableImage =
  | string
  | { src: string; alt?: string }
  | { light: string; dark: string; alt?: string }

export namespace Theme {
  export interface PageMeta {
    title: string
    date: string
    tag?: string[]
    description?: string
    descriptionHTML?: string
    cover?: string
    hiddenCover?: boolean
    readingTime?: boolean
    sticky?: number
    author?: string
    hidden?: boolean
    layout?: string
    // old
    categories: string[]
    tags: string[]
    /**
     * 文章首页置顶
     */
    top?: number
    /**
     * 手动控制相关文章列表的顺序
     */
    recommend?: number | false | string | string[] | [...string[], number]
    /**
     * TODO: 待开发
     * 时间线
     */
    timeline: string
    /**
     * TODO: 待开发
     * 专栏&合集
     */
    album: string
    // 是否发布
    publish?: boolean
    /**
     * 文章作者，标签等信息插入位置
     * @default 'h1'
     */
    docMetaInsertSelector?: string
    /**
     * 文章作者，标签等信息插入位置
     * @default 'after'
     */
    docMetaInsertPosition?: 'before' | 'after'
  }
  export interface PageData {
    route: string
    meta: PageMeta
  }
  export interface activeTag {
    label: string
    /**
     * @type {string}
     */
    type: any
  }

  export type CommentConfig = ((GiscusOption & CommentCommonConfig) | GiscusConfig | ArtalkConfig)

  export interface CommentCommonConfig {
    /**
     * @default '评论'
     */
    label?: string
    /**
     * 自定义图标，SVG 格式
     * @recommend https://iconbuddy.app/search?q=fire
     */
    icon?: string
    /**
     * 移动端最小化按钮
     * @default true
     */
    mobileMinify?: boolean
  }
  export interface GiscusConfig extends CommentCommonConfig {
    type: 'giscus'
    options: GiscusOption
  }
  export interface ArtalkConfig extends CommentCommonConfig {
    type: 'artalk'
    options: ArtalkOption
  }
  export interface GiscusOption {
    repo: Repo
    repoId: string
    category: string
    categoryId: string
    mapping?: Mapping
    inputPosition?: 'top' | 'bottom'
    lang?: string
    loading?: 'lazy' | 'eager'
  }
  export interface ArtalkOption {
    site: string
    server: string
  }

  export interface HotArticle {
    /**
     * 自定义标题，支持SVG + 文字
     * @default '🔥 精选文章'
     */
    title?: string
    pageSize?: number
    nextText?: string
    empty?: string | boolean
  }
  export interface RecommendArticle {
    title?: string
    pageSize?: number
    nextText?: string
    /**
     * 是否展示当前正在浏览的文章在左侧
     * @default true
     */
    showSelf?: boolean
    /**
     * 自定义文章过滤
     */
    filter?: (page: Theme.PageData) => boolean
    /**
     * 自定义排序
     * @default 'date'
     */
    sort?: 'date' | 'filename' | ((a: Theme.PageData, b: Theme.PageData) => number)
    /**
     * 当没有推荐文章时的提示，设置为 false 则不展示
     * @default '暂无相关文章'
     */
    empty?: string | boolean
    /**
     * 设置推荐文章的展示风格
     * @default 'sidebar'
     */
    style?: 'card' | 'sidebar'
    /**
     * 是否在左侧显示日期
     * @default true
     */
    showDate?: boolean
    /**
     * 是否在左侧展示序号
     * @default true
     */
    showNum?: boolean
  }

  export interface HomeAnalysis {
    articles?: {
      title?: string[]
    }
  }

  export interface HomeBlog {
    name?: string
    motto?: string
    inspiring?: string | string[]
    inspiringTimeout?: number
    pageSize?: number
    author?: string | boolean
    logo?: string | boolean
    /**
     * @default 'card'
     */
    avatarMode?: 'card' | 'split'
    /**
     * 首页数据分析卡片
     */
    analysis?: HomeAnalysis
  }

  export interface ArticleConfig {
    /**
     * 文章分析数据展示标题
     */
    analyzeTitles?: ArticleAnalyzeTitles
    readingTime?: boolean
    /**
     * 阅读时间分析展示位置
     * @default 'inline'
     */
    readingTimePosition?: 'inline' | 'newLine' | 'top'
    hiddenCover?: boolean
  }

  export interface ArticleAnalyzeTitles {
    /**
     * 字数：{{value}} 个字
     */
    topWordCount?: string
    /**
     * 预计：{{value}} 分钟
     */
    topReadTime?: string
    /**
     * {{value}} 个字
     */
    inlineWordCount?: string
    /**
     * {{value}} 分钟
     */
    inlineReadTime?: string
    /**
     * 文章字数
     */
    wordCount?: string
    /**
     * 预计阅读时间
     */
    readTime?: string
    /**
     * 本文作者
     */
    author?: string
    /**
     * 发布时间
     */
    publishDate?: string
    /**
     * 最近修改时间
     */
    lastUpdated?: string
    /**
     * 标签
     */
    tag?: string
  }
  export interface Alert {
    type: 'success' | 'warning' | 'info' | 'error'
    /**
     * 细粒度的时间控制
     * 默认展示时间，-1 只展示1次，其它数字为每次都展示，一定时间后自动消失，0为不自动消失
     * 配置改变时，会重新触发展示
     */
    duration: number
    title?: string
    description?: string
    closable?: boolean
    center?: boolean
    closeText?: string
    showIcon?: boolean
    html?: string
  }

  export interface FriendLink {
    nickname: string
    des: string
    url: string
    avatar: ThemeableImage
  }

  export interface FriendConfig {
    list: FriendLink[]
    /**
     * 是否随机展示
     * @default false
     */
    random?: boolean
    /**
     * 是否限制展示数量（超出自动切换）
     */
    limit?: number
    /**
     * 滚动速度(ms)，设置为 0 不滚动直接截取
     * @default "动态计算"
     */
    scrollSpeed?: number
    /**
     * 自定义展示标题，支持SVG + 文字
     * @default '🤝 友情链接'
     */
    title?: string
  }

  export interface UserWork {
    title: string
    description: string
    time:
    | string
    | {
      start: string
      end?: string
      lastupdate?: string
    }
    status?: {
      text: string
      type?: 'tip' | 'warning' | 'danger'
    }
    url?: string
    github?:
    | string
    | {
      owner: string
      repo: string
      branch?: string
      path?: string
    }
    cover?:
    | string
    | string[]
    | {
      urls: string[]
      layout?: 'swiper' | 'list'
    }
    links?: {
      title: string
      url: string
    }[]
    tags?: string[]
    top?: number
  }
  export type SearchConfig =
    | false
    | PagefindConfig

  export interface UserWorks {
    title: string
    description?: string
    topTitle?: string
    list: UserWork[]
  }
  export type ThemeColor =
    | 'vp-default'
    | 'vp-green'
    | 'vp-yellow'
    | 'vp-red'
    | 'el-blue'
    | 'el-yellow'
    | 'el-green'
    | 'el-red'
  export interface BlogConfig {
    blog?: false
    locales?: Record<string, Omit<BlogConfig, 'locales' | 'pagesData' | 'search' | 'popover' | 'RSS'> & { pagesData?: PageData[] }>
    /**
     * 展示日期格式化
     */
    formatShowDate?: FormatShowDate
    /**
     * 内置一些主题色
     * @default 'vp-default'
     * 也可以自定义颜色，详见 https://theme.sugarat.top/config/style.html#%E4%B8%BB%E9%A2%98%E8%89%B2
     */
    themeColor?: ThemeColor
    pagesData: PageData[]
    /**
     * @deprecated 请使用 VitePress 官方 srcDir 替代
     *
     * @doc https://vitepress.dev/zh/reference/site-config#srcdir
     */
    srcDir?: string
    author?: string
    hotArticle?: HotArticle | false
    home?: HomeBlog
    /**
     * 本地全文搜索定制
     * 内置pagefind 实现，
     * VitePress 官方提供 minisearch 实现，
     * 社区提供 flexsearch 实现
     */
    search?: SearchConfig
    /**
     * 配置评论
     * giscus: https://giscus.app/zh-CN
     * artalk: https://artalk.js.org/
     */
    comment?: CommentConfig | false
    /**
     * 阅读文章左侧的推荐文章（替代默认的sidebar）
     */
    recommend?: RecommendArticle | false
    article?: ArticleConfig
    /**
     * el-alert
     */
    alert?: Alert
    popover?: AnnouncementOptions
    friend?: FriendLink[] | FriendConfig
    authorList?: Omit<FriendLink, 'avatar'>[]
    /**
     * 启用 [vitepress-plugin-tabs](https://www.npmjs.com/package/vitepress-plugin-tabs)
     * @default false
     */
    tabs?: boolean
    works?: UserWorks
    /**
     * https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
     * @default true
     */
    mermaid?: any
    /**
     * 设置解析 frontmatter 里 date 的时区
     * @default new Date().getTimezoneOffset() / -60
     * @example 8 => 'UTC+8'
     */
    timeZone?: number
    /**
     * 启用RSS配置
     */
    RSS?: RSSOptions | RSSOptions[]
    /**
     * 首页页脚
     */
    footer?: Footer | Footer[]
    /**
     * 文章作者，标签等信息插入位置
     * @default 'h1'
     */
    docMetaInsertSelector?: string
    /**
     * 文章作者，标签等信息插入位置
     * @default 'after'
     */
    docMetaInsertPosition?: 'before' | 'after'
    /**
     * 配置内置的 markdown-it-task-checkbox 插件，设置 false 则关闭
     * 详见 https://github.com/linsir/markdown-it-task-checkbox
     * @default true
     */
    taskCheckbox?: TaskCheckbox | boolean
    /**
     * 支持 markdown 时间线语法，在 vitepress 中使用 markdown 渲染时间线（时间轴）样式。
     * 详见 https://github.com/HanochMa/vitepress-markdown-timeline
     * @default true
     */
    timeline?: boolean
    /**
     * 回到顶部
     * @default true
     */
    backToTop?: boolean | BackToTop

    /**
     * oh-my-live2d 的 loadOml2d 方法的配置选项
     * 详见 https://oml2d.com/options/Options.html
     */
    oml2d?: Oml2dOptions
    homeTags?: boolean | HomeTagsConfig
    buttonAfterArticle?: ButtonAfterArticleConfig | false
    /**
     * 是否开启深色模式过渡动画
     * @reference https://vitepress.dev/zh/guide/extending-default-theme#on-appearance-toggle
     * @default true
     */
    darkTransition?: boolean
    /**
     * 渲染时替换图片地址
     */
    imageStyle?: ImageStyleConfig
    groupIcon?: {
      customIcon: Record<string, string>
    }
  }

  export type FormatShowDate = {
    /**
     * 刚刚
     */
    justNow?: string
    /**
     * 秒前
     */
    secondsAgo?: string
    /**
     * 分钟前
     */
    minutesAgo?: string
    /**
     * 小时前
     */
    hoursAgo?: string
    /**
     * 天前
     */
    daysAgo?: string
    /**
     * 周前
     */
    weeksAgo?: string
  } | ((date: Date | string) => string)
  export interface BackToTop {
    /**
     * 距离顶部多少距离出现
     * @default 450
     */
    top?: number

    /**
     * 设置展示图标，svg
     * @recommend https://iconbuddy.app/search?q=fire
     */
    icon?: string
  }

  export interface TaskCheckbox {
    disabled?: boolean
    divWrap?: boolean
    divClass?: string
    idPrefix?: string
    ulClass?: string
    liClass?: string
  }

  export type RSSOptions = RSSPluginOptions

  export interface FooterItem {
    text: string
    link?: string
    icon?: boolean | string
  }

  export interface Footer {
    /**
     * 自定义补充信息（支持配置为HTML），在内置的 footer 上方
     */
    message?: string | string[]
    /**
     * 自定义补充信息（支持配置为HTML），在内置的 footer 下方
     */
    bottomMessage?: string | string[]
    /**
     * 自定义补充信息（支持配置为HTML），紧随内置的后方
     */
    list?: string | string[] | FooterItem | FooterItem[]
    /**
     * 是否展示主题版本信息
     */
    version?: boolean | {
      name?: string
      link?: string
      icon?: boolean | string
    }
    /**
     * copyright
     */
    copyright?: string | {
      message: string
      link?: string
      icon?: boolean | string
    }
    /**
     * ICP 备案信息
     */
    icpRecord?: {
      name: string
      link: string
      icon?: boolean | string
    }
    /**
     * 公安备案信息
     */
    securityRecord?: {
      name: string
      link: string
      icon?: boolean | string
    }
  }
  export interface Config extends DefaultTheme.Config {
    blog?: BlogConfig
  }
  export interface HomeConfig {
    /**
     * @deprecated
     * 此方法已经废弃，这个定义将在未来某一刻被移除，请为 inspiring 配置数租来实现相同的效果
     */
    handleChangeSlogan?: (oldSlogan: string) => string | Promise<string>
  }
  export interface ButtonAfterArticleConfig {
    openTitle?: string
    closeTitle?: string
    content?: string
    icon?: 'aliPay' | 'wechatPay' | string
    /**
     * 按钮尺寸
     * @default 'default'
     */
    size?: 'small' | 'default' | 'large'
    /**
     * 默认展开
     * @default false
     */
    expand?: boolean
  }

  export interface ReplaceRule {
    /**
     * 匹配规则
     */
    rule: string | RegExp
    /**
     * 直接追加后缀
     */
    suffix?: string
    /**
     * 替换函数或字符串(优先级高于 suffix)
     */
    replace?: string | ((match: string) => string)
  }
  export interface ImageStyleConfig {
    /**
     * 首页封面预览图
     */
    coverPreview?: ReplaceRule | ReplaceRule[]
  }

  export interface HomeTagsConfig {
    /**
     * 自定义标题，支持SVG + 文字
     * @default '🏷 标签'
     */
    title?: string
  }
}
