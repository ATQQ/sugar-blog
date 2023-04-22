import type { ElButton } from 'element-plus'
import { DefaultTheme } from 'vitepress'

export namespace BlogPopover {
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
    props?: InstanceType<typeof ElButton>['$props']
  }

  export type Value = Title | Text | Image | Button
}

export namespace Theme {
  export interface PageMeta {
    title: string
    date: string
    tag?: string[]
    description?: string
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
    recommend?: number | false
    /**
     * 是否懒加载图片
     * @default true
     */
    lazy: boolean
    // TODO: 待开发
    /**
     * (待开发) 时间线
     */
    timeline: string
    /**
     * (待开发) 专栏&合集
     */
    album: string
  }
  export interface PageData {
    route: string
    meta: PageMeta
  }
  export interface activeTag {
    label: string
    type: string
  }

  export interface GiscusConfig {
    repo: string
    repoId: string
    category: string
    categoryId: string
    mapping?: string
    inputPosition?: 'top' | 'bottom'
    lang?: string
    loading?: 'lazy' | 'auto' | 'eager'
  }

  export interface HotArticle {
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
     * @default false
     */
    showSelf?: boolean
    filter?: (page: Theme.PageData) => boolean
    empty?: string | boolean
  }

  export interface HomeBlog {
    name?: string
    motto?: string
    inspiring?: string
    pageSize?: number
  }

  export interface ArticleConfig {
    /**
     * 是否展示阅读时间分析
     * @default true
     */
    readingTime?: boolean
    /**
     * 是否隐藏文章页的封面图
     * @default false
     */
    hiddenCover?: boolean
    /**
     * 是否懒加载图片资源
     * @default true
     */
    lazy?: boolean
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

  export interface Popover {
    title: string
    /**
     * 细粒度的时间控制
     * 默认展示时间，-1 只展示1次，其它数字为每次都展示，一定时间后自动消失，0为不自动消失
     * 配置改变时，会重新触发展示
     */
    duration: number
    body?: BlogPopover.Value[]
    footer?: BlogPopover.Value[]
    /**
     * 手动重新打开
     */
    reopen?: boolean
  }
  export interface FriendLink {
    nickname: string
    des: string
    url: string
    avatar: string
  }
  export type SearchConfig =
    | boolean
    | 'pagefind'
    | {
        btnPlaceholder?: string
        placeholder?: string
        emptyText?: string
        /**
         * @example
         * 'Total: {{searchResult}} search results.'
         */
        heading?: string
        mode?: boolean | 'pagefind'
      }

  export interface BlogConfig {
    blog?: false
    pagesData: PageData[]
    srcDir?: string
    author?: string
    hotArticle?: HotArticle
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
     * power by https://giscus.app/zh-CN
     */
    comment?: GiscusConfig | false
    recommend?: RecommendArticle
    article?: ArticleConfig
    /**
     * el-alert
     */
    alert?: Alert
    popover?: Popover
    friend?: FriendLink[]
    /**
     * 作者信息列表
     */
    authorList?: Omit<FriendLink, 'avatar'>[]
  }

  export interface Config extends DefaultTheme.Config {
    blog?: BlogConfig
  }
  export interface HomeConfig {
    handleChangeSlogan?: (oldSlogan: string) => string | Promise<string>
  }
}
