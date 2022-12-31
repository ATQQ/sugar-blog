<template>
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
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { isCurrentWeek } from '../utils'
import { useConfig } from '../composables/config/blog'

const blogConfig = useConfig()
const docs = computed(() => blogConfig.config.pagesData)

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
</script>

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
