<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useScrollLock } from '@vueuse/core'

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

const transform = reactive({
  scale: 1,
  deg: 0,
  offsetX: 0,
  offsetY: 0,
  enableTransition: false,
})

const imgStyle = computed(() => ({
  transform: `translate3d(${transform.offsetX}px, ${transform.offsetY}px, 0) scale(${transform.scale}) rotate(${transform.deg}deg)`,
  transition: transform.enableTransition ? 'transform .3s' : '',
}))

function reset() {
  transform.scale = 1
  transform.deg = 0
  transform.offsetX = 0
  transform.offsetY = 0
  transform.enableTransition = false
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
  transform.enableTransition = true
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
  transform.enableTransition = false
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
  if (e.key === 'Escape') {
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
  <Teleport to="body" :disabled="!teleported">
    <transition name="viewer-fade">
      <div class="vitepress-image-viewer__wrapper" tabindex="-1" @wheel.prevent="handleWheel">
        <div class="vitepress-image-viewer__mask" @click="handleMaskClick" />

        <!-- Close -->
        <span class="vitepress-image-viewer__btn vitepress-image-viewer__close" @click="hide">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z" /></svg>
        </span>

        <!-- Arrows -->
        <template v-if="!isSingle">
          <span
            class="vitepress-image-viewer__btn vitepress-image-viewer__prev"
            :class="{ 'is-disabled': !infinite && isFirst }"
            @click="prev"
          >
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z" /></svg>
          </span>
          <span
            class="vitepress-image-viewer__btn vitepress-image-viewer__next"
            :class="{ 'is-disabled': !infinite && isLast }"
            @click="next"
          >
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z" /></svg>
          </span>
        </template>

        <!-- Progress -->
        <div v-if="showProgress" class="vitepress-image-viewer__progress">
          {{ index + 1 }} / {{ urlList.length }}
        </div>

        <!-- Actions Toolbar -->
        <div v-if="toolbar.length" class="vitepress-image-viewer__actions">
          <!-- 图片进度展示当前图片索引和图片总数 -->
          <div class="vitepress-image-viewer__actions__inner">
            <svg v-if="toolbar.includes('zoomOut')" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" @click="handleActions('zoomOut')"><path fill="currentColor" d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704M352 448h256a32 32 0 0 1 0 64H352a32 32 0 0 1 0-64" /></svg>
            <svg v-if="toolbar.includes('zoomIn')" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" @click="handleActions('zoomIn')"><path fill="currentColor" d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704m-32-384v-96a32 32 0 0 1 64 0v96h96a32 32 0 0 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64z" /></svg>
            <i v-if="toolbar.includes('zoomOut') || toolbar.includes('zoomIn')" class="vitepress-image-viewer__actions__divider" />
            <svg v-if="toolbar.includes('reset')" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" @click="handleActions('reset')"><path fill="currentColor" d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88" /></svg>
            <i v-if="toolbar.includes('reset')" class="vitepress-image-viewer__actions__divider" />
            <svg v-if="toolbar.includes('rotateLeft')" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" @click="handleActions('rotateLeft')"><path fill="currentColor" d="M289.088 296.704h92.992a32 32 0 0 1 0 64H232.96a32 32 0 0 1-32-32V179.712a32 32 0 0 1 64 0v50.56a384 384 0 0 1 643.84 282.88 384 384 0 0 1-383.936 384 384 384 0 0 1-384-384h64a320 320 0 1 0 640 0 320 320 0 0 0-555.712-216.448z" /></svg>
            <svg v-if="toolbar.includes('rotateRight')" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" @click="handleActions('rotateRight')"><path fill="currentColor" d="M771.776 794.88A384 384 0 0 1 128 512h64a320 320 0 0 0 555.712 216.448H654.72a32 32 0 1 1 0-64h149.056a32 32 0 0 1 32 32v148.928a32 32 0 1 1-64 0v-50.56zM276.288 295.616h92.992a32 32 0 0 1 0 64H220.16a32 32 0 0 1-32-32V178.56a32 32 0 0 1 64 0v50.56A384 384 0 0 1 896.128 512h-64a320 320 0 0 0-555.776-216.384z" /></svg>
            <i v-if="toolbar.includes('rotateLeft') || toolbar.includes('rotateRight')" class="vitepress-image-viewer__actions__divider" />
            <svg v-if="toolbar.includes('download')" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" @click="handleDownload"><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64m384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64z" /></svg>
          </div>
        </div>

        <!-- Canvas -->
        <div class="vitepress-image-viewer__canvas">
          <img
            :src="currentImg"
            :style="imgStyle"
            class="vitepress-image-viewer__img"
            @mousedown="handleMouseDown"
          >
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style lang="scss" scoped>
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
  opacity: .5;
  background: #000;
}

.vitepress-image-viewer__btn {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: .8;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
  background-color: #606266;
  color: #fff;
  width: 44px;
  height: 44px;
  font-size: 24px;

  &:hover {
    border-color: #fff;
    background-color: #909399;
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: .3;
    background-color: #606266;
  }
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
  background-color: #606266;
  border-color: #fff;
  border-radius: 22px;
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: .8;
  box-sizing: border-box;
  user-select: none;

  &__inner {
    width: 100%;
    height: 100%;
    text-align: justify;
    cursor: default;
    font-size: 23px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 12px;

    svg {
        cursor: pointer;
    }
  }

  &__divider {
    display: inline-block;
    width: 1px;
    height: 18px;
    margin: 0 10px;
    background: hsla(0,0%,100%,.5);
    vertical-align: middle;
  }
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
  transition: transform .3s;

  &:active {
    cursor: grabbing;
  }
}

.viewer-fade-enter-active {
  animation: viewer-fade-in .3s;
}

.viewer-fade-leave-active {
  animation: viewer-fade-out .3s;
}

@keyframes viewer-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes viewer-fade-out {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
