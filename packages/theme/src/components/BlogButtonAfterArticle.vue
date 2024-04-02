<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { useBlogConfig } from '../composables/config/blog'
import { aliPaySVG, weChatPaySVG } from '../constants/svg'

// import type { Theme } from '../composables/config/index'

const { buttonAfterArticle: _buttonAfterArticle } = useBlogConfig()
const { frontmatter } = useData()
const frontmatterConfig = computed(() => frontmatter.value.buttonAfterArticle)

const buttonAfterArticleConfig = computed(() => {
  if (frontmatterConfig.value === false) {
    // return frontmatterConfig.value === false ? undefined : frontmatterConfig.value as Theme.ButtonAfterArticleConfig
    return undefined
  }
  return _buttonAfterArticle === false ? undefined :{..._buttonAfterArticle,...frontmatterConfig.value}
})

const showContent = ref(false)
const content = buttonAfterArticleConfig.value?.content
const openTitle = buttonAfterArticleConfig.value?.openTitle
const closeTitle = buttonAfterArticleConfig.value?.closeTitle
const icon = buttonAfterArticleConfig.value?.icon

let svg = weChatPaySVG
if (icon === 'aliPay') {
  svg = aliPaySVG
}
else if (icon === 'wechatPay') {
  svg = weChatPaySVG
}
else {
  svg = icon as string
}

function toggleContent() {
  showContent.value = !showContent.value
}
</script>

<template>
  <div v-if="buttonAfterArticleConfig" class="appreciation-container">
    <ElButton class="content-button" :type="showContent ? 'danger' : 'primary'" @click="toggleContent">
      <span class="content-icon" v-html="svg" />
      {{ showContent ? closeTitle : openTitle }}
    </ElButton>
    <transition name="content">
      <div v-if="showContent" class="content-container" v-html="content" />
    </transition>
  </div>
</template>

<style scoped>
.appreciation-container {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: #606266;
}

.content-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  overflow: hidden;
}

.content-icon {
  font-family: "iconfont" !important;
  font-size: 16px;
  margin-right: 8px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 进入动画 */
.content-enter-active {
  animation: fadeIn 0.5s ease forwards;
}

/* 离开动画 */
.content-leave-active {
  animation: fadeOut 0.3s ease forwards;
}

/* 淡入 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* 淡出 */
@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
