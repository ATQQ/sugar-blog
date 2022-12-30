<template>
  <div class="card recommend">
    <!-- 头部 -->
    <div class="card-header">
      <span class="title">🔍 相关文章</span>
      <el-button
        v-if="showChangeBtn"
        size="small"
        type="primary"
        text
        @click="changePage"
        >换一组</el-button
      >
    </div>
    <!-- 文章列表 -->
    <ol class="recommend-container">
      <li v-for="(v, idx) in currentWikiData" :key="v.route">
        <!-- 序号 -->
        <i class="num">{{ idx + 1 }}</i>
        <!-- 简介 -->
        <div class="des">
          <!-- title -->
          <el-link type="info" class="title" :href="v.route">{{
            v.meta.title
          }}</el-link>
          <!-- 描述信息 -->
          <div class="suffix">
            <!-- 日期 -->
            <span class="tag">{{ formatShowDate(v.meta.date) }}</span>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElButton, ElLink } from 'element-plus'
import { useRoute } from 'vitepress'
import { formatShowDate } from '../../utils/index'
import { useConfig } from '../../composables/config/blog'

const blogConfig = useConfig()
const docs = computed(() => blogConfig.config.pagesData)

const route = useRoute()

const recommendList = computed(() => {
  const paths = route.path.split('/')
  const data = docs.value
    .map((v) => {
      return {
        ...v,
        route: `/${v.route}`
      }
    })
    .filter((v) =>
      v.route.startsWith(paths.slice(0, paths.length - 1).join('/'))
    )
    .filter((v) => !!v.meta.title)
  return data
})
const pageSize = ref(9)
const currentPage = ref(1)
const changePage = () => {
  const newIdx =
    currentPage.value % Math.ceil(recommendList.value.length / pageSize.value)
  currentPage.value = newIdx + 1
}

const currentWikiData = computed(() => {
  const startIdx = (currentPage.value - 1) * pageSize.value
  const endIdx = startIdx + pageSize.value
  return recommendList.value.slice(startIdx, endIdx)
})

const showChangeBtn = computed(() => {
  return recommendList.value.length > pageSize.value
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
