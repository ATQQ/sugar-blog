<script lang="ts" setup>
import { computed, watch } from 'vue'
import { ElTag } from 'element-plus'
import { useBrowserLocation, useDark, useUrlSearchParams } from '@vueuse/core'
import { useRoute, useRouter } from 'vitepress'
import {
  useActiveTag,
  useArticles,
  useCurrentPageNum,
  useHomeTagsConfig,
} from '../composables/config/blog'
import { tagsSvgStr } from '../constants/svg'

const route = useRoute()
const docs = useArticles()
const homeTagsConfig = useHomeTagsConfig()
const showTags = computed(() => !!(homeTagsConfig.value ?? true))
const title = computed(() => (typeof homeTagsConfig.value === 'boolean' || !homeTagsConfig.value?.title)
  ? `${tagsSvgStr}标签`
  : homeTagsConfig.value?.title
)
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
      <span class="title svg-icon" v-html="title" />
      <ElTag
        v-if="activeTag.label" :type="activeTag.type || 'primary'" :effect="colorMode" closable
        @close="handleCloseTag"
      >
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
