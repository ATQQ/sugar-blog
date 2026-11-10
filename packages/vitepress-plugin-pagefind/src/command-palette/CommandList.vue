<script lang="ts">
import { nextTick, onBeforeUnmount, ref, watchEffect } from 'vue'
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
function requestScrollToTop() {
  nextTick(() => {
    listRef.value?.scrollTo({ top: 0, behavior: 'instant' })
  })
}

let observer: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let sizer: HTMLDivElement | undefined

watchEffect((onCleanup) => {
  sizer = heightRef.value
  const wrapper = listRef.value
  let animationFrame: number
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastHeight: string | undefined
  if (sizer && wrapper) {
    const transitionEndAborter = new AbortController()
    const restoreScroll = () => {
      wrapper.style.overflowY = ''
    }
    // 只同步高度：content-visibility 等布局变化也会触发，不能在这里重置选中项
    observer = new ResizeObserver(() => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        const height = `${sizer?.offsetHeight.toFixed(1)}px`
        if (height === lastHeight)
          return
        lastHeight = height
        // 避免过渡时短暂出现的滚动条。
        wrapper.style.overflowY = 'clip'
        clearTimeout(timeoutId)
        // 如果下方的 transitionend 异常超时导致未能正确触发恢复 overflow，则执行该 setTimeout 第二道保险。
        timeoutId = setTimeout(restoreScroll, 500)
        wrapper.style.setProperty('--command-list-height', height)
      })
    })
    observer.observe(sizer)
    // 结果节点增删时才重新选中第一项
    mutationObserver = new MutationObserver(() => {
      rerenderList.value = true
    })
    mutationObserver.observe(sizer, { childList: true, subtree: true })
    wrapper.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'height') {
        clearTimeout(timeoutId)
        restoreScroll()
      }
    }, { signal: transitionEndAborter.signal })

    const currentSizer = sizer
    onCleanup(() => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(timeoutId)
      observer?.unobserve(currentSizer)
      mutationObserver?.disconnect()
      transitionEndAborter.abort()
    })
  }
})

onBeforeUnmount(() => {
  if (observer !== null && sizer)
    observer.disconnect()
  mutationObserver?.disconnect()
})

defineExpose({ requestScrollToTop })
</script>

<template>
  <div ref="listRef" command-list="" role="listbox" aria-label="Suggestions" :tabindex="-1">
    <div ref="heightRef" command-list-sizer="" :data-empty-text="emptyText">
      <slot />
    </div>
  </div>
</template>
