<script lang="ts" setup>
import { computed } from 'vue'
import { useRecommendConfig, useShowRecommend } from '../composables/config/blog'
import BlogRecommendArticle from './BlogRecommendArticle.vue'

const recommend = useRecommendConfig()
const show = useShowRecommend()
const sidebarStyle = computed(() =>
  recommend.value?.style || 'sidebar'
)
</script>

<template>
  <div v-if="show" class="sidebar" :class="{ card: sidebarStyle === 'card' }" data-pagefind-ignore="all">
    <BlogRecommendArticle />
  </div>
</template>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 0 !important;
  padding-top: 0 !important;
}
.sidebar.card {
  margin-top: 0 !important;
}

@media screen and (min-width: 960px) and (max-width: 1120px) {
  .sidebar.card {
    margin-top: 0 !important;
  }
}
</style>
