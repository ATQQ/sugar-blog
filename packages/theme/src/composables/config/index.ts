import { DefaultTheme } from 'vitepress'

export namespace Theme {
  export interface PageMeta {
    title: string
    date: string
    tag?: string[]
    description?: string
    cover?: string
    sticky?: number
    author?: string
    hidden?: boolean
    layout?: string
    // old
    categories: string[]
    tags: string[]
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
    loading?: string
  }

  export interface BlogConfig {
    pagesData: PageData[]
    author?: string
    hotArticle?: {
      title?: string
      pageSize?: number
      nextText?: string
      empty?: string | boolean
    }
    home?: {
      pageSize?: number
    }
    // TODO: 本地全文搜索定制 pagefind || minisearch
    search?: boolean
    /**
     * 配置评论
     * power by https://giscus.app/zh-CN
     */
    comment?: GiscusConfig | false
    recommend?: {
      title?: string
      pageSize?: number
      nextText?: string
      empty?: string | boolean
    }
    article?: {
      readingTime?: boolean
    }
  }
  export interface Config extends DefaultTheme.Config {
    blog: BlogConfig
  }
  export interface HomeConfig {
    handleChangeSlogan?: (oldSlogan: string) => string | Promise<string>
  }
}
