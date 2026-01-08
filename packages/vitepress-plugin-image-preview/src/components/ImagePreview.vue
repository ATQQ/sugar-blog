<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'

// @ts-expect-error
import imagePreviewOptions from 'virtual:image-preview-options'
import ImageViewer from './ImageViewer.vue'

const show = ref(false)
const previewImageInfo = reactive<{ url: string; list: string[]; idx: number }>(
  {
    url: '',
    list: [],
    idx: 0
  }
)

function previewImage(e: Event) {
  const target = e.target as HTMLElement
  const currentTarget = e.currentTarget as HTMLElement
  if (target.tagName.toLowerCase() === 'img') {
    const selector = imagePreviewOptions?.selector || '.content-container .main img,.VPPage img'
    const imgs = currentTarget.querySelectorAll<HTMLImageElement>(selector)
    const idx = Array.from(imgs).findIndex(el => el === target)
    const urls = Array.from(imgs).map(el => el.src)

    const url = target.getAttribute('src')
    previewImageInfo.url = url!
    previewImageInfo.list = urls
    previewImageInfo.idx = idx

    // 兼容点击main之外的图片
    if (idx === -1 && url) {
      previewImageInfo.list.push(url)
      previewImageInfo.idx = previewImageInfo.list.length - 1
    }
    show.value = true
  }
}

onMounted(() => {
  const wrapperId = imagePreviewOptions?.wrapperId || '#VPContent'
  const docDomContainer = document.querySelector(wrapperId)
  docDomContainer?.addEventListener('click', previewImage)
})

onUnmounted(() => {
  const wrapperId = imagePreviewOptions?.wrapperId || '#VPContent'
  const docDomContainer = document.querySelector(wrapperId)
  docDomContainer?.removeEventListener('click', previewImage)
})
</script>

<template>
  <ImageViewer
    v-if="show"
    :infinite="imagePreviewOptions?.infinite ?? false"
    :hide-on-click-modal="imagePreviewOptions?.hideOnClickModal ?? false"
    :show-progress="imagePreviewOptions?.showProgress ?? true"
    :zoom-ratio="imagePreviewOptions?.zoomRatio ?? 1.2"
    :min-scale="imagePreviewOptions?.minScale ?? 0.2"
    :max-scale="imagePreviewOptions?.maxScale ?? 7"
    :toolbar="imagePreviewOptions?.toolbar ?? ['zoomOut', 'zoomIn', 'reset', 'rotateLeft', 'rotateRight', 'download']"
    teleported
    :url-list="previewImageInfo.list"
    :initial-index="previewImageInfo.idx"
    @close="show = false"
  />
</template>
