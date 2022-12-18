<template>
  <a class="blog-item" :href="route">
    <!-- 左侧信息  -->
    <div class="info-part">
      <!-- 标题 -->
      <p class="title">{{ title }}</p>
      <!-- 简短描述 -->
      <p class="description" v-if="!!description">{{ description }}</p>
      <div class="badge-list">
        <span>{{ author || '粥里有勺糖' }}</span>
        <span class="split">{{ showTime }}</span>
        <span v-if="tag">{{ tag.join(' · ') }}</span>
      </div>
    </div>
    <div
      v-if="cover"
      class="cover-img"
      :style="`background-image: url(${cover});`"
    ></div>
  </a>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { formatShowDate } from './index'

const props = defineProps<{
  route: string
  title: string
  date: string | Date
  sticky?: number
  description?: string
  tag?: string[]
  author?: string
  cover?: string
}>()

const showTime = computed(() => {
  return formatShowDate(props.date)
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
