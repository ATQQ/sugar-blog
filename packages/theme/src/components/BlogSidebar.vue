<template>
  <div class="sidebar"><BlogRecommendArticle /></div>
</template>

<script lang="ts" setup>
import BlogRecommendArticle from './BlogRecommendArticle.vue'
</script>

<style lang="scss" scoped>
.sidebar {
  margin-top: 40px;
}

@media screen and (min-width: 960px) and (max-width: 1120px) {
  .sidebar {
    margin-top: 60px;
  }
}
</style>
