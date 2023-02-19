import { useData, useRoute } from 'vitepress'
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

const homeConfigSymbol: InjectionKey<Theme.HomeConfig> = Symbol('home-config')

export function withConfigProvider(App: Component) {
  return defineComponent({
    name: 'ConfigProvider',
    props: {
      handleChangeSlogan: {
        type: Function,
        required: false
      }
    },
    setup(props, { slots }) {
      provide(homeConfigSymbol, props as Theme.HomeConfig)

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

export function useBlogConfig() {
  return inject(configSymbol)!.value.blog
}

export function useBlogThemeMode() {
  return inject(configSymbol)!.value.blog.blog ?? true
}
export function useHomeConfig() {
  return inject(homeConfigSymbol)!
}

export function useGiscusConfig() {
  const blogConfig = useConfig()
  return blogConfig.config.blog.comment
}

export function useArticles() {
  const blogConfig = useConfig()
  const articles = computed(() => blogConfig.config?.blog?.pagesData || [])
  return articles
}

export function useActiveTag() {
  return inject(activeTagSymbol)!
}

export function useCurrentArticle() {
  const blogConfig = useConfig()
  const route = useRoute()

  const docs = computed(() => blogConfig.config.blog.pagesData)
  const currentArticle = computed(() =>
    docs.value.find((v) => v.route === route.path.replace(/.html$/, ''))
  )

  return currentArticle
}

function resolveConfig(config: Theme.Config): Theme.Config {
  return {
    ...config,
    blog: {
      ...config?.blog,
      pagesData: config?.blog?.pagesData || []
    }
  }
}
