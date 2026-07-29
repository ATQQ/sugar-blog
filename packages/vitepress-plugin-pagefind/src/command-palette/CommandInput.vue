<script lang="ts">
import { ref, watchEffect } from 'vue'
</script>

<script lang="ts" setup>
import type { CommandInputProps } from './types'

defineOptions({
  name: 'Command.Input',
})

defineProps<CommandInputProps>()

const inputRef = ref<HTMLInputElement | null>(null)
const localSearch = defineModel<string>({ default: '' })

watchEffect(() => {
  inputRef.value?.focus()
})

defineExpose({
  get $el() {
    return inputRef.value
  },
})
</script>

<template>
  <input
    ref="inputRef"
    v-model="localSearch"
    command-input=""
    auto-focus
    auto-complete="off"
    auto-correct="off"
    :spell-check="false"
    aria-autocomplete="list"
    role="combobox"
    :aria-expanded="true"
    :placeholder="placeholder"
  >
</template>
