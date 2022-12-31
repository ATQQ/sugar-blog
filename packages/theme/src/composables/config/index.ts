import { DefaultTheme } from 'vitepress'

export namespace Theme {
  export interface PageMeta {
    title: string
    date: string
    tag: string[]
    description: string
    cover: string
    sticky?: number
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

  export interface Config extends DefaultTheme.Config {
    pagesData: PageData[]
  }
}
