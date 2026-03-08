<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useBrowserLocation, useUrlSearchParams } from '@vueuse/core'
import { useRoute, useRouter } from 'vitepress'
import {
  useActiveTag,
  useArticles,
  useCurrentPageNum,
  useHomeTagsConfig,
} from '../composables/config/blog'
import { tagsSvgStr } from '../constants/svg'
import Tag from './Tag.vue'

const route = useRoute()
const docs = useArticles()
const homeTagsConfig = useHomeTagsConfig()
const showTags = computed(() => !!(homeTagsConfig.value ?? true))
const title = computed(() => (typeof homeTagsConfig.value === 'boolean' || !homeTagsConfig.value?.title)
  ? `${tagsSvgStr}标签`
  : homeTagsConfig.value?.title
)

// 统计每个标签的文章数量，并按数量降序排序
const tagsWithCount = computed(() => {
  const tagCountMap = new Map<string, number>()
  docs.value.forEach((v) => {
    const articleTags = v.meta.tag || []
    const flatTags = Array.isArray(articleTags) ? articleTags.flat(3) : [articleTags]
    flatTags.forEach((tag: string) => {
      tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1)
    })
  })
  // 按文章数量降序排序
  const data = [...tagCountMap.entries()]
  const sort = (typeof homeTagsConfig.value === 'object' && homeTagsConfig.value?.sort) ? homeTagsConfig.value.sort : 'normal'
  if (sort !== 'normal') {
    data.sort((a, b) => {
      return sort === 'asc' ? a[1] - b[1] : b[1] - a[1]
    })
  }
  return data.map(([tag, count]) => ({ tag, count }))
})

// 折叠/展开功能，从配置中读取 limit，默认 10
const limit = computed(() => {
  if (typeof homeTagsConfig.value === 'object' && homeTagsConfig.value?.limit) {
    return homeTagsConfig.value.limit
  }
  return 999
})
const isExpanded = ref(false)
const displayTags = computed(() => {
  if (isExpanded.value || tagsWithCount.value.length <= limit.value) {
    return tagsWithCount.value
  }
  return tagsWithCount.value.slice(0, limit.value)
})
const hasMore = computed(() => tagsWithCount.value.length > limit.value)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

const activeTag = useActiveTag()

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
  <div v-if="showTags && tagsWithCount.length" class="card tags" data-pagefind-ignore="all">
    <!-- 头部 -->
    <div class="card-header">
      <span class="title svg-icon" v-html="title" />
      <Tag
        v-if="activeTag.label" :type="activeTag.type || 'primary'" closable
        @close="handleCloseTag"
      >
        {{ activeTag.label }}
      </Tag>
    </div>
    <!-- 标签列表 -->
    <ul class="tag-list">
      <li v-for="(item, idx) in displayTags" :key="item.tag">
        <Tag
          :type="tagType[idx % tagType.length] || 'primary'"
          @click="handleTagClick(item.tag, tagType[idx % tagType.length])"
        >
          {{ item.tag }}
          <span v-if="typeof homeTagsConfig === 'object' && homeTagsConfig?.showCount" class="tag-count">{{ item.count }}</span>
        </Tag>
      </li>
    </ul>
    <!-- 展开/收起按钮 -->
    <div v-if="hasMore" class="expand-btn" @click="toggleExpand">
      <span>{{ isExpanded ? '收起' : `展开全部 ${tagsWithCount.length} 个标签` }}</span>
      <svg
        class="expand-icon"
        :class="{ 'is-expanded': isExpanded }"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
      >
        <path
          fill="currentColor"
          d="M488.832 344.32l-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0z"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
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
}
.card:hover {
  box-shadow: var(--box-shadow-hover);
}

.card-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.card-header .title {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.tags {
  flex-direction: column;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.tag-list li {
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 1;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.3);
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 6px;
  padding: 4px 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.3s;
  user-select: none;
}
.expand-btn:hover {
  color: var(--vp-c-brand);
}

.expand-icon {
  transition: transform 0.3s;
  transform: rotate(180deg);
}
.expand-icon.is-expanded {
  transform: rotate(0deg);
}
</style>
