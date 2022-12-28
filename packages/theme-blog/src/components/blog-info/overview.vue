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
import { useHomeData } from '../../composables/home'
import { isCurrentWeek } from '../../utils'

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
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
