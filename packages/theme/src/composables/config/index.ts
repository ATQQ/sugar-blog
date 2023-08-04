import type { ElButton } from 'element-plus'
import type { DefaultTheme } from 'vitepress'

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
    recommend?: number | false
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
     * @default true
     */
    showSelf?: boolean
    filter?: (page: Theme.PageData) => boolean
    empty?: string | boolean
    /**
     * 设置推荐文章的展示风格
     * @default 'card'
     */
    style?: 'card' | 'sidebar'
  }

  export interface HomeBlog {
    name?: string
    motto?: string
    inspiring?: string | string[]
    inspiringTimeout?: number
    pageSize?: number
  }

  export interface ArticleConfig {
    readingTime?: boolean
    hiddenCover?: boolean
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
    avatar: ThemeableImage
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

  export interface UserWorks {
    title: string
    description?: string
    topTitle?: string
    list: UserWork[]
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
    /**
     * 阅读文章左侧的推荐文章（替代默认的sidebar）
     */
    recommend?: RecommendArticle | false
    article?: ArticleConfig
    /**
     * el-alert
     */
    alert?: Alert
    popover?: Popover
    friend?: FriendLink[]
    authorList?: Omit<FriendLink, 'avatar'>[]
    /**
     * 启用 [vitepress-plugin-tabs](https://www.npmjs.com/package/vitepress-plugin-tabs)
     * @default false
     */
    tabs?: boolean
    works?: UserWorks
    /**
     * https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
     * @default false
     */
    mermaid?: any
    /**
     * 设置解析 frontmatter 里 date 的时区
     * @default 8 => 'UTC+8'
     * */
    timeZone?: number
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
}
