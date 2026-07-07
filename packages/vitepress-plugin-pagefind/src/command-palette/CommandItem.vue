<script lang="ts">
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue'
</script>

<script lang="ts" setup>
import { useMagicKeys, whenever } from '@vueuse/core'

import { useCommandState } from './useCommandState'
import { useCommandEvent } from './useCommandEvent'
import { createId } from './utils'
import type { CommandItemEmits, CommandItemProps } from './types'

defineOptions({
  name: 'Command.Item',
})

const props = defineProps<CommandItemProps>()

const emit = defineEmits<CommandItemEmits>()

const SELECT_EVENT = 'command-item-select'
const VALUE_ATTR = 'data-value'

const { current } = useMagicKeys()
const { selectedNode } = useCommandState()
const { itemInfo } = useCommandEvent()

const itemRef = ref<HTMLDivElement>()

const itemId = computed(() => createId('command-item'))

const currentKeys = computed(() => Array.from(current))

function handleSelect() {
  const itemInfoObj = {
    key: itemId.value,
    value: itemRef.value?.getAttribute(VALUE_ATTR) || '',
  }

  itemInfo.value = itemInfoObj
  emit('select', itemInfoObj)
}

whenever(currentKeys, () => {
  if (props.shortcut && props.shortcut.length > 0) {
    const hasKey = props.shortcut.every(key => current.has(key.toLowerCase()))
    if (hasKey && props.perform)
      props.perform()
  }
})

watchEffect(() => {
  itemRef.value?.addEventListener(SELECT_EVENT, handleSelect)
})

onBeforeUnmount(() => {
  itemRef.value?.removeEventListener(SELECT_EVENT, handleSelect)
})
</script>

<template>
  <div
    ref="itemRef"
    :key="itemId"
    command-item=""
    role="option"
    :aria-selected="selectedNode === itemId"
    :aria-disabled="false"
    :command-item-key="itemId"
    @click="handleSelect"
  >
    <slot />
  </div>
</template>
