<script setup lang="ts">
import { computed, watch } from 'vue'
import { ElPagination } from 'element-plus'
import { useData, useRoute, useRouter } from 'vitepress'
import {
  useActiveTag,
  useArticles,
  useCurrentPageNum,
  useGlobalAuthor,
  useHomeConfig
} from '../composables/config/blog'
import type { Theme } from '../composables/config'
import BlogItem from './BlogItem.vue'

const { frontmatter } = useData<Theme.Config>()
const globalAuthor = useGlobalAuthor()
const docs = useArticles()

const activeTag = useActiveTag()

const activeTagLabel = computed(() => activeTag.value.label)

const wikiList = computed(() => {
  const topList = docs.value.filter(v => !v.meta.hidden && !!v.meta.top)
  topList.sort((a, b) => {
    const aTop = a?.meta?.top
    const bTop = b?.meta.top
    return Number(aTop) - Number(bTop)
  })
  const data = docs.value.filter(
    v => v.meta.date && v.meta.title && !v.meta.top && !v.meta.hidden
  )
  data.sort((a, b) => +new Date(b.meta.date) - +new Date(a.meta.date))
  return topList.concat(data)
})

const filterData = computed(() => {
  if (!activeTagLabel.value)
    return wikiList.value
  return wikiList.value.filter(v =>
    v.meta?.tag?.includes(activeTagLabel.value)
  )
})

const home = useHomeConfig()
const pageSize = computed(
  () => frontmatter.value.blog?.pageSize || home?.value?.pageSize || 6
)
const currentPage = useCurrentPageNum()
const currentWikiData = computed(() => {
  const startIdx = (currentPage.value - 1) * pageSize.value
  const endIdx = startIdx + pageSize.value
  return filterData.value.slice(startIdx, endIdx)
})

const router = useRouter()
const queryPageNumKey = 'pageNum'
function handleUpdatePageNum(current: number) {
  if (currentPage.value === current) {
    return
  }
  currentPage.value = current
  const { searchParams } = new URL(window.location.href!)
  searchParams.delete(queryPageNumKey)
  searchParams.append(queryPageNumKey, String(current))
  window.scrollTo({ top: 0, behavior: 'auto' })
  router.go(
    `${router.route.path}?${searchParams.toString()}`
  )
}

const route = useRoute()

function refreshCurrentPage() {
  if (typeof window === 'undefined')
    return
  const search = window.location.search.slice(1)
  const searchParams = new URLSearchParams(search)
  const pageNum = Number(searchParams.get(queryPageNumKey)) || 1
  if (pageNum !== currentPage.value) {
    currentPage.value = pageNum
  }
}
watch(route, () => {
  refreshCurrentPage()
}, { immediate: true })

// 未覆盖的场景处理 左上回到首页
router.onAfterRouteChanged = () => {
  refreshCurrentPage()
}
</script>

<template>
  <ul data-pagefind-ignore="all">
    <li v-for="v in currentWikiData" :key="v.route">
      <BlogItem
        :route="v.route"
        :title="v.meta.title"
        :description="v.meta.description"
        :description-h-t-m-l="v.meta.descriptionHTML"
        :date="v.meta.date"
        :tag="v.meta.tag"
        :cover="v.meta.cover"
        :author="v.meta.author || globalAuthor"
        :pin="v.meta.top"
      />
    </li>
  </ul>
  <!-- 解决element-ui bug -->
  <ClientOnly>
    <div class="el-pagination-wrapper">
      <ElPagination
        v-if="wikiList.length >= pageSize"
        small
        background
        :default-current-page="1"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="filterData.length"
        layout="prev, pager, next, jumper"
        @update:current-page="handleUpdatePageNum"
      />
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.el-pagination-wrapper {
  :deep(.el-pagination li.is-active.number) {
    background-color: var(--vp-c-brand-2);
  }
  :deep(.el-pagination button:hover) {
    color: var(--vp-c-brand-2);
  }

  :deep(.el-pager li:not(.is-active):hover) {
    color: var(--vp-c-brand-2);
  }
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--vp-c-brand-2) inset;
  }
}
</style>
