<script lang="ts" setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { isCurrentWeek } from '../utils/client'
import { useArticles, useHomeAnalysis, useHomeConfig } from '../composables/config/blog'
import BlogAuthor from './BlogAuthor.vue'

const home = useHomeConfig()
const { frontmatter } = useData()
const avatarMode = computed(() => frontmatter.value?.blog?.avatarMode || home?.value?.avatarMode || 'card')

const showCardAvatar = computed(() => avatarMode.value === 'card')
const showSplitCard = computed(() => avatarMode.value === 'split')

const docs = useArticles()
const notHiddenArticles = computed(() => {
  return docs.value.filter(v => v.meta?.publish !== false)
})
const nowMonth = new Date().getMonth()
const nowYear = new Date().getFullYear()
const currentMonth = computed(() => {
  return notHiddenArticles.value.filter((v) => {
    const pubDate = new Date(v.meta?.date)
    return pubDate?.getMonth() === nowMonth && pubDate.getFullYear() === nowYear
  })
})

const currentWeek = computed(() => {
  return notHiddenArticles.value.filter((v) => {
    const pubDate = new Date(v.meta?.date)
    return isCurrentWeek(pubDate)
  })
})

const analysis = useHomeAnalysis()
const titles = computed(() => (frontmatter.value?.blog?.analysis?.articles?.title || analysis?.value?.articles?.title || []))
</script>

<template>
  <!-- 头像信息 -->
  <BlogAuthor v-if="showSplitCard" />
  <div class="card">
    <BlogAuthor v-if="showCardAvatar" />
    <div class="overview-data">
      <div class="overview-item">
        <span class="count">{{ notHiddenArticles.length }}</span>
        <span class="label">{{ titles[0] || '博客文章' }}</span>
      </div>
      <div class="split" />
      <div class="overview-item">
        <span class="count">+{{ currentMonth?.length }}</span>
        <span class="label">{{ titles[1] || '本月更新' }}</span>
      </div>
      <div class="split" />
      <div class="overview-item">
        <span class="count">+{{ currentWeek?.length }}</span>
        <span class="label">{{ titles[2] || '本周更新' }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  position: relative;
  margin: 0 auto 10px;
  padding: 10px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition: all 0.3s;
  background-color: rgba(var(--bg-gradient));
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
}

.overview-data {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.split {
  width: 1px;
  opacity: 0.8;
  height: 10px;
  background-color: var(--badge-font-color);
}

.overview-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 0 10px;

  .count {
    font-size: 18px;
  }

  .label {
    margin-top: 6px;
    font-size: 12px;
    color: var(--description-font-color);
  }
}
</style>
