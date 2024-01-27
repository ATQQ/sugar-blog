<script lang="ts" setup>
import { useElementSize } from '@vueuse/core'
import { ElIcon } from 'element-plus'
import { computed, ref } from 'vue'

function handleBackRoTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const { width } = useElementSize(ref(document.querySelector('.vp-doc') as any))
const docWidth = computed(() => `${width.value}px`)
</script>

<template>
  <div class="back-to-top">
    <span class="icon-wrapper">
      <ElIcon size="20px" @click="handleBackRoTop">
        <svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="m20 22l-3.86-1.55c.7-1.53 1.2-3.11 1.51-4.72zM7.86 20.45L4 22l2.35-6.27c.31 1.61.81 3.19 1.51 4.72M12 2s5 2 5 10c0 3.1-.75 5.75-1.67 7.83A2 2 0 0 1 13.5 21h-3a2 2 0 0 1-1.83-1.17C7.76 17.75 7 15.1 7 12c0-8 5-10 5-10m0 10c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2"
          />
        </svg>
      </ElIcon>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.back-to-top {
    position: fixed;
    width: v-bind(docWidth);
    text-align: right;
    bottom: 80px;
    font-size: 16px;
    transition: all 0.3s ease-in-out;
    opacity: 0.6;
    display: flex;
    justify-content: right;
    z-index: 200;

    &:hover {
        opacity: 1;
    }

    .icon-wrapper {
        cursor: pointer;
        border-radius: 50%;
        position: relative;
        right: -80px;
        background-color: var(--vp-c-bg);
        box-shadow: var(--box-shadow);
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--vp-c-brand-soft);
        color: var(--vp-c-brand-1);

        &:hover {
            box-shadow: var(--box-shadow-hover);
        }
    }
}

@media screen and (max-width: 1200px) {
    .back-to-top .icon-wrapper {
        border-radius: 50%;
        position: static;
    }
}
</style>
