<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useButtonAfterConfig } from '../composables/config/blog'
import { aliPaySVG, weChatPaySVG } from '../constants/svg'
import Button from './Button.vue'

const buttonAfterArticleConfig = useButtonAfterConfig()

const showContent = ref(false)

watch(buttonAfterArticleConfig, () => {
  showContent.value = buttonAfterArticleConfig.value !== false && !!buttonAfterArticleConfig.value?.expand
}, {
  immediate: true
})

const svg = computed(() => {
  if (buttonAfterArticleConfig.value === false)
    return ''
  const icon = buttonAfterArticleConfig.value?.icon
  if (icon === 'aliPay') {
    return aliPaySVG
  }
  else if (icon === 'wechatPay') {
    return weChatPaySVG
  }
  else {
    return icon as string
  }
})

function toggleContent() {
  showContent.value = !showContent.value
}
</script>

<template>
  <div v-if="buttonAfterArticleConfig" class="appreciation-container">
    <Button :size="buttonAfterArticleConfig.size || 'default'" class="content-button" :type="showContent ? 'danger' : 'primary'" @click="toggleContent">
      <span class="content-icon" v-html="svg" />
      {{ showContent ? buttonAfterArticleConfig.closeTitle : buttonAfterArticleConfig.openTitle }}
    </Button>
    <transition name="content">
      <div v-if="showContent" class="content-container" v-html="buttonAfterArticleConfig.content" />
    </transition>
  </div>
</template>

<style scoped>
@charset "UTF-8";
.appreciation-container {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: #606266;
}
.appreciation-container :deep(.sugar-button.sugar-button--primary) {
  background-color: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.content-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.content-container :deep(img) {
  height: 260px;
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
