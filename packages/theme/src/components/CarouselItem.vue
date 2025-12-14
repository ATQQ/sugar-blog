<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onMounted, onUnmounted } from 'vue'

const instance = getCurrentInstance()
const uid = instance?.uid

const carousel = inject('carousel') as any
const { activeIndex, items, type, addItem, removeItem } = carousel

const index = computed(() => {
  return items.value.findIndex((item: any) => item.uid === uid)
})

const isActive = computed(() => index.value === activeIndex.value)

// Card logic
const CARD_SCALE = 0.83

const cardStyle = computed(() => {
  if (type.value !== 'card') {
    // Normal mode: simplified translate
    // const isPrev = index.value === activeIndex.value - 1 || (activeIndex.value === 0 && index.value === items.value.length - 1)
    // const isNext = index.value === activeIndex.value + 1 || (activeIndex.value === items.value.length - 1 && index.value === 0)

    // Simple show/hide for normal mode or use CSS transition
    // Better: use transform
    // const offset = index.value - activeIndex.value
    // Handle loop wrap
    // ... too complex to implement full logic in one go.
    // Let's rely on simple absolute positioning and z-index for normal fade/slide

    return {
      transform: `translateX(${(index.value - activeIndex.value) * 100}%)`,
      zIndex: isActive.value ? 2 : 1,
    }
  }

  // Card Mode
  // const parentWidth = instance?.parent?.vnode?.el?.offsetWidth || 0 // Need parent width
  // Actually simpler:
  // Active: translate(0) scale(1)
  // Prev: translate(-50%) scale(0.83)
  // Next: translate(50%) scale(0.83)
  // Others: hidden or further

  const active = activeIndex.value
  const count = items.value.length
  const idx = index.value

  // Logic from Element Plus (simplified)
  const processIndex = (index: number, activeIndex: number, length: number) => {
    if (activeIndex === 0 && index === length - 1)
      return -1
    if (activeIndex === length - 1 && index === 0)
      return length
    if (index < activeIndex - 1 && activeIndex - index >= length / 2)
      return length + 1
    if (index > activeIndex + 1 && index - activeIndex >= length / 2)
      return -2
    return index
  }

  const calculatedIndex = processIndex(idx, active, count)

  const inStage = Math.round(Math.abs(calculatedIndex - active)) <= 1

  const translate = (() => {
    if (calculatedIndex === active)
      return 0
    if (Math.abs(calculatedIndex - active) > 1)
      return 0 // Should be hidden really
    return calculatedIndex > active ? '50%' : '-50%'
  })()

  const scale = calculatedIndex === active ? 1 : CARD_SCALE
  const zIndex = calculatedIndex === active ? 10 : 0 // Simplified

  return {
    transform: `translateX(${translate}) scale(${scale})`,
    zIndex,
    opacity: inStage ? 1 : 0, // Hide others
    display: inStage ? 'block' : 'none', // optimize
  }
})

onMounted(() => {
  addItem({ uid })
})
onUnmounted(() => {
  removeItem(uid)
})
</script>

<template>
  <div
    v-if="type !== 'card' || cardStyle.display !== 'none'"
    class="sugar-carousel__item"
    :class="{
      'is-active': isActive,
      'is-in-stage': type === 'card' && cardStyle.opacity === 1,
      'sugar-carousel__item--card': type === 'card',
    }"
    :style="cardStyle"
  >
    <div v-if="type === 'card'" v-show="!isActive" class="sugar-carousel__mask" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.sugar-carousel__item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow: hidden;
  z-index: 0;
  transition: transform 0.4s ease-in-out;
  background-color: transparent; // Default
}

.sugar-carousel__item--card {
  width: 50%;
  left: 25%; // Center it initially?
  // Actually if we use translateX 50% or -50%, it's relative to item width.
  // Element Plus Card:
  // Item width is 50%.
  // Active item is at translateX(containerWidth/4).
  // Prev item at translateX(0).
  // Next item at translateX(containerWidth/2).

  // My simplified CSS logic:
  // left: 25% (centers the 50% width item in container)
  // active: translate(0) -> centered
  // prev: translate(-50% of item) -> -25% of container? No, -50% of 50% is -25% width.
  // left 25% - 25% = 0% (Left aligned)
  // next: translate(50% of item) -> +25% of container.
  // left 25% + 25% = 50% (Right aligned)
  // This works!
}

.sugar-carousel__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #fff;
    opacity: 0.24;
    transition: .2s;
}
</style>
