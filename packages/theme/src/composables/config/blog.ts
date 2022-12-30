import { useData } from 'vitepress'
import {
  Component,
  computed,
  defineComponent,
  h,
  inject,
  InjectionKey,
  provide,
  ref,
  Ref
} from 'vue'
import type { Theme } from './index'

const configSymbol: InjectionKey<Ref<Theme.Config>> = Symbol('theme-config')

const activeTagSymbol: InjectionKey<Ref<Theme.activeTag>> = Symbol('active-tag')

export function withConfigProvider(App: Component) {
  return defineComponent({
    name: 'ConfigProvider',
    setup(_, { slots }) {
      const { theme } = useData()

      const config = computed(() => resolveConfig(theme.value))
      provide(configSymbol, config)

      const activeTag = ref<Theme.activeTag>({
        label: '',
        type: ''
      })
      provide(activeTagSymbol, activeTag)
      return () => h(App, null, slots)
    }
  })
}

export function useConfig() {
  return {
    config: inject(configSymbol)!.value
  }
}

export function useActiveTag() {
  return inject(activeTagSymbol)!
}

function resolveConfig(config: Theme.Config): Theme.Config {
  return {
    ...config,
    pagesData: config.pagesData || [],
    sidebar: config.sidebar || [
      {
        text: '',
        items: []
      }
    ]
  }
}
