<script lang="ts">
import { onBeforeUnmount, ref, watchEffect } from 'vue'
</script>

<script lang="ts" setup>
import { useCommandEvent } from './useCommandEvent'

defineOptions({
  name: 'Command.List',
})

defineProps<{
  emptyText?: string
}>()

const { rerenderList } = useCommandEvent()

const listRef = ref<HTMLDivElement>()
const heightRef = ref<HTMLDivElement>()

let observer: ResizeObserver | null = null
let sizer: HTMLDivElement | undefined

watchEffect(() => {
  sizer = heightRef.value
  const wrapper = listRef.value
  let animationFrame: number
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  if (sizer && wrapper) {
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'height') {
        clearTimeout(timeoutId)
        wrapper.style.overflowY = ''
      }
    }
    observer = new ResizeObserver(() => {
      // 避免过渡时短暂出现的滚动条。
      wrapper.style.overflowY = 'hidden'
      clearTimeout(timeoutId)
      // 如果下方的 transitionend 异常超时导致未能正确触发恢复 overflow，则执行该 setTimeout 第二道保险。
      timeoutId = setTimeout(() => {
        wrapper.style.overflowY = ''
      }, 500)
      animationFrame = requestAnimationFrame(() => {
        const height = sizer?.offsetHeight
        wrapper?.style.setProperty(
          '--command-list-height',
          `${height?.toFixed(1)}px`,
        )

        rerenderList.value = true
      })
    })
    observer.observe(sizer)
    wrapper.addEventListener('transitionend', onTransitionEnd)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(timeoutId)
      observer?.unobserve(sizer!)
      wrapper.removeEventListener('transitionend', onTransitionEnd)
    }
  }
})

onBeforeUnmount(() => {
  if (observer !== null && sizer)
    observer.unobserve(sizer)
})
</script>

<template>
  <div ref="listRef" command-list="" role="listbox" aria-label="Suggestions" :tabindex="-1">
    <div ref="heightRef" command-list-sizer="" :data-empty-text="emptyText">
      <slot />
    </div>
  </div>
</template>
