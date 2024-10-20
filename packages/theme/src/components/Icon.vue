<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  size?: string | number
  icon?: string
}>()

const size = computed(() => props.size && (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <i v-if="props.icon" class="sugar-theme-icon" :style="{ fontSize: size }" v-html="props.icon" />
  <i v-else class="sugar-theme-icon" :style="{ fontSize: size }">
    <slot />
  </i>
</template>

<style lang="css" scoped>
.sugar-theme-icon {
    --color: inherit;
    align-items: center;
    display: inline-flex;
    height: 1em;
    justify-content: center;
    line-height: 1em;
    position: relative;
    width: 1em;
    fill: currentColor;
    color: var(--color);
    font-size: inherit;
}
</style>
