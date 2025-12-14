<script lang="ts" setup>
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  loading: { type: String, default: 'eager' },
})
</script>

<template>
  <div class="sugar-image">
    <img
      :src="src"
      :alt="alt"
      :loading="loading as any"
      class="sugar-image__inner"
    >
  </div>
</template>

<style lang="scss" scoped>
.sugar-image {
  position: relative;
  display: inline-block;
  overflow: hidden;

  &__inner {
    width: 100%;
    height: 100%;
    vertical-align: top;
    object-fit: inherit;
    cursor: pointer;
  }
}
</style>
