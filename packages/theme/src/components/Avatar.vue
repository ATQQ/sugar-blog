<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 50,
  },
})

const sizeStyle = computed(() => {
  const { size } = props
  return {
    width: `${size}px`,
    height: `${size}px`,
  }
})
</script>

<template>
  <span
    class="blog-avatar blog-avatar--circle"
    :style="sizeStyle"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt"
    >
  </span>
</template>

<style scoped>
.blog-avatar {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
  color: #fff;
  background: #c0c4cc;
  font-size: 14px;
  vertical-align: middle;
  min-width: 50px;
}
.blog-avatar > img {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.blog-avatar--circle {
  border-radius: 50%;
}
</style>
