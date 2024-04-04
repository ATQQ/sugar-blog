<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, ref, watch } from 'vue'
import Giscus from '@giscus/vue'
import { useBlogConfig } from '../composables/config/blog'

// 读取配制
const { comment } = useBlogConfig()
const commentConfig = computed(() => {
  if (!comment) {
    return false
  }
  if ('type' in comment && comment.type === 'giscus') {
    return comment.options
  }
  else if (!('type' in comment)) {
    return comment
  }

  return false
})

const { isDark } = useData()

const route = useRoute()
const showComment = ref(true)
watch(
  () => route.path,
  () => {
    showComment.value = false
    setTimeout(() => {
      showComment.value = true
    }, 200)
  },
  {
    immediate: true
  }
)
</script>

<template>
  <Giscus
    v-if="commentConfig" :repo="commentConfig.repo" :repo-id="commentConfig.repoId"
    :category="commentConfig.category" :category-id="commentConfig.categoryId"
    :mapping="commentConfig.mapping || 'pathname'" reactions-enabled="1" emit-metadata="0"
    :input-position="commentConfig.inputPosition || 'top'" :theme="isDark ? 'dark' : 'light'"
    :lang="commentConfig.lang || 'zh-CN'" :loading="commentConfig.loading || 'eager'"
  />
</template>
