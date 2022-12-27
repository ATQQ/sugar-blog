import { InjectionKey, inject, Ref } from 'vue'

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

export const injectKey: InjectionKey<{
  docs: pageData[]
  activeTag: Ref<{
    label: string
    type: string
  }>
}> = Symbol('home-data')

export const useHomeData = () => {
  return inject(injectKey)
}
