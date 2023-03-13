<template>
  <div class="global-alert" v-if="show" data-pagefind-ignore="all">
    <el-alert
      :title="alertProps?.title"
      :type="alertProps?.type"
      :show-icon="alertProps?.showIcon"
      :center="alertProps?.center"
      :closable="alertProps?.closable"
      :close-text="alertProps?.closeText"
      :description="alertProps?.description"
    >
      <div v-if="alertProps?.html" v-html="alertProps?.html"></div>
    </el-alert>
  </div>
</template>

<script lang="ts" setup>
import { ElAlert } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useBlogConfig } from '../composables/config/blog'

const { alert: alertProps } = useBlogConfig()
const show = ref(false)

onMounted(() => {
  const storageKey = 'theme-blog-alert'
  // 取旧值
  const oldValue = localStorage.getItem(storageKey)
  const newValue = JSON.stringify(alertProps)
  localStorage.setItem(storageKey, newValue)

  // >= 0 每次都展示，区别是否自动消失
  if (Number(alertProps?.duration) >= 0) {
    show.value = true
    if (alertProps?.duration) {
      setTimeout(() => {
        show.value = false
      }, alertProps?.duration)
    }
  }

  if (oldValue !== newValue && alertProps?.duration === -1) {
    // 当做新值处理
    show.value = true
  }
})
</script>

<style lang="scss" scoped>
.global-alert {
  position: fixed;
  z-index: 999;
  top: 66px;
  max-width: 500px;
  margin: 0 auto;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  :deep(.el-alert__content) {
    padding-right: 20px;
  }
}
@media screen and (max-width: 1100px) {
  .global-alert {
    width: 50%;
  }
}

@media screen and (max-width: 600px) {
  .global-alert {
    width: 90%;
  }
}
</style>
