<template>
  <div class="card tags" v-if="tags.length" data-pagefind-ignore="all">
    <!-- 头部 -->
    <div class="card-header">
      <span class="title">🏷 标签</span>
      <el-tag
        v-if="activeTag.label"
        :type="(activeTag.type as any)"
        :effect="colorMode"
        closable
        @close="handleCloseTag"
      >
        {{ activeTag.label }}
      </el-tag>
    </div>
    <!-- 标签列表 -->
    <ul class="tag-list">
      <li v-for="(tag, idx) in tags" :key="tag">
        <el-tag
          :type="tagType[idx % tagType.length]"
          @click="handleTagClick(tag, tagType[idx % tagType.length])"
          :effect="colorMode"
        >
          {{ tag }}
        </el-tag>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { ElTag } from 'element-plus'
import { useBrowserLocation, useDark } from '@vueuse/core'
import { useRouter } from 'vitepress'
import {
  useActiveTag,
  useArticles,
  useCurrentPageNum
} from '../composables/config/blog'

const docs = useArticles()

const tags = computed(() => {
  return [...new Set(docs.value.map((v) => v.meta.tag || []).flat(3))]
})

const activeTag = useActiveTag()

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance'
})

const colorMode = computed(() => (isDark.value ? 'light' : 'dark'))

const tagType: any = ['', 'info', 'success', 'warning', 'danger']
const currentPage = useCurrentPageNum()

const handleCloseTag = () => {
  activeTag.value.label = ''
  activeTag.value.type = ''
  currentPage.value = 1
  router.go(`${window.location.origin}${router.route.path}`)
}

const router = useRouter()
const location = useBrowserLocation()

const handleTagClick = (tag: string, type: string) => {
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
</script>

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
