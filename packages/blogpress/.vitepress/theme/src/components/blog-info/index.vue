<template>
  <div class="blog-info">
    <!-- 统计数据，日后支持，点击筛选出左侧的数据 -->
    <Overview />

    <!-- 置顶的一些文章 -->
    <hot-wiki />

    <!-- 标签 -->
    <tags />
  </div>
</template>

<script lang="ts" setup>
import Overview from './overview.vue'
import HotWiki from './HotWiki.vue'
import Tags from './tags.vue'
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
