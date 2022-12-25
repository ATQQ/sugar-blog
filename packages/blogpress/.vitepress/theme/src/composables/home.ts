import { InjectionKey, inject, Ref } from 'vue'

export const injectKey: InjectionKey<{
  docs: {
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
  }[]
  activeTag: Ref<{
    label: string
    type: string
  }>
}> = Symbol('home-data')

export const useHomeData = () => {
  return inject(injectKey)
}
