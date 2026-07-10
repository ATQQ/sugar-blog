<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import Giscus from '@giscus/vue'

// @ts-expect-error
import pluginOptions from 'virtual:giscus-plugin-options'
import { useElementSize, useElementVisibility, useWindowSize } from '@vueuse/core'
import Icon from './Icon.vue'

// 监听元素变化

const { frontmatter, isDark } = useData()

const commentConfig = computed(() => {
  // If explicitly disabled in frontmatter
  if (frontmatter.value.comment === false) {
    return false
  }

  // Merge frontmatter config if available, otherwise use plugin options
  const fmConfig = frontmatter.value.comment
  if (typeof fmConfig === 'object') {
    return { ...pluginOptions, ...fmConfig }
  }

  return pluginOptions
})

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

// Wrapper logic
const commentEl = ref(null)
const commentIsVisible = useElementVisibility(commentEl)

function handleScrollToComment() {
  // @ts-expect-error
  commentEl.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const { width } = useWindowSize()
const mobileMinify = computed(() => width.value < 768 && (commentConfig.value?.mobileMinify ?? true))

const $vpDoc = typeof document !== 'undefined' ? document.querySelector('.vp-doc') || document.body : null
const el = ref<any>($vpDoc)
const { width: _docWidth } = useElementSize(el)
const docWidth = computed(() => `${_docWidth.value}px`)

onMounted(() => {
  const vpDoc = document.querySelector('.vp-doc')
  if (vpDoc) {
    el.value = vpDoc
  }
})

const labelText = computed(() => {
  return commentConfig.value?.label ?? '评论'
})

const showCommentBtn = computed(() => {
  return commentConfig.value?.showCommentBtn ?? true
})
</script>

<template>
  <div v-if="commentConfig && showComment" id="blog-comment-wrapper" ref="commentEl" class="blog-comment-wrapper" data-pagefind-ignore="all">
    <Giscus
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
    <div v-if="showCommentBtn && _docWidth" v-show="!commentIsVisible" class="comment-btn-wrapper" :class="{ hidden: commentIsVisible }">
      <span v-if="!mobileMinify && labelText" class="icon-wrapper-text" @click="handleScrollToComment">
        <Icon :size="20" :icon="commentConfig?.icon">
          <svg data-v-f0aeb853="" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="currentColor" d="M736 504a56 56 0 1 1 0-112 56 56 0 0 1 0 112m-224 0a56 56 0 1 1 0-112 56 56 0 0 1 0 112m-224 0a56 56 0 1 1 0-112 56 56 0 0 1 0 112M128 128v640h192v160l224-160h352V128z" /></svg>
        </Icon>
        <span class="text">
          {{ labelText }}
        </span>
      </span>
      <span v-else class="icon-wrapper" @click="handleScrollToComment">
        <Icon :size="20" :icon="commentConfig?.icon">
          <svg data-v-f0aeb853="" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="currentColor" d="M736 504a56 56 0 1 1 0-112 56 56 0 0 1 0 112m-224 0a56 56 0 1 1 0-112 56 56 0 0 1 0 112m-224 0a56 56 0 1 1 0-112 56 56 0 0 1 0 112M128 128v640h192v160l224-160h352V128z" /></svg>
        </Icon>
      </span>
    </div>
  </div>
</template>

<style scoped>
.comment-btn-wrapper {
  position: fixed;
  width: v-bind(docWidth);
  text-align: right;
  bottom: 40px;
  font-size: 16px;
  opacity: 0.6;
  display: flex;
  justify-content: right;
  z-index: 200;
  --box-shadow-color: rgba(0, 0, 0, 0.1);
  --box-shadow-hover-color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
html.dark .comment-btn-wrapper {
  --box-shadow-color: rgba(0, 0, 0, 0.6);
  --box-shadow-hover-color: rgba(0, 0, 0, 0.7);
}
.comment-btn-wrapper:is(:hover, :active) {
  opacity: 1;
}
.comment-btn-wrapper :is(.icon-wrapper, .icon-wrapper-text) {
  cursor: pointer;
  border-radius: 50%;
  position: relative;
  right: -80px;
  box-shadow: 0 1px 8px 0 var(--box-shadow-color);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  pointer-events: auto;
}
.comment-btn-wrapper .icon-wrapper-text {
  border-radius: 9vw;
  padding: 2px 8px;
}
.comment-btn-wrapper .icon-wrapper-text span.text {
  font-size: 12px;
  margin-left: 4px;
}
.comment-btn-wrapper :is(.icon-wrapper, .icon-wrapper-text):is(:hover, :active) {
  box-shadow: 0 2px 16px 0 var(--box-shadow-hover-color);
}
.comment-btn-wrapper :is(.icon-wrapper, .icon-wrapper-text):active {
  scale: 0.9;
}
@starting-style {
  .comment-btn-wrapper :is(.icon-wrapper, .icon-wrapper-text) {
    scale: 0;
  }
}
.comment-btn-wrapper.hidden :is(.icon-wrapper, .icon-wrapper-text) {
  scale: 0;
}
.comment-btn-wrapper,
.comment-btn-wrapper :is(.icon-wrapper, .icon-wrapper-text) {
  transition: opacity, scale cubic-bezier(0, 0, 0, 1), display, color, background-color, box-shadow;
  transition-behavior: allow-discrete;
  transition-duration: 0.3s;
}

@supports (color: rgb(from red r g b / 1)) {
  .comment-btn-wrapper {
    opacity: 1;
    --box-shadow-color: rgba(0, 0, 0, 0.06);
  }
  html.dark .comment-btn-wrapper {
    --box-shadow-color: rgba(0, 0, 0, 0.36);
  }
  .comment-btn-wrapper :is(.icon-wrapper, .icon-wrapper-text) {
    backdrop-filter: blur(3px);
  }
  .comment-btn-wrapper :is(.icon-wrapper, .icon-wrapper-text):not(:hover):not(:active) {
    background-color: rgb(from var(--vp-c-brand-soft) r g b / 0.6);
    color: rgb(from var(--vp-c-brand-1) r g b / 0.6);
  }
}

@media screen and (max-width: 1200px) {
  .comment-btn-wrapper .icon-wrapper,
  .comment-btn-wrapper .icon-wrapper-text {
    position: static;
  }
}

@media print {
  .comment-btn-wrapper {
    display: none;
  }
}
</style>
