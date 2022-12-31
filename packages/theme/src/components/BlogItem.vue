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
import { formatShowDate } from '../utils/index'

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
.blog-item {
  position: relative;
  margin: 0 auto 20px;
  padding: 16px 20px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition: all 0.3s;
  background-color: rgba(var(--bg-gradient));
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
}

.info-part {
  flex: 1;
}
.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
.description {
  color: var(--description-font-color);
  font-size: 14px;
  margin-bottom: 8px;
  // 多行换行
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.badge-list {
  font-size: 13px;
  color: var(--badge-font-color);
  .split {
    &::before,
    &::after {
      content: '';
      display: inline-block;
      width: 1px;
      height: 8px;
      margin: 0 10px;
      background-color: #4e5969;
    }
  }
}
.cover-img {
  width: 120px;
  height: 80px;
  margin-left: 24px;
  border-radius: 2px;
  background-repeat: no-repeat;
  background-size: 120px 80px;
}

@media screen and (max-width: 500px) {
  .cover-img {
    width: 100px;
    height: 60px;
    background-size: 100px 60px;
  }
}
</style>
