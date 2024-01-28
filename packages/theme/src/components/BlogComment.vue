<script setup lang="ts">
import { useElementSize, useElementVisibility, useWindowSize } from '@vueuse/core'
import { useData, useRoute } from 'vitepress'
import { computed, h, ref, watch } from 'vue'
import { ElIcon } from 'element-plus'
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

const $vpDoc = document.querySelector('.vp-doc')
const el = ref<any>($vpDoc)
const { width: _docWidth } = useElementSize(el)
const docWidth = computed(() => `${_docWidth.value}px`)

const labelText = computed(() => {
  return commentConfig.value.label ?? '评论'
})
</script>

<template>
  <div v-if="show && _docWidth" id="giscus-comment" ref="commentEl" class="comment" data-pagefind-ignore="all">
    <Giscus
      v-if="showComment" :repo="commentConfig.repo" :repo-id="commentConfig.repoId"
      :category="commentConfig.category" :category-id="commentConfig.categoryId"
      :mapping="commentConfig.mapping || 'pathname'" reactions-enabled="1" emit-metadata="0"
      :input-position="commentConfig.inputPosition || 'top'" :theme="isDark ? 'dark' : 'light'"
      :lang="commentConfig.lang || 'zh-CN'" :loading="commentConfig.loading || 'eager'"
    />

    <div v-show="!commentIsVisible" class="comment-btn-wrapper">
      <span v-if="!mobileMinify && labelText" class="icon-wrapper-text" @click="handleScrollToComment">
        <ElIcon>
          <CommentIcon />
        </ElIcon>
        <span class="text">
          {{ labelText }}
        </span>
      </span>
      <span v-else class="icon-wrapper">
        <ElIcon @click="handleScrollToComment">
          <CommentIcon />
        </ElIcon>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-btn-wrapper {
  position: fixed;
  width: v-bind(docWidth);
  text-align: right;
  bottom: 40px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  opacity: 0.6;
  display: flex;
  justify-content: right;
  z-index: 200;

  &:hover {
    opacity: 1;
  }

  .icon-wrapper,
  .icon-wrapper-text {
    cursor: pointer;
    border-radius: 50%;
    position: relative;
    right: -80px;
    background-color: var(--vp-c-bg);
    box-shadow: var(--box-shadow);
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);

    &:hover {
      box-shadow: var(--box-shadow-hover);
    }
  }

  .icon-wrapper-text {
    border-radius: 2px;
    padding: 2px 6px;

    span.text{
      font-size: 12px;
      margin-left: 4px;
    }
  }
}

@media screen and (max-width: 1200px) {
  .comment-btn-wrapper {

    .icon-wrapper,
    .icon-wrapper-text {
      position: static;
    }
  }
}
</style>
