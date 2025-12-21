<script setup>
import { useData, withBase } from 'vitepress'
import { computed, ref } from 'vue'
import { useGlobalAuthor, useHomeConfig } from '../composables/config/blog'
import { useHoverSpin } from '../hooks/useHoverSpin'

const home = useHomeConfig()
const { frontmatter, site } = useData()
const globalAuthor = useGlobalAuthor()
const author = computed(() =>
  frontmatter.value.author
  ?? frontmatter.value?.blog?.author
  ?? home?.value?.author
  ?? globalAuthor?.value
)
const logo = computed(() =>
  frontmatter.value?.logo
  ?? frontmatter.value?.blog?.logo
  ?? home?.value?.logo
  ?? site.value?.themeConfig?.logo
  ?? '/logo.png'
)
const show = computed(() => author.value || logo.value)

const imgRef = ref(null)

useHoverSpin(imgRef, home?.value?.hoverSpin)
</script>

<template>
  <div v-if="show" class="blog-author">
    <img v-if="logo" ref="imgRef" :src="withBase(logo)" alt="avatar">
    <p v-if="author">
      {{ author }}
    </p>
  </div>
</template>

<style scoped>
.blog-author {
  margin-bottom: 20px;
}
.blog-author img {
  display: block;
  margin: 10px auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(var(--bg-gradient-home));
  cursor: pointer;
}
.blog-author p {
  text-align: center;
}
</style>
