<template>
  <div class="card tags">
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
import { computed } from 'vue'
import { ElTag } from 'element-plus'
import { useDark } from '@vueuse/core'
import { useHomeData } from '../../composables/home'

const homeData = useHomeData()!
const docs = computed(() => homeData.docs)

const tags = computed(() => {
  return [...new Set(docs.value.map((v) => v.meta.tag || []).flat(3))]
})

const activeTag = homeData.activeTag.value
// 同一个引用
// console.log(activeTag === homeData.activeTag.value);

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance'
})

const colorMode = computed(() => (isDark.value ? 'light' : 'dark'))

const tagType: any = ['', 'info', 'success', 'warning', 'danger']

const handleCloseTag = () => {
  activeTag.label = ''
  activeTag.type = ''
}

const handleTagClick = (tag: string, type: string) => {
  if (tag === activeTag.label) {
    handleCloseTag()
    return
  }
  activeTag.type = type
  activeTag.label = tag
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
