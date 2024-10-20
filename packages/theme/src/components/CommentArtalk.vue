<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import type Artalk from 'artalk'

import { useCommentConfig, useOpenCommentConfig } from '../composables/config/blog'

const { isDark, page } = useData()
const el = ref<HTMLDivElement>()

const route = useRoute()

const artalk = ref<Artalk>()

const comment = useCommentConfig()

const commentConfig = computed(() => {
  if (comment.value && 'type' in comment.value && comment.value?.type === 'artalk') {
    return comment.value.options
  }

  return false
})
const open = useOpenCommentConfig()

onMounted(() => {
  // CDN 异步加载，有优化空间
  const observer = new MutationObserver((mutationsList, observer) => {
    if (window.Artalk && commentConfig.value && el.value) {
      artalk.value = window.Artalk.init({
        el: el.value,
        darkMode: isDark.value,
        pageKey: route.path,
        pageTitle: page.value.title,
        server: commentConfig.value?.server,
        site: commentConfig.value?.site,
      })
      observer.disconnect()
    }
  })

  observer.observe(document.head, { subtree: true, childList: true, attributes: true, attributeFilter: ['id'] })
})

watch(() => route.path, () => {
  if (artalk.value) {
    artalk.value.update({
      pageKey: route.path,
      pageTitle: page.value.title,
    })
    artalk.value.reload()
  }
})

onUnmounted(() => {
  if (artalk.value) {
    artalk.value.destroy()
  }
})

watch(isDark, () => {
  if (artalk.value) {
    artalk.value.setDarkMode(isDark.value)
  }
})
</script>

<template>
  <div v-if="open" ref="el" class="artalk-container" />
</template>

<style lang="scss" scoped>
.artalk-container {
  --at-color-main: var(--vp-c-brand-2);
}
</style>
