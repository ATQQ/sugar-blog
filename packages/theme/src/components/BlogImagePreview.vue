<script setup lang="ts">
import { ElImageViewer } from 'element-plus'
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const show = ref(false)
const previewImageInfo = reactive<{ url: string; list: string[]; idx: number }>(
  {
    url: '',
    list: [],
    idx: 0
  }
)
const previewImage = (e: Event) => {
  const target = e.target as HTMLElement
  const currentTarget = e.currentTarget as HTMLElement
  if (target.tagName.toLowerCase() === 'img') {
    const imgs = currentTarget.querySelectorAll<HTMLImageElement>(
      '.content-container .main img'
    )
    const idx = Array.from(imgs).findIndex((el) => el === target)
    const urls = Array.from(imgs).map((el) => el.src)

    const url = target.getAttribute('src')
    previewImageInfo.url = url!
    previewImageInfo.list = urls
    previewImageInfo.idx = idx

    show.value = true
  }
}
onMounted(() => {
  const docDomContainer = document.querySelector('#VPContent')
  docDomContainer?.addEventListener('click', previewImage)
})

onUnmounted(() => {
  const docDomContainer = document.querySelector('#VPContent')
  docDomContainer?.removeEventListener('click', previewImage)
})
</script>

<template>
  <ElImageViewer
    :infinite="false"
    hide-on-click-modal
    teleported
    @close="show = false"
    :url-list="previewImageInfo.list"
    :initial-index="previewImageInfo.idx"
    v-if="show"
  />
</template>
