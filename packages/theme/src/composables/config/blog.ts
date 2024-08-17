import { useData, useRoute, withBase } from 'vitepress'
import type {
  Component,
  ComputedRef,
  InjectionKey,
  Ref
} from 'vue'
import {
  computed,
  defineComponent,
  h,
  inject,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  ref
} from 'vue'
import { useColorMode } from '@vueuse/core'

import { formatDate, replaceValue } from '../../utils/client'
import type { Theme } from './index'

const configSymbol: InjectionKey<Ref<Theme.Config>> = Symbol('theme-config')

const activeTagSymbol: InjectionKey<Ref<Theme.activeTag>> = Symbol('active-tag')

const currentPageNum: InjectionKey<Ref<number>> = Symbol('home-page-num')

const userWorks: InjectionKey<Ref<Theme.UserWorks>> = Symbol('user-works')

const homeFooter: InjectionKey<Theme.Footer | Theme.Footer[] | undefined> = Symbol('home-footer')

export function withConfigProvider(App: Component) {
  return defineComponent({
    name: 'ConfigProvider',
    setup(_, { slots }) {
      const { theme } = useData()
      const config = computed(() => resolveConfig(theme.value))
      provide(homeFooter, config.value.blog?.footer)
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

      const mode = useColorMode({
        attribute: 'theme',
        modes: {
          // 内置的颜色主题
          'vp-default': 'vp-default',
          'vp-green': 'vp-green',
          'vp-yellow': 'vp-yellow',
          'vp-red': 'vp-red',
          'el-blue': 'el-blue',
          'el-yellow': 'el-yellow',
          'el-green': 'el-green',
          'el-red': 'el-red'
        }
      })
      mode.value = config.value.blog?.themeColor ?? 'vp-default'
      return () => h(App, null, slots)
    }
  })
}
export function useDocMetaInsertSelector() {
  const blogConfig = useConfig()
  const { frontmatter } = useData()
  return computed(() => frontmatter.value?.docMetaInsertSelector || blogConfig.config?.blog?.docMetaInsertSelector || 'h1')
}

export function useDocMetaInsertPosition() {
  const blogConfig = useConfig()
  const { frontmatter } = useData()
  return computed(() => frontmatter.value?.docMetaInsertPosition || blogConfig.config?.blog?.docMetaInsertPosition || 'after')
}

export function useConfig() {
  return {
    config: inject(configSymbol)!.value
  }
}

export function useBlogConfig() {
  return inject(configSymbol)!.value.blog!
}
/**
 * 获取 oh-my-live2d的配置选项
 */
export function useOml2dOptions() {
  return inject(configSymbol)!.value.blog?.oml2d
}

export function useDarkTransitionConfig() {
  return inject(configSymbol)!.value.blog?.darkTransition ?? true
}

export function useBlogThemeMode() {
  return inject(configSymbol)!.value?.blog?.blog ?? true
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
    return docs.value?.find(v => okPaths.includes(withBase(v.route)))
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
      el.value = document.querySelector(decodeURIComponent(hash)) as any
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

export function useHomeFooterConfig() {
  return inject(homeFooter)
}

export function useBackToTopConfig() {
  return useBlogConfig().backToTop
}

export function useCleanUrls() {
  const { site } = useData()
  return !!site.value.cleanUrls
}

export function useImageStyle() {
  return inject(configSymbol)?.value?.blog?.imageStyle || {} as Theme.ImageStyleConfig
}

export function useHomeAnalysis() {
  return inject(configSymbol)?.value?.blog?.home?.analysis
}

export function useAnalyzeTitles(wordCount: Ref<number>, readTime: ComputedRef<number>) {
  const { article } = useBlogConfig()

  const topWordCount = computed(() =>
    replaceValue(article?.analyzeTitles?.topWordCount || '字数：{{value}} 个字', wordCount.value)
  )
  const topReadTime = computed(() =>
    replaceValue(article?.analyzeTitles?.topReadTime || '预计：{{value}} 分钟', readTime.value)
  )
  const inlineWordCount = computed(() =>
    replaceValue(article?.analyzeTitles?.inlineWordCount || '{{value}} 个字', wordCount.value)
  )
  const inlineReadTime = computed(() =>
    replaceValue(article?.analyzeTitles?.inlineReadTime || '{{value}} 分钟', readTime.value)
  )

  const wordCountTitle = computed(() =>
    article?.analyzeTitles?.wordCount || '文章字数'
  )
  const readTimeTitle = computed(() =>
    article?.analyzeTitles?.readTime || '预计阅读时间'
  )

  const authorTitle = computed(() =>
    article?.analyzeTitles?.author || '本文作者'
  )

  const publishDateTitle = computed(() =>
    article?.analyzeTitles?.publishDate || '发布时间'
  )

  const lastUpdatedTitle = computed(() =>
    article?.analyzeTitles?.lastUpdated || '最近修改时间'
  )

  const tagTitle = computed(() =>
    article?.analyzeTitles?.tag || '标签'
  )

  return {
    topWordCount,
    topReadTime,
    inlineWordCount,
    inlineReadTime,
    wordCountTitle,
    readTimeTitle,
    authorTitle,
    publishDateTitle,
    lastUpdatedTitle,
    tagTitle
  }
}

export function useFormatShowDate() {
  const blog = useBlogConfig()
  if (typeof blog.formatShowDate === 'function') {
    return blog.formatShowDate
  }

  function formatShowDate(date: any) {
    const source = +new Date(date)
    const now = +new Date()
    const diff = now - source
    const oneSeconds = 1000
    const oneMinute = oneSeconds * 60
    const oneHour = oneMinute * 60
    const oneDay = oneHour * 24
    const oneWeek = oneDay * 7

    const langMap = {
      justNow: '刚刚',
      secondsAgo: '秒前',
      minutesAgo: '分钟前',
      hoursAgo: '小时前',
      daysAgo: '天前',
      weeksAgo: '周前',
      ...blog.formatShowDate
    }
    const mapValue = langMap

    if (diff < 10) {
      return mapValue.justNow
    }
    if (diff < oneMinute) {
      return `${Math.floor(diff / oneSeconds)}${mapValue.secondsAgo}`
    }
    if (diff < oneHour) {
      return `${Math.floor(diff / oneMinute)}${mapValue.minutesAgo}`
    }
    if (diff < oneDay) {
      return `${Math.floor(diff / oneHour)}${mapValue.hoursAgo}`
    }
    if (diff < oneWeek) {
      return `${Math.floor(diff / oneDay)}${mapValue.daysAgo}`
    }

    return formatDate(new Date(date), 'yyyy-MM-dd')
  }
  return formatShowDate
}
