<script lang="ts" setup>
import { computed } from 'vue'

import { createId } from './utils'
import type { CommandGroupProps } from './types'

defineOptions({
  name: 'Command.Group',
})

defineProps<CommandGroupProps>()

const groupId = computed(() => createId('command-group'))
</script>

<template>
  <div
    :key="groupId"
    command-group=""
    role="presentation"
    :command-group-key="groupId"
    :data-value="heading"
  >
    <div v-if="heading" command-group-heading="">
      {{ heading }}
    </div>
    <div command-group-items="" role="group">
      <slot />
    </div>
  </div>
</template>
