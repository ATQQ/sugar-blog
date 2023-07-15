<template>
  <ul data-pagefind-ignore="all">
    <li v-for="v in currentWikiData" :key="v.route">
      <blog-item
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
    <el-pagination
      v-if="wikiList.length >= pageSize"
      small
      background
      :default-current-page="1"
      :current-page="currentPage"
      @update:current-page="handleUpdatePageNum"
      :page-size="pageSize"
      :total="filterData.length"
      layout="prev, pager, next, jumper"
    />
  </ClientOnly>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue'
import { ElPagination } from 'element-plus'
import { useData, useRouter } from 'vitepress'
import { useBrowserLocation } from '@vueuse/core'
import BlogItem from './BlogItem.vue'
import {
  useArticles,
  useActiveTag,
  useBlogConfig,
  useCurrentPageNum
} from '../composables/config/blog'
import { Theme } from '../composables/config'

const { theme, frontmatter } = useData<Theme.Config>()
const globalAuthor = computed(() => theme.value.blog?.author || '')
const docs = useArticles()

const activeTag = useActiveTag()

const activeTagLabel = computed(() => activeTag.value.label)

const wikiList = computed(() => {
  const topList = docs.value.filter((v) => !v.meta.hidden && !!v.meta.top)
  topList.sort((a, b) => {
    const aTop = a?.meta?.top
    const bTop = b?.meta.top
    return Number(aTop) - Number(bTop)
  })
  const data = docs.value.filter(
    (v) => v.meta.date && v.meta.title && !v.meta.top && !v.meta.hidden
  )
  data.sort((a, b) => +new Date(b.meta.date) - +new Date(a.meta.date))
  return topList.concat(data)
})

const filterData = computed(() => {
  if (!activeTagLabel.value) return wikiList.value
  return wikiList.value.filter((v) =>
    v.meta?.tag?.includes(activeTagLabel.value)
  )
})

const { home } = useBlogConfig()
const pageSize = computed(
  () => frontmatter.value.blog?.pageSize || home?.pageSize || 6
)
const currentPage = useCurrentPageNum()
const currentWikiData = computed(() => {
  const startIdx = (currentPage.value - 1) * pageSize.value
  const endIdx = startIdx + pageSize.value
  return filterData.value.slice(startIdx, endIdx)
})

const router = useRouter()
const location = useBrowserLocation()
const queryPageNumKey = 'pageNum'
const handleUpdatePageNum = (current: number) => {
  if (currentPage.value === current) {
    return
  }
  currentPage.value = current
  const { searchParams } = new URL(window.location.href!)
  searchParams.delete(queryPageNumKey)
  searchParams.append(queryPageNumKey, String(current))
  router.go(
    `${location.value.origin}${router.route.path}?${searchParams.toString()}`
  )
}

watch(
  location,
  () => {
    if (location.value.href) {
      const { searchParams } = new URL(location.value.href)
      if (searchParams.has(queryPageNumKey)) {
        currentPage.value = Number(searchParams.get(queryPageNumKey))
      } else {
        currentPage.value = 1
      }
    }
  },
  {
    immediate: true
  }
)
</script>
