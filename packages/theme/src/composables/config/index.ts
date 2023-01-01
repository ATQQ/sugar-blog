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

  export interface BlogConfig {
    pagesData: PageData[]
    author?: string
  }
  export interface Config extends DefaultTheme.Config {
    blog: BlogConfig
  }
}
