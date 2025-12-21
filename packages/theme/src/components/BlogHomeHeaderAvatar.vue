<script  setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed, ref } from 'vue'
import { useHomeConfig } from '../composables/config/blog'
import { useHoverSpin } from '../hooks/useHoverSpin'

const home = useHomeConfig()
const { frontmatter, site } = useData()
const logo = computed(() =>
  frontmatter.value.logo
    ?? frontmatter.value?.blog?.logo
    ?? home?.value?.logo
    ?? site.value.themeConfig?.logo
    ?? '/logo.png'
)
const alwaysHide = computed(() => frontmatter.value.blog?.minScreenAvatar === false)

const imgRef = ref(null)
useHoverSpin(imgRef, home?.value?.hoverSpin)
</script>

<template>
  <div v-show="!alwaysHide" class="blog-home-header-avatar">
    <img ref="imgRef" :src="withBase(logo)" alt="avatar">
  </div>
</template>

<style scoped>
.blog-home-header-avatar {
  padding-top: 40px;
  display: flex;
  align-items: center;
}
.blog-home-header-avatar img {
  display: block;
  margin: 0 auto;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: transparent;
  border: 5px solid rgba(var(--bg-gradient-home));
  box-sizing: border-box;
  cursor: pointer;
}

@media screen and (min-width: 768px) {
  .blog-home-header-avatar {
    display: none;
  }
}
</style>
