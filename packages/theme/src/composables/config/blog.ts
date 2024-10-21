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
  ref,
  watch,
} from 'vue'
import { useColorMode } from '@vueuse/core'

import { formatDate, replaceValue } from '../../utils/client'
import type { Theme } from './index'

const configSymbol: InjectionKey<Ref<Theme.Config>> = Symbol('theme-config')

const activeTagSymbol: InjectionKey<Ref<Theme.activeTag>> = Symbol('active-tag')

const currentPageNum: InjectionKey<Ref<number>> = Symbol('home-page-num')

export function withConfigProvider(App: Component) {
  return defineComponent({
    name: 'ConfigProvider',
    setup(_, { slots }) {
      const { theme, localeIndex } = useData()
      const config = computed(() => resolveConfig(theme.value, localeIndex.value))

      provide(configSymbol, config)

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
      watch(config, () => {
        mode.value = config.value.blog?.themeColor ?? 'vp-default'
      }, {
        immediate: true
      })

      return () => h(App, null, slots)
    }
  })
}

export function useGlobalAuthor() {
  const blogConfig = useBlogConfig()
  return computed(() => blogConfig.value?.author || '')
}

export function useArticleConfig() {
  const blogConfig = useBlogConfig()
  return computed(() => blogConfig.value?.article)
}

export function useAuthorList() {
  const blogConfig = useBlogConfig()
  return computed(() => blogConfig.value?.authorList)
}

export function useHotArticleConfig() {
  const blogConfig = useBlogConfig()
  return computed(() => {
    const cfg = blogConfig.value?.hotArticle
    return cfg === false ? undefined : cfg
  })
}

export function useShowHotArticle() {
  const blogConfig = useBlogConfig()
  return computed(() => {
    const cfg = blogConfig.value?.hotArticle
    return cfg !== false
  })
}

export function useRecommendConfig() {
  const blogConfig = useBlogConfig()
  return computed(() => {
    const cfg = blogConfig.value?.recommend
    return cfg === false ? undefined : cfg
  })
}

export function useShowRecommend() {
  const blogConfig = useBlogConfig()
  return computed(() => {
    const cfg = blogConfig.value?.recommend
    return cfg !== false
  })
}

export function useAlertConfig() {
  const blogConfig = useBlogConfig()
  return computed(() => blogConfig.value?.alert)
}

export function useHomeConfig() {
  const blogConfig = useBlogConfig()
  return computed(() => blogConfig.value?.home)
}

export function useHomeTagsConfig() {
  const blogConfig = useBlogConfig()
  return computed(() => blogConfig.value?.homeTags)
}

export function useDocMetaInsertSelector() {
  const blogConfig = useConfig()
  const { frontmatter } = useData()
  return computed(() => frontmatter.value?.docMetaInsertSelector || blogConfig?.value?.blog?.docMetaInsertSelector || 'h1')
}

export function useDocMetaInsertPosition() {
  const blogConfig = useConfig()
  const { frontmatter } = useData()
  return computed(() => frontmatter.value?.docMetaInsertPosition || blogConfig?.value?.blog?.docMetaInsertPosition || 'after')
}

export function useConfig() {
  return inject(configSymbol)
}

export function useBlogConfig() {
  const resolveConfig = useConfig()
  return computed(() => resolveConfig?.value?.blog)
}

export function useButtonAfterConfig() {
  const blogConfig = useBlogConfig()
  const { frontmatter } = useData()
  const frontmatterConfig = computed(() => frontmatter.value.buttonAfterArticle)

  const buttonAfterArticleConfig = computed<Theme.ButtonAfterArticleConfig | false>(() => {
    if (frontmatterConfig.value === false || (!frontmatterConfig.value && !blogConfig.value?.buttonAfterArticle)) {
      return false
    }

    return { ...blogConfig.value?.buttonAfterArticle, ...frontmatterConfig.value }
  })

  return buttonAfterArticleConfig
}

/**
 * 获取 oh-my-live2d的配置选项
 */
export function useOml2dOptions() {
  const blogConfig = useBlogConfig()
  return computed(() => blogConfig.value?.oml2d)
}

export function useDarkTransitionConfig() {
  return inject(configSymbol)!.value.blog?.darkTransition ?? true
}

export function useBlogThemeMode() {
  return inject(configSymbol)!.value?.blog?.blog ?? true
}

export function useArticles() {
  const blogConfig = useConfig()
  const { localeIndex, site } = useData()

  const localeKeys = computed(() => Object.keys(site.value.locales))

  const articles = computed(() => {
    if (localeKeys.value.length === 0) {
      return (blogConfig?.value?.blog?.pagesData || [])
    }
    return blogConfig?.value?.blog?.locales?.[localeIndex.value]?.pagesData || []
  })
  return articles
}

export function useActiveTag() {
  return inject(activeTagSymbol)!
}
export function useCurrentPageNum() {
  return inject(currentPageNum)!
}

export function useCurrentArticle() {
  const route = useRoute()

  const docs = useArticles()
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
  const blogConfig = useBlogConfig()

  return computed(() => blogConfig.value?.works || {
    title: '',
    description: '',
    list: []
  })
}
function resolveConfig(config: Theme.Config, locale: string = 'root'): Theme.Config {
  const mergeConfig = {
    ...config,
    blog: {
      ...config?.blog,
      pagesData: config?.blog?.pagesData || [],
      // i18n 支持
      ...config?.blog?.locales?.[locale]
    }
  }
  return mergeConfig
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
  const blogConfig = useBlogConfig()
  return computed(() => blogConfig.value?.footer)
}

export function useBackToTopConfig() {
  const blogConfig = useBlogConfig()
  return computed(() => typeof blogConfig.value?.backToTop === 'boolean' ? undefined : blogConfig.value?.backToTop)
}

export function useOpenBackToTop() {
  const blogConfig = useBlogConfig()
  return computed(() => blogConfig.value?.backToTop !== false)
}

export function useCommentConfig() {
  const blogConfig = useBlogConfig()
  return computed(() => {
    return blogConfig.value?.comment === false ? undefined : blogConfig.value?.comment
  })
}

export function useOpenCommentConfig() {
  const blogConfig = useBlogConfig()
  const { frontmatter } = useData()
  return computed(() => !!blogConfig.value?.comment && frontmatter.value.comment !== false)
}

export function useFriendData() {
  const blogConfig = useBlogConfig()
  return computed(() => blogConfig.value?.friend)
}

export function useCleanUrls() {
  const { site } = useData()
  return !!site.value.cleanUrls
}

export function useImageStyle() {
  const blogConfig = useBlogConfig()
  return computed<Theme.ImageStyleConfig>(() => blogConfig.value?.imageStyle || {})
}

export function useHomeAnalysis() {
  const home = useHomeConfig()
  return computed(() => home.value?.analysis)
}

export function useAnalyzeTitles(wordCount: Ref<number>, readTime: ComputedRef<number>) {
  const article = computed(() => useConfig()?.value.blog?.article)

  const topWordCount = computed(() =>
    replaceValue(article.value?.analyzeTitles?.topWordCount || '字数：{{value}} 个字', wordCount.value)
  )
  const topReadTime = computed(() =>
    replaceValue(article.value?.analyzeTitles?.topReadTime || '预计：{{value}} 分钟', readTime.value)
  )
  const inlineWordCount = computed(() =>
    replaceValue(article.value?.analyzeTitles?.inlineWordCount || '{{value}} 个字', wordCount.value)
  )
  const inlineReadTime = computed(() =>
    replaceValue(article.value?.analyzeTitles?.inlineReadTime || '{{value}} 分钟', readTime.value)
  )

  const wordCountTitle = computed(() =>
    article.value?.analyzeTitles?.wordCount || '文章字数'
  )
  const readTimeTitle = computed(() =>
    article.value?.analyzeTitles?.readTime || '预计阅读时间'
  )

  const authorTitle = computed(() =>
    article.value?.analyzeTitles?.author || '本文作者'
  )

  const publishDateTitle = computed(() =>
    article.value?.analyzeTitles?.publishDate || '发布时间'
  )

  const lastUpdatedTitle = computed(() =>
    article.value?.analyzeTitles?.lastUpdated || '最近修改时间'
  )

  const tagTitle = computed(() =>
    article.value?.analyzeTitles?.tag || '标签'
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
  return computed(() => {
    if (typeof blog.value?.formatShowDate === 'function') {
      return blog.value.formatShowDate
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
        ...blog.value?.formatShowDate
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
  })
}
