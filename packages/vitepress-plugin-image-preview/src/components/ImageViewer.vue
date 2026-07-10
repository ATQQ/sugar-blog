<script lang="ts" setup>
/// <reference types="vitepress/client" />

import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useScrollLock } from '@vueuse/core'

import zoomOutIcon from '../icons/zoom-out.svg?raw'
import zoomInIcon from '../icons/zoom-in.svg?raw'
import resetIcon from '../icons/refresh.svg?raw'
import rotateLeftIcon from '../icons/rotate-ccw.svg?raw'
import rotateRightIcon from '../icons/rotate-cw.svg?raw'
import downloadIcon from '../icons/download.svg?raw'
import closeIcon from '../icons/close.svg?raw'
import chevronLeftIcon from '../icons/chevron-left.svg?raw'
import chevronRightIcon from '../icons/chevron-right.svg?raw'

const props = defineProps({
  urlList: {
    type: Array as () => string[],
    default: () => [],
  },
  initialIndex: {
    type: Number,
    default: 0,
  },
  infinite: {
    type: Boolean,
    default: true,
  },
  hideOnClickModal: {
    type: Boolean,
    default: false,
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
  teleported: {
    type: Boolean,
    default: false,
  },
  toolbar: {
    type: Array as () => string[],
    default: () => ['zoomOut', 'zoomIn', 'reset', 'rotateLeft', 'rotateRight', 'download'],
  },
  showProgress: {
    type: Boolean,
    default: true,
  },
  zoomRatio: {
    type: Number,
    default: 1.2,
  },
  minScale: {
    type: Number,
    default: 0.2,
  },
  maxScale: {
    type: Number,
    default: 7,
  },
})

const emit = defineEmits(['close', 'switch'])

const index = ref(props.initialIndex)
const isLocked = useScrollLock(document.body)

const currentImg = computed(() => props.urlList[index.value])
const isSingle = computed(() => props.urlList.length <= 1)
const isFirst = computed(() => index.value === 0)
const isLast = computed(() => index.value === props.urlList.length - 1)

const toolbarGroups = computed(() => {
  const groups: string[][] = [
    ['zoomOut', 'zoomIn'],
    ['reset'],
    ['rotateLeft', 'rotateRight'],
    ['download'],
  ]
  return groups
    .map(group => group.filter(action => props.toolbar.includes(action)))
    .filter(group => group.length > 0)
})

const transform = reactive({
  scale: 1,
  deg: 0,
  offsetX: 0,
  offsetY: 0,
  enableTranslateTransition: false,
})

const imgStyle = computed(() => ({
  translate: `${transform.offsetX}px ${transform.offsetY}px`,
  scale: `${transform.scale}`,
  rotate: `${transform.deg}deg`,
  transition: transform.enableTranslateTransition
    ? 'translate 0.3s, scale 0.3s, rotate 0.3s'
    : undefined,
}))

function reset() {
  transform.enableTranslateTransition = true
  transform.scale = 1
  transform.deg = 0
  transform.offsetX = 0
  transform.offsetY = 0
}

watch(index, () => {
  reset()
})

function hide() {
  isLocked.value = false
  emit('close')
}

function prev() {
  if (isFirst.value && !props.infinite)
    return
  const len = props.urlList.length
  index.value = (index.value - 1 + len) % len
  emit('switch', index.value)
}

function next() {
  if (isLast.value && !props.infinite)
    return
  const len = props.urlList.length
  index.value = (index.value + 1) % len
  emit('switch', index.value)
}

function handleMaskClick() {
  if (props.hideOnClickModal) {
    hide()
  }
}

// Actions
function handleActions(action: string) {
  switch (action) {
    case 'zoomOut':
      if (transform.scale > props.minScale) {
        transform.scale = parseFloat(Math.max(props.minScale, transform.scale / props.zoomRatio).toFixed(3))
      }
      break
    case 'zoomIn':
      if (transform.scale < props.maxScale) {
        transform.scale = parseFloat(Math.min(props.maxScale, transform.scale * props.zoomRatio).toFixed(3))
      }
      break
    case 'rotateRight':
      transform.deg += 90
      break
    case 'rotateLeft':
      transform.deg -= 90
      break
    case 'reset': // 1:1
      reset()
      break
  }
}

function handleDownload() {
  const a = document.createElement('a')
  a.href = currentImg.value
  a.target = '_blank'
  a.download = ''
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// Drag Logic
const isDragging = ref(false)
let startX = 0
let startY = 0
let startOffsetX = 0
let startOffsetY = 0

function handleMouseDown(e: MouseEvent) {
  if (e.button !== 0)
    return
  transform.enableTranslateTransition = false
  isDragging.value = true
  startX = e.clientX
  startY = e.clientY
  startOffsetX = transform.offsetX
  startOffsetY = transform.offsetY
  e.preventDefault()
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value)
    return
  const deltaX = e.clientX - startX
  const deltaY = e.clientY - startY
  transform.offsetX = startOffsetX + deltaX
  transform.offsetY = startOffsetY + deltaY
  e.preventDefault()
}

function handleMouseUp() {
  isDragging.value = false
}

function handleTransitionEnd(e: TransitionEvent) {
  if (e.propertyName === 'translate') {
    transform.enableTranslateTransition = false
  }
}

// Wheel Zoom
function handleWheel(e: WheelEvent) {
  const delta = e.deltaY < 0 ? 1 : -1
  const zoomRate = props.zoomRatio
  const newScale = delta > 0
    ? transform.scale * zoomRate
    : transform.scale / zoomRate

  if (newScale >= props.minScale && newScale <= props.maxScale) {
    transform.scale = parseFloat(newScale.toFixed(3))
  }
}

onMounted(() => {
  isLocked.value = true
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  isLocked.value = false
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('mousemove', handleMouseMove)
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnPressEscape) {
    hide()
  }
  else if (e.key === 'ArrowLeft') {
    prev()
  }
  else if (e.key === 'ArrowRight') {
    next()
  }
}
</script>

<template>
  <div class="vitepress-image-viewer__wrapper" tabindex="-1" @wheel.prevent="handleWheel">
    <div class="vitepress-image-viewer__mask" @click="handleMaskClick" />

    <!-- Close -->
    <span class="vitepress-image-viewer__btn vitepress-image-viewer__close vitepress-image-viewer__icon" @click="hide" v-html="closeIcon" />

    <!-- Arrows -->
    <template v-if="!isSingle">
      <span
        class="vitepress-image-viewer__btn vitepress-image-viewer__prev vitepress-image-viewer__icon"
        :class="{ 'is-disabled': !infinite && isFirst }"
        @click="prev"
        v-html="chevronLeftIcon"
      />
      <span
        class="vitepress-image-viewer__btn vitepress-image-viewer__next vitepress-image-viewer__icon"
        :class="{ 'is-disabled': !infinite && isLast }"
        @click="next"
        v-html="chevronRightIcon"
      />
    </template>

    <!-- Progress -->
    <div v-if="showProgress" class="vitepress-image-viewer__progress">
      {{ index + 1 }} / {{ urlList.length }}
    </div>

    <!-- Actions Toolbar -->
    <div v-if="toolbar.length" class="vitepress-image-viewer__actions">
      <!-- 图片进度展示当前图片索引和图片总数 -->
      <div class="vitepress-image-viewer__actions__inner">
        <template v-for="(group, groupIndex) in toolbarGroups" :key="groupIndex">
          <i v-if="groupIndex > 0" class="vitepress-image-viewer__actions__divider" />
          <template v-for="action in group" :key="action">
            <span v-if="action === 'zoomOut'" class="vitepress-image-viewer__icon" @click="handleActions('zoomOut')" v-html="zoomOutIcon" />
            <span v-else-if="action === 'zoomIn'" class="vitepress-image-viewer__icon" @click="handleActions('zoomIn')" v-html="zoomInIcon" />
            <span v-else-if="action === 'reset'" class="vitepress-image-viewer__icon" @click="handleActions('reset')" v-html="resetIcon" />
            <span v-else-if="action === 'rotateLeft'" class="vitepress-image-viewer__icon" @click="handleActions('rotateLeft')" v-html="rotateLeftIcon" />
            <span v-else-if="action === 'rotateRight'" class="vitepress-image-viewer__icon" @click="handleActions('rotateRight')" v-html="rotateRightIcon" />
            <span v-else-if="action === 'download'" class="vitepress-image-viewer__icon" @click="handleDownload" v-html="downloadIcon" />
          </template>
        </template>
      </div>
    </div>

    <!-- Canvas -->
    <div class="vitepress-image-viewer__canvas">
      <img
        :src="currentImg"
        :style="imgStyle"
        class="vitepress-image-viewer__img"
        @mousedown="handleMouseDown"
        @transitionend="handleTransitionEnd"
      >
    </div>
  </div>
</template>

<style scoped>
.vitepress-image-viewer__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vitepress-image-viewer__mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 1;
  background: var(--vp-backdrop-bg-color);
}

.vitepress-image-viewer__btn {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
  color: #fff;
  width: 44px;
  height: 44px;
  font-size: 24px;
}
.vitepress-image-viewer__actions,
.vitepress-image-viewer__btn {
  opacity: 1;
  background-color: #00000038;
  backdrop-filter: blur(3px);
  transition: background-color, color, opacity;
  transition-duration: 250ms;
}
.vitepress-image-viewer__btn:hover:not(.is-disabled):not(:active) {
  background-color: #00000024;
}
.vitepress-image-viewer__btn:active:not(.is-disabled) {
  background-color: #0000002e;
}
html.dark .vitepress-image-viewer__actions,
html.dark .vitepress-image-viewer__btn {
  background-color: #60626680;
}
html.dark .vitepress-image-viewer__btn:hover:not(.is-disabled):not(:active) {
  background-color: #60626650;
}
html.dark .vitepress-image-viewer__btn:active:not(.is-disabled) {
  background-color: #60626665;
}
.vitepress-image-viewer__btn.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.vitepress-image-viewer__close {
  top: 40px;
  right: 40px;
}

.vitepress-image-viewer__prev {
  top: 50%;
  transform: translateY(-50%);
  left: 40px;
}

.vitepress-image-viewer__next {
  top: 50%;
  transform: translateY(-50%);
  right: 40px;
}

.vitepress-image-viewer__actions {
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  min-width: 282px;
  height: 44px;
  padding: 0 23px;
  border-color: white;
  border-radius: 22px;
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  user-select: none;
}
.vitepress-image-viewer__actions__inner {
  width: 100%;
  height: 100%;
  text-align: justify;
  cursor: default;
  font-size: 23px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 12px;
}
.vitepress-image-viewer__actions__inner .vitepress-image-viewer__icon {
  cursor: pointer;
  color: white;
  transition: color 250ms;
}
.vitepress-image-viewer__actions__inner .vitepress-image-viewer__icon:hover {
  color: #fffa;
}
.vitepress-image-viewer__actions__inner .vitepress-image-viewer__icon:active {
  color: #fffc;
}
.vitepress-image-viewer__icon :deep(svg) {
  width: 1em;
  height: 1em;
  stroke: currentColor;
}
.vitepress-image-viewer__actions__divider {
  display: inline-block;
  width: 1px;
  height: 18px;
  margin: 0 10px;
  background: hsla(0, 0%, 100%, 0.5);
  vertical-align: middle;
}

.vitepress-image-viewer__progress {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 80px;
  font-size: 16px;
  color: #fff;
  user-select: none;
  z-index: 10;
  opacity: 0.8;
  -webkit-text-stroke: 1.5px black;
  paint-order: stroke fill;
}

.vitepress-image-viewer__canvas {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
  pointer-events: none;
}

.vitepress-image-viewer__img {
  max-width: 100%;
  max-height: 100%;
  user-select: none;
  pointer-events: auto;
  cursor: grab;
  transition: scale 0.3s, rotate 0.3s;
}
.vitepress-image-viewer__img:active {
  cursor: grabbing;
}

.viewer-fade-enter-active > *,
.viewer-fade-leave-active > * {
  transition: opacity, translate, scale;
  transition-duration: 0.3s;
}

.viewer-fade-leave-active > * {
  transition-timing-function: cubic-bezier(0, 0, 0, 1);
}

.viewer-fade-enter-from .vitepress-image-viewer__canvas,
.viewer-fade-leave-to .vitepress-image-viewer__canvas,
.viewer-fade-enter-from .vitepress-image-viewer__close,
.viewer-fade-leave-to .vitepress-image-viewer__close {
  scale: 0;
}

.viewer-fade-enter-from .vitepress-image-viewer__mask,
.viewer-fade-leave-to .vitepress-image-viewer__mask {
  opacity: 0;
}

.viewer-fade-enter-from .vitepress-image-viewer__actions,
.viewer-fade-leave-to .vitepress-image-viewer__actions,
.viewer-fade-enter-from .vitepress-image-viewer__progress,
.viewer-fade-leave-to .vitepress-image-viewer__progress {
  translate: 0 100px;
}

.viewer-fade-enter-from .vitepress-image-viewer__prev,
.viewer-fade-leave-to .vitepress-image-viewer__prev {
  translate: -90px;
}

.viewer-fade-enter-from .vitepress-image-viewer__next,
.viewer-fade-leave-to .vitepress-image-viewer__next {
  translate: 90px;
}
</style>
