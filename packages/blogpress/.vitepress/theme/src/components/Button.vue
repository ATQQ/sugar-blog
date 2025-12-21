<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (val: string) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(val),
  },
  size: {
    type: String,
    default: 'default',
    validator: (val: string) => ['large', 'default', 'small'].includes(val),
  },
  text: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

function handleClick(evt: MouseEvent) {
  if (props.disabled)
    return
  emit('click', evt)
}

const classes = computed(() => {
  return [
    'sugar-button',
    `sugar-button--${props.type}`,
    `sugar-button--${props.size}`,
    {
      'is-text': props.text,
      'is-round': props.round,
      'is-disabled': props.disabled,
    },
  ]
})
</script>

<template>
  <button :class="classes" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<style scoped>
.sugar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 32px;
  white-space: nowrap;
  cursor: pointer;
  color: var(--vp-c-text-1);
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: 0.1s;
  font-weight: 500;
  user-select: none;
  vertical-align: middle;
  -webkit-appearance: none;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
}
.sugar-button:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-2);
  background-color: var(--vp-c-bg-alt);
}
.sugar-button:active {
  color: var(--vp-c-brand-3);
  border-color: var(--vp-c-brand-3);
}
.sugar-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.sugar-button {
  /* Types */
}
.sugar-button--primary {
  color: #fff;
  background-color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.sugar-button--primary:hover {
  background-color: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  color: #fff;
}
.sugar-button--primary:active {
  background-color: var(--vp-c-brand-3);
  border-color: var(--vp-c-brand-3);
  color: #fff;
}
.sugar-button--primary.is-text {
  color: var(--vp-c-brand-1);
  background-color: transparent;
  border-color: transparent;
}
.sugar-button--primary.is-text:hover {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-brand-2);
}
.sugar-button--primary.is-text:active {
  color: var(--vp-c-brand-3);
}
.sugar-button--danger {
  color: #fff;
  background-color: var(--vp-c-danger-2);
  border-color: var(--vp-c-danger-2);
}
.sugar-button--danger:hover {
  background-color: var(--vp-c-danger-3);
  border-color: var(--vp-c-danger-3);
  color: #fff;
}
.sugar-button--danger:active {
  background-color: var(--vp-c-danger-3);
  border-color: var(--vp-c-danger-3);
  color: #fff;
}
.sugar-button {
  /* Sizes */
}
.sugar-button--small {
  height: 24px;
  padding: 5px 11px;
  font-size: 12px;
  border-radius: 3px;
}
.sugar-button--large {
  height: 40px;
  padding: 12px 19px;
  font-size: 16px;
  border-radius: 4px;
}
</style>
