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
const isRequestedScrollToTop = ref(false)
function requestScrollToTop() {
  isRequestedScrollToTop.value = true
}

let observer: ResizeObserver | null = null
let sizer: HTMLDivElement | undefined

watchEffect(() => {
  sizer = heightRef.value
  const wrapper = listRef.value
  let animationFrame: number
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  if (sizer && wrapper) {
    const wrapperScrollAborter = new AbortController()
    const transitionEndAborter = new AbortController()
    wrapperScrollAborter.signal.addEventListener('abort', () => isRequestedScrollToTop.value = false)
    const restoreScroll = () => {
      wrapper.style.overflowY = ''
    }
    observer = new ResizeObserver(() => {
      // 避免过渡时短暂出现的滚动条。
      wrapper.style.overflowY = 'clip'
      clearTimeout(timeoutId)
      // 如果下方的 transitionend 异常超时导致未能正确触发恢复 overflow，则执行该 setTimeout 第二道保险。
      timeoutId = setTimeout(() => {
        restoreScroll()
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
    wrapper.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'height') {
        clearTimeout(timeoutId)
        restoreScroll()
      }
    }, { signal: transitionEndAborter.signal })
    wrapper.addEventListener('scroll', (e) => {
      if (isRequestedScrollToTop.value) {
        e.preventDefault()
        wrapper.scrollTo({ top: 0, behavior: 'instant' })
        isRequestedScrollToTop.value = false
      }
    }, { signal: wrapperScrollAborter.signal })

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(timeoutId)
      observer?.unobserve(sizer!)
      transitionEndAborter.abort()
      wrapperScrollAborter.abort()
    }
  }
})

onBeforeUnmount(() => {
  if (observer !== null && sizer)
    observer.disconnect()
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
