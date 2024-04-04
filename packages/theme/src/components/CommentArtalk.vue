<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import Artalk from 'artalk'
import { useBlogConfig } from '../composables/config/blog'

const { isDark, page } = useData()

const el = ref<HTMLDivElement>()

const route = useRoute()

const artalk = ref<Artalk>()

const { comment } = useBlogConfig()
const commentConfig = computed(() => {
  if (comment && 'type' in comment && comment.type === 'artalk') {
    return comment.options
  }

  return false
})

onMounted(() => {
  if (commentConfig.value && el.value) {
    artalk.value = Artalk.init({
      el: el.value,
      darkMode: isDark.value,
      pageKey: route.path,
      pageTitle: page.value.title,
      server: commentConfig.value?.server,
      site: commentConfig.value?.site,
    })
  }
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
  <div v-if="commentConfig" ref="el" class="artalk-container" />
</template>

<style lang="scss" scoped>
.artalk-container {
  --at-color-main: var(--vp-c-brand-2);
}
</style>
