import { useData } from 'vitepress'
import {
  Component,
  computed,
  defineComponent,
  h,
  inject,
  InjectionKey,
  provide,
  Ref
} from 'vue'
import { Config } from './index'

const configSymbol: InjectionKey<Ref<Config>> = Symbol('theme-config')

export function withConfigProvider(App: Component) {
  return defineComponent({
    name: 'VPConfigProvider',
    setup(_, { slots }) {
      const { theme } = useData()
      const config = computed(() => resolveConfig(theme.value))
      provide(configSymbol, config)
      return () => h(App, null, slots)
    }
  })
}

export function useConfig() {
  return {
    config: inject(configSymbol)!.value
  }
}

function resolveConfig(config: Config): Config {
  return {
    ...config,
    pagesData: config.pagesData || [],
    activeTag: config.activeTag || { label: '', type: '' },
    sidebar: config.sidebar || [
      {
        text: '',
        items: []
      }
    ]
  }
}
