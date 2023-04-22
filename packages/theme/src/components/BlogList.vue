<template>
  <ul data-pagefind-ignore="all">
    <li v-for="v in currentWikiData" :key="v.route">
      <blog-item
        :route="v.route"
        :title="v.meta.title"
        :description="v.meta.description"
        :date="v.meta.date"
        :tag="v.meta.tag"
        :cover="v.meta.cover"
        :author="v.meta.author || globalAuthor"
        :pin="v.meta.top"
      />
    </li>
  </ul>
  <el-pagination
    v-if="wikiList.length >= pageSize"
    small
    background
    v-model:current-page="currentPage"
    :page-size="pageSize"
    :total="filterData.length"
    layout="prev, pager, next, jumper"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElPagination } from 'element-plus'
import { useData } from 'vitepress'
import BlogItem from './BlogItem.vue'
import {
  useArticles,
  useActiveTag,
  useBlogConfig
} from '../composables/config/blog'
import { Theme } from '../composables/config'

const { theme, frontmatter } = useData<Theme.Config>()
const globalAuthor = computed(() => theme.value.blog?.author || '')
const docs = useArticles()

const activeTag = useActiveTag()

const activeTagLabel = computed(() => activeTag.value.label)

const wikiList = computed(() => {
  const topList = docs.value.filter((v) => !!v.meta.top)
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
const currentPage = ref(1)

const currentWikiData = computed(() => {
  const startIdx = (currentPage.value - 1) * pageSize.value
  const endIdx = startIdx + pageSize.value
  return filterData.value.slice(startIdx, endIdx)
})
</script>
