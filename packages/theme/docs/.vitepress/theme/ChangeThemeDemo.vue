<script setup>
import { useColorMode } from '@vueuse/core'
import { ref, watchEffect } from 'vue'

const mode = useColorMode({
  attribute: 'theme',
  emitAuto: true
})
const themeList = [
  'vp-default',
  'vp-green',
  'vp-yellow',
  'vp-red',
  'el-blue',
  'el-yellow',
  'el-green',
  'el-red'
]
const current = ref(themeList[0])
function nextThemeColor() {
  const index = themeList.indexOf(current.value)
  const nextIndex = index + 1 >= themeList.length ? 0 : index + 1
  current.value = themeList[nextIndex]
}

watchEffect(() => (mode.value = current.value))
</script>

<template>
  <span
    style="
      display: inline-block;
      background-color: var(--vp-c-brand-1);
      color: #fff;
      cursor: pointer;
      padding: 10px 20px;
    "
    @click="nextThemeColor()"
  >点我切换一个主题色试试 ({{ current }})</span>
</template>
