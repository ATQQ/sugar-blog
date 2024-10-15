<script lang="ts" setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
import { useArticleConfig, useCurrentArticle } from '../composables/config/blog'

const { frontmatter } = useData()
const cover = computed(() => frontmatter.value.cover)

const currentArticle = useCurrentArticle()
const realCover = computed<string>(() => import.meta.env.DEV ? cover.value : currentArticle.value?.meta?.cover)

const article = useArticleConfig()
const hiddenCover = computed(
  () => frontmatter.value?.hiddenCover ?? article?.value?.hiddenCover ?? false
)
</script>

<template>
  <img v-if="cover && !hiddenCover" class="blog-doc-cover" :src="realCover">
</template>

<style lang="scss" scoped>
img.blog-doc-cover.blog-doc-cover.blog-doc-cover {
  width: 100%;
  object-fit: cover;
  max-height: none;
  margin-top: 20px;
}
</style>
