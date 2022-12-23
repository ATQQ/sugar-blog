<template>
  <div class="blog-info">
    <!-- 统计数据，日后支持，点击筛选出左侧的数据 -->
    <div class="card overview-data">
      <div class="overview-item">
        <span class="count">{{ docs.length }}</span>
        <span class="label">博客文章</span>
      </div>
      <div class="split"></div>
      <div class="overview-item">
        <span class="count">+{{ currentMonth?.length }}</span>
        <span class="label">本月上新</span>
      </div>
      <div class="split"></div>
      <div class="overview-item">
        <span class="count">+{{ currentWeek?.length }}</span>
        <span class="label">本周上新</span>
      </div>
    </div>

    <!-- 置顶的一些文章 -->
    <div class="card overview-data recommend">
      <!-- 头部 -->
      <div class="card-header">
        <span class="title">🔥 精选文章</span>
        <el-button
          v-if="showChangeBtn"
          size="small"
          type="primary"
          text
          @click="changePage"
          >换一组</el-button
        >
      </div>
      <!-- 文章列表 -->
      <ol class="recommend-container">
        <li v-for="(v, idx) in currentWikiData" :key="v.route">
          <!-- 序号 -->
          <i class="num">{{ idx + 1 }}</i>
          <!-- 简介 -->
          <div class="des">
            <!-- title -->
            <el-link type="info" class="title" :href="v.route">{{
              v.meta.title
            }}</el-link>
            <!-- 描述信息 -->
            <div class="suffix">
              <!-- 日期 -->
              <span class="tag">{{ formatShowDate(v.meta.date) }}</span>
            </div>
          </div>
        </li>
      </ol>
    </div>

    <!-- 标签 -->
    <div class="card overview-data tags">
      <!-- 头部 -->
      <div class="card-header">
        <span class="title">🏷 标签</span>
        <el-tag
          v-if="activeTag.label"
          :type="(activeTag.type as any)"
          :effect="colorMode"
          closable
          @close="handleCloseTag"
        >
          {{ activeTag.label }}
        </el-tag>
      </div>
      <!-- 标签列表 -->
      <ul class="tag-list">
        <li v-for="(tag, idx) in tags" :key="tag">
          <el-tag
            :type="tagType[idx % tagType.length]"
            @click="handleTagClick(tag, tagType[idx % tagType.length])"
            :effect="colorMode"
          >
            {{ tag }}
          </el-tag>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElButton, ElLink, ElTag } from 'element-plus'
import { useDark } from '@vueuse/core'
import { useHomeData } from '../../composables/home'
import { isCurrentWeek } from '../../utils'
import { formatShowDate } from '../blog-item'

const homeData = useHomeData()!
const docs = computed(() => homeData.docs)

const nowMonth = new Date().getMonth()
const nowYear = new Date().getFullYear()
const currentMonth = computed(() => {
  return docs.value.filter((v) => {
    const pubDate = new Date(v.meta?.date)
    return pubDate?.getMonth() === nowMonth && pubDate.getFullYear() === nowYear
  })
})

const currentWeek = computed(() => {
  return docs.value.filter((v) => {
    const pubDate = new Date(v.meta?.date)
    return isCurrentWeek(pubDate)
  })
})

const recommendList = computed(() => {
  const data = docs.value.filter((v) => v.meta.sticky)
  data.sort((a, b) => b.meta.sticky! - a.meta.sticky!)
  return [...data]
})
const pageSize = ref(9)
const currentPage = ref(1)
const changePage = () => {
  const newIdx =
    currentPage.value % Math.ceil(recommendList.value.length / pageSize.value)
  currentPage.value = newIdx + 1
}

const currentWikiData = computed(() => {
  const startIdx = (currentPage.value - 1) * pageSize.value
  const endIdx = startIdx + pageSize.value
  return recommendList.value.slice(startIdx, endIdx)
})

const showChangeBtn = computed(() => {
  return recommendList.value.length > pageSize.value
})

const tags = computed(() => {
  return [...new Set(docs.value.map((v) => v.meta.tag || []).flat(3))]
})

const activeTag = homeData.activeTag.value
// 同一个引用
// console.log(activeTag === homeData.activeTag.value);

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance'
})

const colorMode = computed(() => (isDark.value ? 'light' : 'dark'))

const tagType: any = ['', 'info', 'success', 'warning', 'danger']

const handleCloseTag = () => {
  activeTag.label = ''
  activeTag.type = ''
}

const handleTagClick = (tag: string, type: string) => {
  if (tag === activeTag.label) {
    handleCloseTag()
    return
  }
  activeTag.type = type
  activeTag.label = tag
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
