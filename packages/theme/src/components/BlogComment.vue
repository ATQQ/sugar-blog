<template>
  <div class="comment">
    <component
      v-if="showComment"
      :is="'script'"
      src="https://giscus.app/client.js"
      data-repo="ATQQ/sugar-blog"
      data-repo-id="MDEwOlJlcG9zaXRvcnkyNDEyNDUyOTk="
      data-category="Announcements"
      data-category-id="DIC_kwDODmEcc84COVc6"
      data-mapping="pathname"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      :data-theme="isDark ? 'dark' : 'light'"
      data-lang="zh-CN"
      crossorigin="anonymous"
      async
    >
    </component>
  </div>
</template>
<script setup>
import { useDark } from '@vueuse/core'
import { useRoute } from 'vitepress'
import { ref, watch } from 'vue'

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance'
})

const route = useRoute()
const showComment = ref(true)
watch(
  () => route.path,
  () => {
    showComment.value = false
    setTimeout(() => {
      showComment.value = true
    }, 100)
  }
)
</script>
<style scoped>
.comment {
  width: 100%;
  text-align: center;
  padding: 40px 0;
}
</style>
