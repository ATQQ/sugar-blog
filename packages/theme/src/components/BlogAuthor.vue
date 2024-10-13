<script setup>
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { useBlogConfig, useGlobalAuthor, useHomeConfig } from '../composables/config/blog'

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
</script>

<template>
  <div v-if="show" class="blog-author">
    <img v-if="logo" :src="withBase(logo)" alt="avatar">
    <p v-if="author">
      {{ author }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.blog-author {
  margin-bottom: 20px;

  img {
    display: block;
    margin: 10px auto;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: rgba(var(--bg-gradient-home));
  }

  img:hover {
    transform: rotate(666turn);
    transition-duration: 59s;
    transition-timing-function: cubic-bezier(.34, 0, .84, 1)
  }

  p {
    text-align: center;
  }
}
</style>
