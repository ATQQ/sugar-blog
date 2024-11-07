<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElPagination } from 'element-plus'
import data from './config'

const pageSize = ref(6)
const currentPage = ref(1)
const dataList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return data.slice(start, end)
})
const total = computed(() => data.length)
function handleUpdatePageNum(current: number) {
  if (currentPage.value === current) {
    return
  }
  currentPage.value = current
}
</script>

<template>
  <div>
    <!-- TODO: 随机大屏展示 -->
    <!-- 列表 -->
    <div class="example-list">
      <!-- 卡片 -->
      <div v-for="(d) in dataList" :key="d.link" class="example-card">
        <div class="blog-info">
          <div class="cover-content">
            <!-- 封面 -->
            <img :src="d.cover" alt="cover">
            <!-- 博客介绍，hover 展示 -->
            <div class="blog-info-content">
              <h3 v-if="d.name">
                {{ d.name }}
              </h3>
              <p>{{ d.desc }}</p>
              <!-- 外链打开 -->
              <i><a target="_blank" :href="d.link">Go！</a></i>
            </div>
          </div>
          <!-- 作者信息 -->
          <div v-if="d.nickname" class="author-content">
            <!-- 头像 -->
            <img v-if="d?.avatar" :src="d?.avatar" :alt="d.nickname">
            <!-- 作者名 -->
            <a class="author-name" target="_blank" :href="d.home || d.link">{{ d.nickname }}</a>
          </div>
        </div>
      </div>
    </div>
    <!-- 翻页 -->
    <div class="el-pagination-wrapper">
      <ElPagination
        v-if="data.length >= pageSize"
        small
        background
        :default-current-page="1"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, jumper"
        @update:current-page="handleUpdatePageNum"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';

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
