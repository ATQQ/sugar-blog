<template>
  <div class="global-alert" v-if="alertProps">
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
import { useBlogConfig } from '../composables/config/blog'

const { alert: alertProps } = useBlogConfig()
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
