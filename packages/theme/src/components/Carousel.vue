<script lang="ts" setup>
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'

const props = defineProps({
  height: { type: String, default: '300px' },
  initialIndex: { type: Number, default: 0 },
  trigger: { type: String, default: 'hover' },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 3000 },
  indicatorPosition: { type: String, default: '' },
  arrow: { type: String, default: 'hover' },
  type: { type: String, default: '' },
  loop: { type: Boolean, default: true },
  direction: { type: String, default: 'horizontal' },
  pauseOnHover: { type: Boolean, default: true },
})

const activeIndex = ref(props.initialIndex)
const items = ref<any[]>([])
const timer = ref<any>(null)

function addItem(item: any) {
  items.value.push(item)
}

function removeItem(uid: number) {
  const index = items.value.findIndex(item => item.uid === uid)
  if (index > -1)
    items.value.splice(index, 1)
}

provide('carousel', {
  addItem,
  removeItem,
  activeIndex,
  items,
  type: computed(() => props.type),
  direction: computed(() => props.direction),
})

function startTimer() {
  if (props.interval <= 0 || !props.autoplay || timer.value)
    return
  timer.value = setInterval(playSlides, props.interval)
}

function pauseTimer() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

function playSlides() {
  if (activeIndex.value < items.value.length - 1) {
    activeIndex.value++
  }
  else if (props.loop) {
    activeIndex.value = 0
  }
}

function setActiveItem(index: number) {
  activeIndex.value = index
}

function prev() {
  setActiveItem(activeIndex.value > 0 ? activeIndex.value - 1 : items.value.length - 1)
}

function next() {
  setActiveItem(activeIndex.value < items.value.length - 1 ? activeIndex.value + 1 : 0)
}

function handleIndicatorClick(index: number) {
  activeIndex.value = index
}

const hover = ref(false)

function handleMouseEnter() {
  hover.value = true
  if (props.pauseOnHover)
    pauseTimer()
}

function handleMouseLeave() {
  hover.value = false
  if (props.pauseOnHover)
    startTimer()
}

watch(() => props.autoplay, (val) => {
  val ? startTimer() : pauseTimer()
})

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  pauseTimer()
})
</script>

<template>
  <div
    class="sugar-carousel"
    :class="{ 'sugar-carousel--card': type === 'card' }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="sugar-carousel__container" :style="{ height }">
      <slot />
      <transition name="carousel-arrow-left">
        <button
          v-if="arrow !== 'never' && items.length > 1"
          v-show="(arrow === 'always' || hover) && (loop || activeIndex > 0)"
          type="button"
          class="sugar-carousel__arrow sugar-carousel__arrow--left"
          @click.stop="prev"
        >
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z" /></svg>
        </button>
      </transition>
      <transition name="carousel-arrow-right">
        <button
          v-if="arrow !== 'never' && items.length > 1"
          v-show="(arrow === 'always' || hover) && (loop || activeIndex < items.length - 1)"
          type="button"
          class="sugar-carousel__arrow sugar-carousel__arrow--right"
          @click.stop="next"
        >
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z" /></svg>
        </button>
      </transition>
    </div>

    <ul v-if="indicatorPosition !== 'none' && items.length > 1" class="sugar-carousel__indicators">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="sugar-carousel__indicator"
        :class="{ 'is-active': index === activeIndex }"
        @mouseenter="trigger === 'hover' && setActiveItem(index)"
        @click.stop="handleIndicatorClick(index)"
      >
        <button class="sugar-carousel__button" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.sugar-carousel {
  position: relative;
  overflow: hidden; // simplified
  &:hover {
    .sugar-carousel__arrow {
      display: inline-flex;
    }
  }
}

.sugar-carousel__container {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.sugar-carousel__indicators {
  position: absolute;
  list-style: none;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0;
  z-index: 20;
}

.sugar-carousel__indicator {
  display: inline-block;
  background-color: transparent;
  padding: 12px 4px;
  cursor: pointer;

  &.is-active button {
    opacity: 1;
  }
}

.sugar-carousel__button {
  display: block;
  opacity: 0.48;
  width: 30px;
  height: 2px;
  background-color: #d3dce6; // element-plus default like
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  transition: .3s;
}

.sugar-carousel__arrow {
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  height: 36px;
  width: 36px;
  cursor: pointer;
  transition: .3s;
  border-radius: 50%;
  background-color: rgba(31, 45, 61, .11);
  color: #fff;
  position: absolute;
  top: 50%;
  z-index: 20;
  transform: translateY(-50%);
  text-align: center;
  font-size: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: rgba(31, 45, 61, .23);
  }

  &--left {
    left: 16px;
  }

  &--right {
    right: 16px;
  }
}
.carousel-arrow-left-enter-from,
.carousel-arrow-left-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-10px);
}

.carousel-arrow-right-enter-from,
.carousel-arrow-right-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(10px);
}
</style>
