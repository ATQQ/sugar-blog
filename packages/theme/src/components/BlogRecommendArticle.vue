<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, withBase } from 'vitepress'
import { wrapperCleanUrls } from '../utils/client'
import {
  useArticles,
  useCleanUrls,
  useFormatShowDate,
  useOml2dOptions,
  useRecommendConfig,
  useShowRecommend,
} from '../composables/config/blog'
import { recommendSVG } from '../constants/svg'
import type { Theme } from '../composables/config/index'

const formatShowDate = useFormatShowDate()

const recommend = useRecommendConfig()
const show = useShowRecommend()

const sidebarStyle = computed(() =>
  recommend.value?.style ?? 'sidebar'
)

const showDate = computed(() => recommend.value?.showDate ?? true)
const showNum = computed(() => recommend.value?.showNum ?? true)

const title = computed(() => recommend.value?.title ?? (`<span class="svg-icon">${recommendSVG}</span>` + '相关文章'))
const pageSize = computed(() => recommend.value?.pageSize || 9)
const collapseText = computed(() => recommend.value?.collapseText || '收起')
const expandText = computed(() => recommend.value?.expandText || '相关文章')
const collapsible = computed(() => recommend.value?.collapsible ?? true)
const emptyText = computed(() => recommend.value?.empty ?? '暂无相关文章')

const docs = useArticles()
const route = useRoute()

function isCurrentDoc(value: string) {
  if (!value)
    return false
  const clean = (p: string) => decodeURIComponent(p).replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '')
  const currentPath = clean(route.path)
  const targetPath = clean(value)
  return currentPath === targetPath || currentPath === clean(withBase(value))
}

// 首页文章列表逻辑（置顶优先 + 发布日期倒序）
const homeList = computed(() => {
  const topList = docs.value.filter(v => !v.meta.hidden && !!v.meta.top)
  topList.sort((a, b) => {
    const aTop = a?.meta?.top
    const bTop = b?.meta.top
    return Number(aTop) - Number(bTop)
  })
  const normalList = docs.value.filter(
    v => v.meta.date && v.meta.title && !v.meta.top && !v.meta.hidden
  )
  normalList.sort((a, b) => +new Date(b.meta.date) - +new Date(a.meta.date))
  return topList.concat(normalList)
})

function getRecommendCategory(page?: Theme.PageData): string[] {
  if (!page)
    return []
  const { meta } = page
  if (Array.isArray(meta.recommend)) {
    return meta.recommend.filter(v => typeof v === 'string') as string[]
  }
  if (typeof meta.recommend === 'string') {
    return [meta.recommend]
  }
  return []
}

function getRecommendValue(page?: Theme.PageData) {
  return Array.isArray(page?.meta?.recommend)
    ? page.meta.recommend[page.meta.recommend.length - 1]
    : page?.meta?.recommend
}

function hasIntersection(arr1: any[], arr2: any[]) {
  return arr1.some(item => arr2.includes(item))
}

// 兼容按目录/分类匹配的推荐列表
const directoryList = computed(() => {
  const paths = decodeURIComponent(route.path).split('/')
  const currentPage = docs.value.find(v => isCurrentDoc(v.route))
  const currentRecommendCategory = getRecommendCategory(currentPage)
  const origin = docs.value.filter((v) => {
    if (currentRecommendCategory.length) {
      return hasIntersection(currentRecommendCategory, getRecommendCategory(v))
    }
    return (
      v.route.split('/').length === paths.length
      && v.route.startsWith(paths.slice(0, paths.length - 1).join('/'))
    )
  })

  const topList = origin.filter((v) => {
    const value = getRecommendValue(v)
    return typeof value === 'number'
  })
  topList.sort((a, b) => Number(getRecommendValue(a)) - Number(getRecommendValue(b)))

  const normalList = origin.filter(v => typeof getRecommendValue(v) !== 'number')

  const sortMode = recommend.value?.sort ?? 'date'
  let compareFn = (a: any, b: any) => +new Date(b.meta.date) - +new Date(a.meta.date)
  if (sortMode === 'filename') {
    compareFn = (a: any, b: any) => {
      const aName = a.route.split('/').pop() || ''
      const bName = b.route.split('/').pop() || ''
      return aName.localeCompare(bName)
    }
  }
  if (typeof sortMode === 'function') {
    compareFn = sortMode
  }
  normalList.sort(compareFn)

  return topList.concat(normalList)
})

const recommendList = computed(() => {
  const mode = recommend.value?.mode ?? 'home'
  const sourceList = mode === 'directory' ? directoryList.value : homeList.value

  return sourceList
    .map(v => ({ ...v, route: withBase(v.route) }))
    .filter(v => !!v.meta.title)
    .filter(
      v =>
        (recommend.value?.showSelf ?? true)
        || !isCurrentDoc(v.route)
    )
    .filter(v => v.meta.recommend !== false)
    .filter(v => recommend.value?.filter?.(v) ?? true)
})

const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(recommendList.value.length / pageSize.value) || 1)

// 当前页开始的序号
const startIdx = computed(() => (currentPage.value - 1) * pageSize.value)

const currentWikiData = computed(() => {
  const start = startIdx.value
  const end = start + pageSize.value
  return recommendList.value.slice(start, end)
})

function scrollToActiveItem() {
  nextTick(() => {
    const activeEl = document.querySelector('.recommend-container li.active')
    if (activeEl) {
      (activeEl as HTMLElement).scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

function updateCurrentPage() {
  const currentIdx = recommendList.value.findIndex(v => isCurrentDoc(v.route))
  if (currentIdx !== -1) {
    currentPage.value = Math.floor(currentIdx / pageSize.value) + 1
    scrollToActiveItem()
  }
}

watch(currentPage, () => {
  nextTick(() => {
    const container = document.querySelector('.recommend-container')
    if (container) {
      container.scrollTop = 0
    }
  })
})

watch(
  () => route.path,
  () => {
    nextTick(() => {
      updateCurrentPage()
    })
  }
)

watch(recommendList, () => {
  updateCurrentPage()
})

const cleanUrls = useCleanUrls()
const router = useRouter()

function handleLinkClick(link: string) {
  router.go(link)
}

// 避让左下方桌宠 (oml2d) 逻辑
const oml2dOptions = useOml2dOptions()
const bottomOffset = computed(() => {
  if (recommend.value?.bottomOffset != null) {
    return typeof recommend.value.bottomOffset === 'number'
      ? `${recommend.value.bottomOffset}px`
      : String(recommend.value.bottomOffset)
  }
  if (oml2dOptions.value) {
    const h = (oml2dOptions.value as any)?.size?.height || 200
    return `${h + 20}px`
  }
  return '20px'
})

// 侧边栏折叠/展开逻辑
const isCollapsed = ref(false)
const STORAGE_KEY = 'sugar-blog-sidebar-collapsed'

function setCollapse(val: boolean) {
  isCollapsed.value = val
  if (typeof document !== 'undefined') {
    if (val) {
      document.documentElement.classList.add('blog-sidebar-collapsed')
    }
    else {
      document.documentElement.classList.remove('blog-sidebar-collapsed')
    }
    try {
      localStorage.setItem(STORAGE_KEY, val ? '1' : '0')
    }
    catch {}
  }
}

function toggleCollapse() {
  setCollapse(!isCollapsed.value)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--blog-sidebar-bottom', bottomOffset.value)

    if (collapsible.value) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved != null) {
          setCollapse(saved === '1')
        }
        else if (recommend.value?.collapsed) {
          setCollapse(true)
        }
      }
      catch {}
    }
  }
  updateCurrentPage()
})

watch(bottomOffset, (val) => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--blog-sidebar-bottom', val)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.removeProperty('--blog-sidebar-bottom')
    document.documentElement.classList.remove('blog-sidebar-collapsed')
  }
})
</script>

<template>
  <div
    v-if="show && (recommendList.length || emptyText)"
    class="recommend"
    :class="{ card: sidebarStyle === 'card' }"
    data-pagefind-ignore="all"
  >
    <!-- 头部 -->
    <div class="card-header">
      <div class="header-title">
        <span v-if="title" class="title" v-html="title" />
      </div>
      <div class="header-actions">
        <!-- 下拉形式分页 -->
        <div v-if="totalPages > 1" class="page-select-wrapper">
          <select
            v-model="currentPage"
            class="page-select"
            title="选择分页"
          >
            <option
              v-for="p in totalPages"
              :key="p"
              :value="p"
            >
              第 {{ p }}/{{ totalPages }} 页
            </option>
          </select>
          <span class="select-arrow">▾</span>
        </div>

        <!-- 收起按钮 -->
        <button
          v-if="collapsible"
          type="button"
          class="collapse-btn"
          :title="collapseText"
          @click="toggleCollapse"
        >
          <span class="collapse-icon">&lt;</span>
          <span>{{ collapseText }}</span>
        </button>
      </div>
    </div>
    <!-- 文章列表 -->
    <ol
      v-if="currentWikiData.length"
      :class="{
        'hide-num': !showNum,
      }"
      class="recommend-container"
    >
      <li
        v-for="(v, idx) in currentWikiData"
        :key="v.route"
        :class="{ active: isCurrentDoc(v.route) }"
      >
        <!-- 序号 -->
        <i v-if="showNum" class="num">{{ startIdx + idx + 1 }}</i>
        <!-- 简介 -->
        <div class="des">
          <!-- title -->
          <a
            class="title"
            :class="{
              current: isCurrentDoc(v.route),
            }"
            :href="wrapperCleanUrls(cleanUrls, v.route)"
            @click="(e) => {
              e.preventDefault()
              handleLinkClick(wrapperCleanUrls(cleanUrls, v.route))
            }"
          >
            <span>{{ v.meta.title }}</span>
          </a>
          <!-- 描述信息 -->
          <div v-if="showDate" class="suffix">
            <!-- 日期 -->
            <span class="tag">{{ formatShowDate(v.meta.date) }}</span>
          </div>
        </div>
      </li>
    </ol>
    <div v-else class="empty-text">
      {{ emptyText }}
    </div>
  </div>

  <!-- 展开悬浮按钮 (Teleport 到 body，避免受侧边栏位移遮罩影响) -->
  <ClientOnly>
    <Teleport to="body">
      <Transition name="sidebar-fade">
        <button
          v-if="show && collapsible && isCollapsed"
          class="blog-sidebar-expand-btn"
          type="button"
          :title="`展开${expandText}`"
          @click="toggleCollapse"
        >
          <span class="expand-icon">&gt;</span>
          <span class="expand-text">{{ expandText }}</span>
        </button>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.recommend {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  padding: 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.recommend.card {
  padding: 0;
  background-color: transparent;
  border-radius: 0;
}

.card-header {
  flex-shrink: 0;
  display: flex;
  width: calc(100% + 28px);
  margin-left: -14px;
  margin-right: -14px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  position: sticky;
  top: 0;
  z-index: 10;
  user-select: none;
}

.header-title .title {
  font-size: 13.5px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--vp-c-text-1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 下拉分页 */
.page-select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.page-select {
  appearance: none;
  -webkit-appearance: none;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 2px 18px 2px 6px;
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  outline: none;
  line-height: 18px;
  transition: all 0.2s ease;
}

.page-select:hover,
.page-select:focus {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.select-arrow {
  position: absolute;
  right: 5px;
  pointer-events: none;
  font-size: 10px;
  color: var(--vp-c-text-3);
  line-height: 1;
}

/* 收起按钮 */
.collapse-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  line-height: 18px;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-alt);
  border-color: var(--vp-c-divider);
}

.collapse-icon {
  font-size: 10px;
}

/* 文章列表容器：独立占据剩余空间，支持下拉滑动，隐藏滚动条 */
.recommend-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 6px 0 0 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.recommend-container::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.recommend-container.hide-num > li {
  padding: 5px 6px;
}

.recommend-container li {
  display: flex;
  align-items: flex-start;
  padding: 6px 6px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.recommend-container li:hover {
  background-color: var(--vp-c-bg-alt, rgba(0, 0, 0, 0.04));
}

.recommend-container li.active {
  background-color: var(--vp-c-brand-soft, rgba(64, 158, 255, 0.08));
}

.recommend-container li .num {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-weight: 500;
  margin-right: 8px;
  min-width: 16px;
  padding-top: 2px;
  text-align: center;
  font-style: normal;
}

.recommend-container li.active .num {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.recommend-container li .des {
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.recommend-container li .title {
  font-size: 13px;
  line-height: 1.45;
  color: var(--vp-c-text-1);
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 400;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
}

.recommend-container li:hover .title {
  color: var(--vp-c-brand-1);
}

.recommend-container li.active .title {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.recommend-container li .suffix {
  margin-top: 3px;
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}

.recommend-container li.active .suffix {
  color: var(--vp-c-brand-1);
  opacity: 0.8;
}

.empty-text {
  padding: 12px 6px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-align: center;
}
</style>
