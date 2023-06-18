import { useData, useRoute, withBase } from 'vitepress'
import {
  Component,
  computed,
  defineComponent,
  h,
  inject,
  InjectionKey,
  provide,
  Ref,
  onMounted,
  onUnmounted,
  reactive,
  ref
} from 'vue'

import type { Theme } from './index'

const configSymbol: InjectionKey<Ref<Theme.Config>> = Symbol('theme-config')

const activeTagSymbol: InjectionKey<Ref<Theme.activeTag>> = Symbol('active-tag')

const currentPageNum: InjectionKey<Ref<number>> = Symbol('home-page-num')
const homeConfigSymbol: InjectionKey<Theme.HomeConfig> = Symbol('home-config')

const userWorks: InjectionKey<Ref<Theme.UserWorks>> = Symbol('user-works')

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
      provide(
        userWorks,
        ref(
          config.value.blog?.works || {
            title: '',
            description: '',
            list: []
          }
        )
      )

      const activeTag = ref<Theme.activeTag>({
        label: '',
        type: ''
      })
      provide(activeTagSymbol, activeTag)

      const pageNum = ref(1)
      provide(currentPageNum, pageNum)
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
  return inject(configSymbol)!.value.blog!
}

export function useBlogThemeMode() {
  return inject(configSymbol)!.value?.blog?.blog ?? true
}
export function useHomeConfig() {
  return inject(homeConfigSymbol)!
}

export function useGiscusConfig() {
  const blogConfig = useConfig()
  return blogConfig.config?.blog?.comment
}

export function useArticles() {
  const blogConfig = useConfig()
  const articles = computed(() => blogConfig.config?.blog?.pagesData || [])
  return articles
}

export function useActiveTag() {
  return inject(activeTagSymbol)!
}
export function useCurrentPageNum() {
  return inject(currentPageNum)!
}

export function useCurrentArticle() {
  const blogConfig = useConfig()
  const route = useRoute()

  const docs = computed(() => blogConfig.config?.blog?.pagesData)
  const currentArticle = computed(() => {
    const currentPath = route.path.replace(/.html$/, '')
    // 兼容中文路径
    const okPaths = [currentPath, decodeURIComponent(currentPath)]
    // 兼容 /(index.md)
    if (currentPath.endsWith('/')) {
      okPaths.push(
        ...[`${currentPath}index`, `${decodeURIComponent(currentPath)}index`]
      )
    }
    return docs.value?.find((v) => okPaths.includes(withBase(v.route)))
  })

  return currentArticle
}

export function useUserWorks() {
  return inject(userWorks)!
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

/**
 * 页面加载的时候定位到锚点内容
 */
export function useActiveAnchor() {
  const el = ref<HTMLElement | null>(null)
  onMounted(() => {
    const { hash } = window.location
    if (hash) {
      el.value = document.querySelector(decodeURIComponent(hash))
    }
  })
  return el
}

/**
 * 页面滚动的时候自动更新锚点
 */
export function useAutoUpdateAnchor() {
  // 初始化当前锚点
  const currentAnchor = reactive({
    id: '',
    top: -1
  })

  // 定义计算当前锚点的方法
  const calculateCurrentAnchor = () => {
    // 获取页面中所有的锚点元素
    const anchors = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    for (let i = 0; i < anchors.length; i += 1) {
      const anchor = anchors[i]
      const rect = anchor.getBoundingClientRect()
      // 如果当前锚点距离顶部最近，且距离顶部小于等于100，则将其设置为当前锚点
      if (rect.top <= 100 && anchor.id !== currentAnchor.id) {
        currentAnchor.id = anchor.id
        currentAnchor.top = rect.top
      }
    }
  }

  // 监听 window 对象的滚动事件
  const onScroll = () => {
    calculateCurrentAnchor()
  }

  // 在组件挂载时启动监听滚动事件
  onMounted(() => {
    window.addEventListener('scroll', onScroll)
  })

  // 在组件卸载时移除监听滚动事件
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  // 返回当前锚点的响应式对象
  return currentAnchor
}
