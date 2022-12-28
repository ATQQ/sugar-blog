import { DefaultTheme } from 'vitepress'

export interface pageData {
  route: string
  meta: {
    title: string
    date: Date
    tag: string[]
    description: string
    cover: string
    sticky?: number
    // old
    categories: string[]
    tags: string[]
  }
}

export interface Config extends DefaultTheme.Config {
  pagesData: pageData[]
  activeTag: {
    label: string
    type: string
  }
}
