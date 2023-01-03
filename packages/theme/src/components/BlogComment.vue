<template>
  <div class="comment" v-if="show" id="giscus-comment">
    <component
      v-if="showComment"
      :is="'script'"
      src="https://giscus.app/client.js"
      :data-repo="commentConfig.repo"
      :data-repo-id="commentConfig.repoId"
      :data-category="commentConfig.category"
      :data-category-id="commentConfig.categoryId"
      :data-mapping="commentConfig.mapping || 'pathname'"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      :data-input-position="commentConfig.inputPosition || 'top'"
      :data-theme="isDark ? 'dark' : 'light'"
      :data-lang="commentConfig.lang || 'zh-CN'"
      crossorigin="anonymous"
      :data-loading="commentConfig.loading || ''"
      async
    >
    </component>
    <!-- TODO：跳转到评论区优化 -->
    <el-affix
      :class="{ hidden: !showCommnetAffix }"
      position="bottom"
      @change="handleVisibleChange"
      :offset="40"
    >
      <el-button type="primary">Offset bottom 20px</el-button>
    </el-affix>
  </div>
</template>
<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { useRoute } from 'vitepress'
import { computed, ref, watch } from 'vue'
import { ElAffix, ElButton } from 'element-plus'
import { useGiscusConfig } from '../composables/config/blog'
import { Theme } from '../composables/config/index'

const showCommnetAffix = ref(true)
const handleVisibleChange = (v: boolean) => {
  showCommnetAffix.value = v
}
const giscusConfig = useGiscusConfig()

const commentConfig = computed<Partial<Theme.GiscusConfig>>(() => {
  if (!giscusConfig) {
    return {}
  }
  return giscusConfig
})

const show = computed(() => {
  if (!giscusConfig) {
    return giscusConfig
  }
  return (
    giscusConfig.repo &&
    giscusConfig.repoId &&
    giscusConfig.category &&
    giscusConfig.categoryId
  )
})

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

.hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
