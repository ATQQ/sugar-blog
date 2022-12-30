<template>
  <div>
    <ul>
      <li v-for="v in currentWikiData" :key="v.route">
        <blog-item
          :route="v.route"
          :title="v.meta.title"
          :description="v.meta.description"
          :date="v.meta.date"
          :tag="v.meta.tag"
          :cover="v.meta.cover"
        />
      </li>
    </ul>
    <el-pagination
      small
      background
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="filterData.length"
      layout="prev, pager, next, jumper"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElPagination } from 'element-plus'
import BlogItem from '../blog-item/index.vue'
import { useConfig, useActiveTag } from '../../composables/config/blog'

const blogConfig = useConfig()
const docs = computed(() => blogConfig.config.pagesData)

const activeTag = useActiveTag()

const activeTagLabel = computed(() => activeTag.value.label)

const wikiList = computed(() => {
  const data = docs.value.filter((v) => v.meta.date)
  data.sort((a, b) => +new Date(b.meta.date) - +new Date(a.meta.date))
  return data
})

const filterData = computed(() => {
  if (!activeTagLabel.value) return wikiList.value
  return wikiList.value.filter((v) => v.meta.tag.includes(activeTagLabel.value))
})
const pageSize = ref(6)
const currentPage = ref(1)

const currentWikiData = computed(() => {
  const startIdx = (currentPage.value - 1) * pageSize.value
  const endIdx = startIdx + pageSize.value
  return filterData.value.slice(startIdx, endIdx)
})
</script>
<style lang="scss" scoped></style>
