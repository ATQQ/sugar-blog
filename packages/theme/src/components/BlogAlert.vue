<script lang="ts" setup>
import { ElAlert } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useAlertConfig } from '../composables/config/blog'

// TODO：拆分插件，对标公告插件
const alertProps = useAlertConfig()
const show = ref(false)
const storageKey = 'theme-blog-alert'
const closeFlag = `${storageKey}-close`
onMounted(() => {
  // 取旧值
  const oldValue = localStorage.getItem(storageKey)
  const newValue = JSON.stringify(alertProps.value)
  localStorage.setItem(storageKey, newValue)

  // >= 0 每次都展示，区别是否自动消失
  if (Number(alertProps?.value?.duration) >= 0) {
    show.value = true
    if (alertProps?.value?.duration) {
      setTimeout(() => {
        show.value = false
      }, alertProps?.value?.duration)
    }
    return
  }

  if (oldValue !== newValue && alertProps?.value?.duration === -1) {
    // 当做新值处理
    show.value = true
    localStorage.removeItem(closeFlag)
    return
  }

  // 新旧相等，判断是否点击过close，没点击关闭依然展示
  if (oldValue === newValue && alertProps?.value?.duration === -1 && !localStorage.getItem(closeFlag)) {
    show.value = true
  }
})

function handleClose() {
  show.value = false
  if (alertProps?.value?.duration === -1) {
    localStorage.setItem(closeFlag, `${+new Date()}`)
  }
}
</script>

<template>
  <div v-if="show" class="global-alert" data-pagefind-ignore="all">
    <ElAlert
      :title="alertProps?.title"
      :type="alertProps?.type"
      :show-icon="alertProps?.showIcon"
      :center="alertProps?.center"
      :closable="alertProps?.closable"
      :close-text="alertProps?.closeText"
      :description="alertProps?.description"
      @close="handleClose"
    >
      <div v-if="alertProps?.html" v-html="alertProps?.html" />
    </ElAlert>
  </div>
</template>

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
