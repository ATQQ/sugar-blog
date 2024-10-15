<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, nextTick, ref, watch } from 'vue'
import Giscus from '@giscus/vue'
import { useCommentConfig } from '../composables/config/blog'

const comment = useCommentConfig()
const commentConfig = computed(() => {
  if (!comment.value) {
    return false
  }
  if ('type' in comment.value && comment.value?.type === 'giscus') {
    return comment.value.options
  }
  else if (!('type' in comment.value)) {
    return comment.value
  }

  return false
})

const { isDark } = useData()

const route = useRoute()
const showComment = ref(false)
watch(
  route,
  () => {
    showComment.value = false
    nextTick(() => {
      showComment.value = true
    })
  },
  {
    immediate: true
  }
)
</script>

<template>
  <Giscus
    v-if="commentConfig && showComment" :repo="commentConfig.repo" :repo-id="commentConfig.repoId"
    :category="commentConfig.category" :category-id="commentConfig.categoryId"
    :mapping="commentConfig.mapping || 'pathname'" reactions-enabled="1" emit-metadata="0"
    :input-position="commentConfig.inputPosition || 'top'" :theme="isDark ? 'dark' : 'light'"
    :lang="commentConfig.lang || 'zh-CN'" :loading="commentConfig.loading || 'eager'"
  />
</template>
