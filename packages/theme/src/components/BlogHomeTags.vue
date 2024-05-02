<script lang="ts" setup>
import { computed, watch } from 'vue'
import { ElTag } from 'element-plus'
import { useBrowserLocation, useDark, useUrlSearchParams } from '@vueuse/core'
import { useRoute, useRouter } from 'vitepress'
import {
  useActiveTag,
  useArticles,
  useConfig,
  useCurrentPageNum,
} from '../composables/config/blog'

const route = useRoute()
const docs = useArticles()
const showTags = useConfig()?.config?.blog?.homeTags ?? true
const tags = computed(() => {
  return [...new Set(docs.value.map(v => v.meta.tag || []).flat(3))]
})

const activeTag = useActiveTag()

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance'
})

const colorMode = computed(() => (isDark.value ? 'light' : 'dark'))

const tagType: any = ['', 'info', 'success', 'warning', 'danger']
const currentPage = useCurrentPageNum()
const router = useRouter()

function handleCloseTag() {
  activeTag.value.label = ''
  activeTag.value.type = ''
  currentPage.value = 1
  router.go(`${window.location.origin}${router.route.path}`)
}

const location = useBrowserLocation()

function handleTagClick(tag: string, type: string) {
  if (tag === activeTag.value.label) {
    handleCloseTag()
    return
  }
  activeTag.value.type = type
  activeTag.value.label = tag
  currentPage.value = 1
  router.go(
    `${location.value.origin}${router.route.path}?tag=${tag}&type=${type}`
  )
}

watch(
  location,
  () => {
    if (location.value.href) {
      const url = new URL(location.value.href!)
      activeTag.value.type = url.searchParams.get('type') || ''
      activeTag.value.label = url.searchParams.get('tag') || ''
    }
  },
  {
    immediate: true
  }
)

watch(
  route,
  () => {
    const params = useUrlSearchParams()
    if (!params.tag) {
      activeTag.value.type = ''
      activeTag.value.label = ''
    }
  }
)
</script>

<template>
  <div v-if="showTags && tags.length" class="card tags" data-pagefind-ignore="all">
    <!-- 头部 -->
    <div class="card-header">
      <span class="title svg-icon"><svg
        t="1695048840129" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="4290" width="200" height="200"
      >
        <path
          d="M810.88 245.888a118.432 118.432 0 1 0 0 236.864 118.432 118.432 0 0 0 0-236.864z m-151.008 118.432a151.008 151.008 0 1 1 302.016 0 151.008 151.008 0 0 1-302.016 0z"
          fill="#D3D3D3" p-id="4291"
        />
        <path
          d="M774.08 565.6l61.76-160.64c6.4-16.64 2.56-35.84-10.24-48.64l-151.04-151.04c-12.8-12.8-31.68-16.64-48.64-10.24l-160.64 61.76c-12.16 4.8-23.36 11.84-32.64 21.12l-355.2 355.2c-17.92 17.92-17.92 46.72 0 64.32l256 256c17.92 17.92 46.72 17.92 64.32 0l355.2-355.2c9.28-9.28 16.32-20.16 21.12-32.64z m-159.36-149.12c-22.08-22.08-22.08-57.6 0-79.68 22.08-22.08 57.6-22.08 79.68 0 22.08 22.08 22.08 57.6 0 79.68-22.08 21.76-57.92 21.76-79.68 0z"
          fill="#FCD53F" p-id="4292"
        />
        <path
          d="M654.4 320.48c14.4 0 28.8 5.44 39.68 16.64 22.08 22.08 22.08 57.6 0 79.68-10.88 10.88-25.28 16.64-39.68 16.64-14.4 0-28.8-5.44-39.68-16.64-22.08-22.08-22.08-57.6 0-79.68 10.88-11.2 25.28-16.64 39.68-16.64z m0-30.08c-23.04 0-44.8 8.96-61.12 25.28a86.72 86.72 0 0 0 0 122.24c16.32 16.32 38.08 25.28 61.12 25.28s44.8-8.96 61.12-25.28a86.72 86.72 0 0 0 0-122.24c-16.32-16.32-38.08-25.28-61.12-25.28z"
          fill="#F8312F" p-id="4293"
        />
        <path
          d="M676.16 348.032c8.992 0 16.288 7.296 16.288 16.288a118.144 118.144 0 0 0 64.288 105.44h0.064c22.24 11.296 47.36 15.264 71.68 11.84a16.288 16.288 0 0 1 4.48 32.32 154.24 154.24 0 0 1-90.848-15.04 150.72 150.72 0 0 1-82.24-134.56c0-8.992 7.296-16.288 16.288-16.288z"
          fill="#D3D3D3" p-id="4294"
        />
      </svg> 标签</span>
      <ElTag v-if="activeTag.label" :type="activeTag.type || 'primary'" :effect="colorMode" closable @close="handleCloseTag">
        {{ activeTag.label }}
      </ElTag>
    </div>
    <!-- 标签列表 -->
    <ul class="tag-list">
      <li v-for="(tag, idx) in tags" :key="tag">
        <ElTag
          :type="tagType[idx % tagType.length] || 'primary'" :effect="colorMode"
          @click="handleTagClick(tag, tagType[idx % tagType.length])"
        >
          {{ tag }}
        </ElTag>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.card {
  position: relative;
  margin: 0 auto 10px;
  padding: 10px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition: all 0.3s;
  background-color: rgba(var(--bg-gradient));
  display: flex;

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
}

.card-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 12px;
    display: flex;
    align-items: center;
  }
}

.tags {
  flex-direction: column;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;

  li {
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }
}
</style>
