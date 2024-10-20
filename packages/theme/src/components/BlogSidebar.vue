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

<style lang="scss" scoped>
.sidebar.card {
  margin-top: 40px;
}

@media screen and (min-width: 960px) and (max-width: 1120px) {
  .sidebar.card {
    margin-top: 60px;
  }
}
</style>
