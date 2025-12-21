<script lang="ts" setup>
import { computed, ref } from 'vue'
import Pagination from '../../src/components/Pagination.vue'
import data from './example-config'

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
      <Pagination
        v-if="data.length >= pageSize"
        small
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, jumper"
        @update:current-page="handleUpdatePageNum"
      />
    </div>
  </div>
</template>

<style scoped>
html.dark .blog-info-content,
html.dark .user-content {
  background-color: rgba(20, 20, 20, 0.7);
}

html .blog-info-content,
html .user-content {
  background-color: rgba(255, 255, 255, 0.9);
}

.example-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 30px;
}
.example-list .blog-info {
  margin: 10px;
  position: relative;
}
.example-list .blog-info .cover-content {
  position: relative;
  overflow: hidden;
}
.example-list .blog-info .cover-content:hover .blog-info-content {
  animation: fadeIn 0.2s ease-in-out forwards;
  display: block;
}
.example-list .blog-info .cover-content .bg-cover {
  background-size: auto 140px;
}
.example-list .blog-info .cover-content img {
  max-height: 140px;
}
.example-list .blog-info .cover-content .blog-info-content {
  display: none;
  padding: 4px 10px;
  position: absolute;
  left: 0;
  top: 30%;
  bottom: 0;
  width: 100%;
  text-align: center;
}
.example-list .blog-info .cover-content .blog-info-content h3 {
  text-align: center;
  font-weight: bold;
  font-size: 18px;
}
.example-list .blog-info .cover-content .blog-info-content p {
  font-size: 14px;
  color: var(--description-font-color);
}
.example-list .blog-info .cover-content .blog-info-content h3,
.example-list .blog-info .cover-content .blog-info-content p {
  margin: 0;
}
.example-list .blog-info .cover-content .blog-info-content i {
  position: absolute;
  right: 50%;
  transform: translateX(50%);
  bottom: 10px;
}
.example-list .blog-info .author-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
}
.example-list .blog-info .author-content img {
  margin: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
.example-list .blog-info .author-content .author-name {
  font-size: 14px;
  cursor: pointer;
}
.example-list .blog-info .author-content:has(.author-name > input[type=checkbox]:checked) + div.user-content {
  display: block;
}
.example-list .blog-info .user-content {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 40px;
}
.example-list .blog-info .user-content :deep(.profile) {
  padding: 18px;
}
.example-list .blog-info .user-content :deep(.VPTeamMembersItem) {
  border-radius: 0;
}
.example-list .blog-info .user-content :deep(.VPTeamMembers) {
  margin-top: 0;
}
.example-list .blog-info .user-content :deep(.data) {
  padding-top: 0;
}
.example-list .blog-info .user-content :deep(.avatar),
.example-list .blog-info .user-content :deep(.name) {
  display: none;
}

@media screen and (max-width: 768px) {
  .example-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media screen and (max-width: 576px) {
  .example-list {
    grid-template-columns: repeat(1, 1fr);
  }
  .example-list .blog-info .cover-content img {
    max-height: 256px;
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.author-content > img:hover {
  transform: rotate(666turn);
  transition-duration: 59s;
  transition-timing-function: cubic-bezier(0.34, 0, 0.84, 1);
}

.el-pagination-wrapper {
  :deep(.sugar-pagination li.is-active.number) {
    background-color: var(--vp-c-brand-2);
  }
  :deep(.sugar-pagination button:hover) {
    color: var(--vp-c-brand-2);
  }

  :deep(.sugar-pager li:not(.is-active):hover) {
    color: var(--vp-c-brand-2);
  }
  :deep(.sugar-input__wrapper:focus-within) {
    box-shadow: 0 0 0 1px var(--vp-c-brand-2) inset;
  }
}
</style>
