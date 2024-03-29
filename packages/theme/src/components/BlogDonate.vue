<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { computed, ref } from 'vue'
import { useBlogConfig } from '../composables/config/blog'
import { aliPaySVG, weChatPaySVG } from '../constants/svg'

const { donate: _donate } = useBlogConfig()

const donate = computed(() =>
  _donate === false ? undefined : _donate
)

const showQRCode = ref(false)
const qrCodeSrc = donate.value?.qrCodeSrc
const openTitle = donate.value?.openTitle
const closeTitle = donate.value?.closeTitle
const description = donate.value?.description
const paymentWay = donate.value?.paymentWay

let svg = weChatPaySVG
if (paymentWay === 'aliPay') {
  svg = aliPaySVG
}
else if (paymentWay === 'wechatPay') {
  svg = weChatPaySVG
}

function toggleQRCode() {
  showQRCode.value = !showQRCode.value
}
</script>

<template>
  <div v-if="_donate !== false" class="appreciation-container">
    <ElButton class="qrcode-button" :type="showQRCode ? 'danger' : 'primary'" @click="toggleQRCode">
      <span class="qrCode-icon" v-html="svg" />
      {{ showQRCode ? closeTitle : openTitle }}
    </ElButton>
    <p class="qrcode-description" /> {{ description }}
    <transition name="qrcode">
      <div v-if="showQRCode" class="qrcode-container">
        <img :src="qrCodeSrc" class="qrcode-img" alt="QR Code">
      </div>
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

.qrcode-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  overflow: hidden;
}

.qrcode-description {
  margin-top: 20px;
}

.qrCode-icon {
  font-family: "iconfont" !important;
  font-size: 16px;
  margin-right: 8px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.qrcode-img {
  max-width: 100%;
  height: auto;
  /* 添加边框 */
  border: 4px solid #409eff;
  transition: opacity 0.3s ease, transform 0.3s ease;
  margin-top: 20px;
}

/* 进入动画 */
.qrcode-enter-active {
  animation: fadeIn 0.5s ease forwards;
}

/* 离开动画 */
.qrcode-leave-active {
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
