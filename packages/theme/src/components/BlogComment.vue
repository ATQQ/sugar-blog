<script setup lang="ts">
import { useElementVisibility, useWindowSize } from '@vueuse/core'
import { useData, useRoute } from 'vitepress'
import { computed, h, ref, watch } from 'vue'
import { ElAffix, ElButton } from 'element-plus'
import { Comment } from '@element-plus/icons-vue'
import Giscus from '@giscus/vue'
import { useGiscusConfig } from '../composables/config/blog'
import type { Theme } from '../composables/config/index'

const { frontmatter } = useData()
const commentEl = ref(null)
const commentIsVisible = useElementVisibility(commentEl)

function handleScrollToComment() {
  document.querySelector('#giscus-comment')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}
const giscusConfig = useGiscusConfig()

const commentConfig = computed<Theme.CommentConfig>(() => {
  if (!giscusConfig) {
    return {} as any
  }
  return giscusConfig
})

const show = computed(() => {
  if (frontmatter.value.comment === false) {
    return frontmatter.value.comment
  }
  if (!giscusConfig) {
    return giscusConfig
  }
  return (
    giscusConfig.repo
    && giscusConfig.repoId
    && giscusConfig.category
    && giscusConfig.categoryId
  )
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

const { width } = useWindowSize()
const mobileMinify = computed(() => width.value < 768 && (commentConfig.value.mobileMinify ?? true))

const CommentIcon = commentConfig.value?.icon
  ? h('i', {
    onVnodeMounted(vnode) {
      if (vnode.el) {
        vnode.el.outerHTML = commentConfig.value?.icon
      }
    },
  })
  : h(Comment)
</script>

<template>
  <div
    v-if="show"
    id="giscus-comment"
    ref="commentEl"
    class="comment"
    data-pagefind-ignore="all"
  >
    <ElAffix
      :class="{ hidden: commentIsVisible }"
      class="comment-btn"
      target="main"
      position="bottom"
      :offset="40"
    >
      <ElButton
        v-if="mobileMinify"
        plain
        :icon="CommentIcon"
        type="primary"
        circle
        @click="handleScrollToComment"
      />
      <ElButton
        v-else
        plain
        :icon="CommentIcon"
        type="primary"
        @click="handleScrollToComment"
      >
        {{ commentConfig.label || '评论' }}
      </ElButton>
    </ElAffix>
    <Giscus
      v-if="showComment"
      :repo="commentConfig.repo"
      :repo-id="commentConfig.repoId"
      :category="commentConfig.category"
      :category-id="commentConfig.categoryId"
      :mapping="commentConfig.mapping || 'pathname'"
      reactions-enabled="1"
      emit-metadata="0"
      :input-position="commentConfig.inputPosition || 'top'"
      :theme="isDark ? 'dark' : 'light'"
      :lang="commentConfig.lang || 'zh-CN'"
      :loading="commentConfig.loading || 'eager'"
    />
  </div>
</template>

<style scoped lang="scss">
.comment {
  width: 100%;
  text-align: center;
  padding: 40px 0;
  :deep(.el-button.el-button--primary:hover) {
    background-color: var(--vp-c-brand-2);
    border-color: var(--vp-c-brand-2);
    color: #fff;
  }
  :deep(.el-button.el-button--primary) {
    background-color: var(--vp-c-brand-soft);
    border-color: var(--vp-c-brand-2);
    color: var(--vp-c-brand-2);
  }
}

.hidden {
  opacity: 0;
  pointer-events: none;
}
.comment-btn {
  :deep(.el-affix--fixed) {
    text-align: right;
    .el-button {
      position: relative;
      right: -100px;
    }
  }
}

@media screen and (max-width: 1200px) {
  .comment-btn {
    :deep(.el-affix--fixed) {
      opacity: 0.7;
      .el-button {
        position: static;
      }
    }
  }
}
</style>
