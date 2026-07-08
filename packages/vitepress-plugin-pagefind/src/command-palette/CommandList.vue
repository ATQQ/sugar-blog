<script lang="ts">
import { onBeforeUnmount, ref, watchEffect } from 'vue'
</script>

<script lang="ts" setup>
import { useCommandEvent } from './useCommandEvent'

defineOptions({
  name: 'Command.List',
})

const { rerenderList } = useCommandEvent()

const listRef = ref<HTMLDivElement>()
const heightRef = ref<HTMLDivElement>()

let observer: ResizeObserver | null = null
let sizer: HTMLDivElement | undefined

watchEffect(() => {
  sizer = heightRef.value
  const wrapper = listRef.value
  let animationFrame: any
  if (sizer && wrapper) {
    observer = new ResizeObserver(() => {
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

    return () => {
      cancelAnimationFrame(animationFrame)
      observer?.unobserve(sizer!)
    }
  }
})

onBeforeUnmount(() => {
  if (observer !== null && sizer)
    observer.unobserve(sizer)
})
</script>

<template>
  <div ref="listRef" command-list="" role="listbox" aria-label="Suggestions">
    <div ref="heightRef" command-list-sizer="">
      <slot />
    </div>
  </div>
</template>
