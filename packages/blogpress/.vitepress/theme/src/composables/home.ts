import { InjectionKey, inject } from 'vue'

export const injectKey: InjectionKey<
  {
    route: string
    meta: {
      title: string
      date: Date
      tag: string[]
      description: string
      cover: string
      // old
      categories: string[]
      tags: string[]
    }
  }[]
> = Symbol('home-data')

export const useHomeData = () => {
  return inject(injectKey)
}
