<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  type: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'text' | 'default'
}>()

const type = computed(() => props.type ?? 'primary')
</script>

<template>
  <button class="announcement-button" :class="`announcement-button-${type}`">
    <span>
      <slot />
    </span>
  </button>
</template>

<style lang="css" scoped>
.announcement-button+.announcement-button{
    margin-left: 12px;
}
.announcement-button{
    --bgc: #409eff;
    --bc:var(--bgc);
    --c: #fff;
}
.announcement-button {
    align-items: center;
    -webkit-appearance: none;
    background-color: var(--bgc);
    border: 1px solid #dcdfe6;
    border-color: var(--bc);
    border-radius: 4px;
    box-sizing: border-box;
    color: var(--c);
    cursor: pointer;
    display: inline-flex;
    font-size: 14px;
    font-weight: 500;
    height: 32px;
    justify-content: center;
    line-height: 1;
    outline: none;
    padding: 8px 15px;
    text-align: center;
    transition: .1s;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
}

.announcement-button-primary {
    --bgc: var(--vp-c-brand-2);
}
.announcement-button-success {
    --bgc: #67c23a;
}
.announcement-button-danger {
    --bgc: #f56c6c;
}
.announcement-button-warning {
    --bgc: #e6a23c;
}
.announcement-button-info {
    --bgc: #909399;
}
.announcement-button-text {
    --bgc: transparent;
    --bc: transparent;
    --c: var(--vp-c-brand-2);
    padding-left: 0;
    padding-right: 0;
}
.announcement-button-default {
    --bgc: #fff;
    --bc: #dcdfe6;
    --c: #606266;
}
</style>
