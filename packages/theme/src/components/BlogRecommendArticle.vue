<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, withBase } from 'vitepress'
import { wrapperCleanUrls } from '../utils/client'
import {
  useArticles,
  useCleanUrls,
  useFormatShowDate,
  useRecommendConfig,
  useShowRecommend,
} from '../composables/config/blog'
import { useSidebarToggle } from '../composables/sidebar'
import type { Theme } from '../composables/config/index'

const { collapse } = useSidebarToggle()

const formatShowDate = useFormatShowDate()

const recommend = useRecommendConfig()
const show = useShowRecommend()

const sidebarStyle = computed(() =>
  recommend.value?.style ?? 'sidebar'
)

const showDate = computed(() => recommend.value?.showDate ?? true)
const showNum = computed(() => recommend.value?.showNum ?? true)

const pageSize = computed(() => recommend.value?.pageSize || 9)
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

const headerTitleText = computed(() => {
  if (recommend.value?.title && typeof recommend.value.title === 'string') {
    const plain = recommend.value.title.replace(/<[^>]+>/g, '').trim()
    if (plain)
      return plain
  }
  return '相关文章'
})

// 需求2：搜索与实时过滤
const isSearchActive = ref(false)
const searchKeyword = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
let searchBlurTimer: any = null

function startSearch() {
  if (searchBlurTimer) {
    clearTimeout(searchBlurTimer)
    searchBlurTimer = null
  }
  isSearchActive.value = true
  nextTick(() => {
    searchInputRef.value?.focus()
  })
  resetIdleTimer()
}

function cancelSearch() {
  if (searchBlurTimer) {
    clearTimeout(searchBlurTimer)
    searchBlurTimer = null
  }
  isSearchActive.value = false
  searchKeyword.value = ''
  resetIdleTimer()
}

function handleSearchBlur() {
  searchBlurTimer = setTimeout(() => {
    cancelSearch()
  }, 180)
}

const filteredList = computed(() => {
  const list = recommendList.value
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw)
    return list
  return list.filter(v => v.meta?.title && v.meta.title.toLowerCase().includes(kw))
})

// 需求1：分页控件
const currentPage = ref(1)

watch(searchKeyword, () => {
  currentPage.value = 1
  resetIdleTimer()
})

const totalPages = computed(() => Math.ceil(filteredList.value.length / pageSize.value) || 1)

// 当前页开始的序号
const startIdx = computed(() => (currentPage.value - 1) * pageSize.value)

const currentWikiData = computed(() => {
  if (isSearchActive.value) {
    return filteredList.value
  }
  const start = startIdx.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

function prevPage() {
  if (totalPages.value <= 1)
    return
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
  else {
    currentPage.value = totalPages.value
  }
  resetIdleTimer()
}

function nextPage() {
  if (totalPages.value <= 1)
    return
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
  else {
    currentPage.value = 1
  }
  resetIdleTimer()
}

// 页码自定义输入跳转（点击中间「38/48」区域切换为输入框）
const isEditingPage = ref(false)
const inputPageVal = ref('')
const pageInputRef = ref<HTMLInputElement | null>(null)

function startEditPage() {
  isEditingPage.value = true
  inputPageVal.value = String(currentPage.value)
  nextTick(() => {
    pageInputRef.value?.focus()
    pageInputRef.value?.select()
  })
}

function handlePageInputFilter(e: Event) {
  const target = e.target as HTMLInputElement
  inputPageVal.value = target.value.replace(/\D/g, '')
}

function confirmPageInput() {
  if (!isEditingPage.value)
    return
  const raw = inputPageVal.value.trim()
  const val = parseInt(raw, 10)
  // 仅在 1 ~ totalPages 范围合法跳转，非法数字自动回退原页码
  if (!Number.isNaN(val) && val >= 1 && val <= totalPages.value) {
    currentPage.value = val
  }
  isEditingPage.value = false
  resetIdleTimer()
}

function cancelPageInput() {
  isEditingPage.value = false
}

// 居中当前激活文章（精确计算容器内部相对偏移，避免触发全局滚动）
function centerActiveItem(behavior: ScrollBehavior = 'smooth') {
  nextTick(() => {
    const container = document.querySelector('.recommend-container') as HTMLElement
    if (!container)
      return
    const activeEl = container.querySelector('li.active') as HTMLElement
    if (activeEl) {
      const containerHeight = container.clientHeight
      const itemTop = activeEl.offsetTop
      const itemHeight = activeEl.clientHeight
      const targetScrollTop = itemTop - (containerHeight / 2) + (itemHeight / 2)
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior,
      })
    }
  })
}

// 10s 未操作重置回到当前阅读文章页数并居中
let idleTimer: any = null

function returnToCurrentArticle() {
  if (isSearchActive.value) {
    cancelSearch()
  }
  const currentIdx = recommendList.value.findIndex(v => isCurrentDoc(v.route))
  if (currentIdx !== -1) {
    const targetPage = Math.floor(currentIdx / pageSize.value) + 1
    if (currentPage.value !== targetPage) {
      currentPage.value = targetPage
    }
    nextTick(() => {
      setTimeout(() => {
        centerActiveItem('smooth')
      }, 50)
    })
  }
}

function resetIdleTimer() {
  if (idleTimer) {
    clearTimeout(idleTimer)
  }
  idleTimer = setTimeout(() => {
    returnToCurrentArticle()
  }, 10000)
}

function updateCurrentPage(behavior: ScrollBehavior = 'smooth') {
  const currentIdx = recommendList.value.findIndex(v => isCurrentDoc(v.route))
  if (currentIdx !== -1) {
    currentPage.value = Math.floor(currentIdx / pageSize.value) + 1
    nextTick(() => {
      setTimeout(() => {
        centerActiveItem(behavior)
      }, 50)
    })
  }
}

watch(currentPage, () => {
  nextTick(() => {
    const currentIdx = recommendList.value.findIndex(v => isCurrentDoc(v.route))
    const currentDocPage = currentIdx !== -1 ? Math.floor(currentIdx / pageSize.value) + 1 : -1
    if (currentPage.value === currentDocPage) {
      setTimeout(() => {
        centerActiveItem('smooth')
      }, 50)
    }
    else {
      const container = document.querySelector('.recommend-container')
      if (container) {
        container.scrollTop = 0
      }
    }
  })
})

watch(
  () => route.path,
  () => {
    nextTick(() => {
      updateCurrentPage()
      resetIdleTimer()
    })
  }
)

watch(recommendList, () => {
  updateCurrentPage()
  resetIdleTimer()
})

const cleanUrls = useCleanUrls()
const router = useRouter()

function handleLinkClick(link: string) {
  router.go(link)
}

onMounted(() => {
  updateCurrentPage('auto')
  resetIdleTimer()
})

onBeforeUnmount(() => {
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }
  if (searchBlurTimer) {
    clearTimeout(searchBlurTimer)
    searchBlurTimer = null
  }
})
</script>

<template>
  <div
    v-if="show && (recommendList.length || emptyText)"
    class="recommend"
    :class="{ card: sidebarStyle === 'card' }"
    data-pagefind-ignore="all"
    @mousemove="resetIdleTimer"
    @click="resetIdleTimer"
    @keydown="resetIdleTimer"
    @wheel.passive="resetIdleTimer"
    @touchstart.passive="resetIdleTimer"
  >
    <!-- 头部控件行：容器外框大小圆角不变 -->
    <div class="card-header" :class="{ 'is-searching': isSearchActive }">
      <!-- 搜索态：隐藏内部所有原有控件，替换为搜索输入框 -->
      <div v-if="isSearchActive" class="search-bar-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref="searchInputRef"
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索文章标题"
          @blur="handleSearchBlur"
          @keydown.esc="cancelSearch"
        >
        <button
          type="button"
          class="search-clear-btn"
          title="清空并返回"
          @mousedown.prevent
          @click="cancelSearch"
        >
          <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      <!-- 默认态：显示相关文章文字、搜索图标、分页、收起按钮，原有功能保留 -->
      <template v-else>
        <!-- 左侧：标题 -->
        <div class="header-left">
          <span class="header-title-text">{{ headerTitleText }}</span>
        </div>

        <!-- 右侧：搜索控件、分页控件、收起按钮 -->
        <div class="header-right">
          <!-- 搜索图标 -->
          <button
            type="button"
            class="search-toggle-btn"
            title="搜索文章"
            @click="startSearch"
          >
            <svg class="search-icon" viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <!-- 分页控件交互：<  38/48  > -->
          <div v-if="totalPages > 1 || filteredList.length > 0" class="pill-pager">
            <button
              type="button"
              class="pager-btn pager-prev"
              :disabled="totalPages <= 1"
              title="上一组文章"
              @click="prevPage"
            >
              <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <!-- 点击中间整个「38/48」区域整体切换为输入框 -->
            <div
              class="pager-middle"
              :class="{ 'is-editing': isEditingPage }"
              :title="!isEditingPage ? '点击输入页码跳转' : undefined"
              @click="!isEditingPage && startEditPage()"
            >
              <span
                v-if="!isEditingPage"
                class="pager-text"
              >
                {{ currentPage }}/{{ totalPages }}
              </span>
              <input
                v-else
                ref="pageInputRef"
                v-model="inputPageVal"
                class="pager-input"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="4"
                @input="handlePageInputFilter"
                @blur="confirmPageInput"
                @keydown.enter.prevent="confirmPageInput"
                @keydown.esc.prevent="cancelPageInput"
              >
            </div>

            <button
              type="button"
              class="pager-btn pager-next"
              :disabled="totalPages <= 1"
              title="下一组文章"
              @click="nextPage"
            >
              <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <!-- 收起侧边栏按钮 -->
          <button class="sidebar-collapse-btn" title="收起侧边栏" @click="collapse">
            <svg class="collapse-icon" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="15 18 9 12 15 6" /></svg>
            <span class="btn-text">收起</span>
          </button>
        </div>
      </template>
    </div>
    <!-- 文章列表 -->
    <ol
      v-if="currentWikiData.length"
      :class="{
        'hide-num': !showNum,
      }"
      class="recommend-container"
      @scroll.passive="resetIdleTimer"
    >
      <li
        v-for="(v, idx) in currentWikiData"
        :key="v.route"
        :class="{ active: isCurrentDoc(v.route) }"
      >
        <!-- 序号 -->
        <i v-if="showNum" class="num">{{ (isSearchActive ? 0 : startIdx) + idx + 1 }}</i>
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
      {{ searchKeyword ? '暂无文章' : emptyText }}
    </div>
  </div>
</template>

<style scoped>
.recommend {
  display: flex;
  flex-direction: column;
  margin-top: 6px; /* 与上方作者区域/导航分割线保持安全间距 */
  max-height: calc(100vh - var(--vp-nav-height, 64px) - 200px); /* 底部为桌宠预留空间 */
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.recommend.card {
  padding: 0;
  background-color: transparent;
  border-radius: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--vp-sidebar-bg-color, var(--vp-c-bg));
  padding: 8px 0 10px;
  border-bottom: 1px solid var(--vp-c-divider-light, rgba(60, 60, 67, 0.08));
  gap: 4px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 0;
  flex-shrink: 0;
}

.header-title-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}

.card-header.is-searching {
  justify-content: stretch;
  padding: 10px 0 10px; /* 搜索态增加顶部留白，彻底避免与上方重叠 */
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  flex-shrink: 0;
  margin-right: 19px; /* 整行全部内容与左侧标题一起左移，行内各元素相对位置、尺寸完全不变 */
}

/* 搜索控件交互：默认单独 icon 按钮，点击展开为圆角输入框 */
.search-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid transparent;
  background-color: transparent;
  color: var(--vp-c-brand-1, #3b82f6);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  line-height: 1;
  flex-shrink: 0;
}

.search-toggle-btn:hover {
  background-color: var(--vp-c-brand-soft, rgba(64, 158, 255, 0.14));
  border-color: var(--vp-c-brand-1, #3b82f6);
}

/* 搜索态：隐藏内部所有原有控件，替换为通栏搜索输入框 */
.search-bar-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 24px;
  background-color: #ffffff;
  border: 1px solid var(--vp-c-brand-1, #3b82f6);
  border-radius: 12px;
  padding: 0 6px 0 8px;
  gap: 5px;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.15);
  transition: all 0.2s ease;
}

.search-bar-wrap .search-icon {
  flex-shrink: 0;
  color: var(--vp-c-brand-1, #3b82f6);
  display: block;
}

.search-bar-wrap .search-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1, #0f172a);
  font-size: 11.5px;
  padding: 0;
  outline: none;
  font-family: inherit;
}

.search-bar-wrap .search-input::placeholder {
  color: var(--vp-c-text-3, #94a3b8);
  font-size: 11px;
}

.search-bar-wrap .search-clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--vp-c-text-3, #94a3b8);
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  line-height: 1;
  transition: all 0.15s ease;
}

.search-bar-wrap .search-clear-btn:hover {
  color: var(--vp-c-brand-1, #3b82f6);
  background: var(--vp-c-brand-soft, rgba(64, 158, 255, 0.2));
}

/* 需求1：分页控件（格式：< 38/48 >，背景使用白色） */
.pill-pager {
  display: inline-flex;
  align-items: center;
  height: 22px;
  background-color: #ffffff;
  border: 1px solid var(--vp-c-brand-1, #3b82f6);
  border-radius: 11px;
  padding: 0 2px;
  box-sizing: border-box;
  user-select: none;
  transition: all 0.2s ease;
  line-height: 1;
}

.pill-pager:hover {
  border-color: var(--vp-c-brand-1, #3b82f6);
}

.pager-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--vp-c-brand-1, #3b82f6);
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
  line-height: 1;
}

.pager-btn svg {
  display: block;
  pointer-events: none;
}

.pager-btn:hover:not(:disabled) {
  color: #ffffff;
  background-color: var(--vp-c-brand-1, #3b82f6);
}

.pager-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pager-middle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  min-width: 34px;
  padding: 0 2px;
  margin: 0 1px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.pager-middle:hover:not(.is-editing) {
  background-color: var(--vp-c-bg, #ffffff);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.pager-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-brand-1, #3b82f6);
  padding: 0 3px;
  line-height: 18px;
  letter-spacing: -0.2px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  user-select: none;
}

.pager-input {
  width: 34px;
  height: 18px;
  padding: 0 2px;
  margin: 0;
  border: 1px solid var(--vp-c-brand-1, #3b82f6);
  border-radius: 3px;
  background: var(--vp-c-bg, #ffffff);
  color: var(--vp-c-brand-1, #3b82f6);
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  outline: none;
  font-family: inherit;
  line-height: 18px;
  box-sizing: border-box;
  box-shadow: 0 0 0 1px var(--vp-c-brand-1, #3b82f6);
}

.sidebar-collapse-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 22px;
  padding: 0 6px 0 4px;
  border-radius: 11px;
  border: 1px solid var(--vp-c-brand-1, #3b82f6);
  color: var(--vp-c-brand-1, #3b82f6);
  background: var(--vp-c-brand-soft, rgba(64, 158, 255, 0.1));
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  line-height: 1;
}

.sidebar-collapse-btn:hover {
  color: #fff;
  background: var(--vp-c-brand-1, #3b82f6);
}

.collapse-icon {
  display: inline-block;
  vertical-align: middle;
}

/* 列表独立滚动与美化滚动条 */
.recommend-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 6px 0 0 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-divider, rgba(60, 60, 67, 0.2)) transparent;
}

.recommend-container::-webkit-scrollbar {
  width: 4px;
}

.recommend-container::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider, rgba(60, 60, 67, 0.25));
  border-radius: 4px;
}

.recommend-container.hide-num > li {
  padding: 5px 6px 5px 2px;
}

.recommend-container li {
  display: flex;
  align-items: flex-start;
  padding: 6px 6px 6px 2px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.recommend-container li:hover {
  background-color: var(--vp-c-bg-alt, rgba(0, 0, 0, 0.04));
}

.recommend-container li.active {
  background-color: var(--vp-c-brand-soft, rgba(64, 158, 255, 0.08));
}

/* 序号与文章第一行标题严格基准对齐：统一 line-height 为 20px */
.recommend-container li .num {
  display: inline-block;
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-weight: 600;
  margin-right: 6px;
  min-width: 16px;
  text-align: left;
  line-height: 20px;
  height: 20px;
  flex-shrink: 0;
  font-style: normal;
  font-family: var(--vp-font-family-base, inherit);
  box-sizing: border-box;
}

.recommend-container li.active .num {
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

.recommend-container li .des {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.recommend-container li .title {
  font-size: 13px;
  line-height: 20px;
  margin: 0;
  padding: 0;
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
