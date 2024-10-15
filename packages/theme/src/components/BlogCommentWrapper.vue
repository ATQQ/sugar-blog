<script setup lang="ts">
import { useElementSize, useElementVisibility, useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'
import { Comment } from '@element-plus/icons-vue'
import { useCommentConfig, useOpenCommentConfig } from '../composables/config/blog'
import Icon from './Icon.vue'

const commentEl = ref(null)
const commentIsVisible = useElementVisibility(commentEl)

function handleScrollToComment() {
  document.querySelector('#blog-comment-wrapper')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const commentConfig = useCommentConfig()

const show = useOpenCommentConfig()

const { width } = useWindowSize()
const mobileMinify = computed(() => width.value < 768 && (commentConfig.value?.mobileMinify ?? true))

const $vpDoc = document.querySelector('.vp-doc')
const el = ref<any>($vpDoc)
const { width: _docWidth } = useElementSize(el)
const docWidth = computed(() => `${_docWidth.value}px`)

const labelText = computed(() => {
  return commentConfig.value?.label ?? '评论'
})
</script>

<template>
  <div v-if="show && _docWidth" id="blog-comment-wrapper" ref="commentEl" class="blog-comment-wrapper" data-pagefind-ignore="all">
    <slot />
    <div v-show="!commentIsVisible" class="comment-btn-wrapper">
      <span v-if="!mobileMinify && labelText" class="icon-wrapper-text" @click="handleScrollToComment">
        <Icon :size="20" :icon="commentConfig?.icon">
          <Comment />
        </Icon>
        <span class="text">
          {{ labelText }}
        </span>
      </span>
      <span v-else class="icon-wrapper" @click="handleScrollToComment">
        <Icon :size="20" :icon="commentConfig?.icon">
          <Comment />
        </Icon>
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

    span.text {
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
