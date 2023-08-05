<template>
  <div
    class="recommend"
    :class="{ card: sidebarStyle === 'card' }"
    v-if="_recommend !== false && (recommendList.length || emptyText)"
    data-pagefind-ignore="all"
  >
    <!-- 头部 -->
    <div class="card-header">
      <span class="title" v-if="title">{{ title }}</span>
      <el-button
        v-if="showChangeBtn"
        size="small"
        type="primary"
        text
        @click="changePage"
        >{{ nextText }}</el-button
      >
    </div>
    <!-- 文章列表 -->
    <ol class="recommend-container" v-if="currentWikiData.length">
      <li v-for="(v, idx) in currentWikiData" :key="v.route">
        <!-- 序号 -->
        <i class="num">{{ startIdx + idx + 1 }}</i>
        <!-- 简介 -->
        <div class="des">
          <!-- title -->
          <el-link
            type="info"
            class="title"
            :class="{
              current: isCurrentDoc(v.route)
            }"
            :href="v.route"
            >{{ v.meta.title }}</el-link
          >
          <!-- 描述信息 -->
          <div class="suffix">
            <!-- 日期 -->
            <span class="tag">{{ formatShowDate(v.meta.date) }}</span>
          </div>
        </div>
      </li>
    </ol>
    <div class="empty-text" v-else>{{ emptyText }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { ElButton, ElLink } from 'element-plus'
import { formatShowDate } from '../utils/index'
import { useArticles, useBlogConfig } from '../composables/config/blog'

const { recommend: _recommend } = useBlogConfig()

const sidebarStyle = computed(() =>
  _recommend && _recommend?.style ? _recommend.style : 'card'
)

const recommendPadding = computed(() =>
  sidebarStyle.value === 'card' ? '10px' : '0px'
)
const recommend = computed(() =>
  _recommend === false ? undefined : _recommend
)
const title = computed(() => recommend.value?.title ?? '🔍 相关文章')
const pageSize = computed(() => recommend.value?.pageSize || 9)
const nextText = computed(() => recommend.value?.nextText || '换一组')
const emptyText = computed(() => recommend.value?.empty ?? '暂无相关文章')

const docs = useArticles()

const route = useRoute()

const recommendList = computed(() => {
  // 中文支持
  const paths = decodeURIComponent(route.path).split('/')

  const origin = docs.value
    .map((v) => ({ ...v, route: withBase(v.route) }))
    // 过滤出公共路由前缀
    // 限制为同路由前缀
    .filter(
      (v) =>
        v.route.split('/').length === paths.length &&
        v.route.startsWith(paths.slice(0, paths.length - 1).join('/'))
    )
    // 过滤出带标题的
    .filter((v) => !!v.meta.title)
    // 过滤掉自己
    .filter(
      (v) =>
        (recommend.value?.showSelf ?? true) ||
        v.route !== decodeURIComponent(route.path).replace(/.html$/, '')
    )
    // 过滤掉不需要展示的
    .filter((v) => v.meta.recommend !== false)
    .filter((v) => recommend.value?.filter?.(v) ?? true)

  const topList = origin.filter((v) => v.meta?.recommend)
  topList.sort((a, b) => Number(a.meta.recommend) - Number(b.meta.recommend))

  const normalList = origin.filter((v) => !v.meta?.recommend)
  normalList.sort((a, b) => +new Date(b.meta.date) - +new Date(a.meta.date))

  return topList.concat(normalList)
})

const isCurrentDoc = (value: string) => {
  return value === decodeURIComponent(route.path).replace(/.html$/, '')
}

const currentPage = ref(1)
const changePage = () => {
  const newIdx =
    currentPage.value % Math.ceil(recommendList.value.length / pageSize.value)
  currentPage.value = newIdx + 1
}
// 当前页开始的序号
const startIdx = computed(() => (currentPage.value - 1) * pageSize.value)

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

.recommend {
  flex-direction: column;
  padding: v-bind(recommendPadding);
}

.recommend-container {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0 10px 0 0px;
  width: 100%;

  li {
    display: flex;

    .num {
      display: block;
      font-size: 14px;
      color: var(--description-font-color);
      font-weight: 600;
      margin: 6px 8px 10px 0;
      width: 22px;
      height: 18px;
      line-height: 18px;
      text-align: center;
    }

    .des {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .title {
      font-size: 14px;
      color: var(--vp-c-text-1);
      word-break: break-all;
      white-space: break-spaces;
      &.current {
        color: var(--vp-c-brand);
      }
    }

    .suffix {
      font-size: 12px;
      color: var(--vp-c-text-2);
    }
  }
}

.card-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .title {
    font-size: 16px;
  }
}
.empty-text {
  padding: 6px;
  font-size: 14px;
  text-align: center;
}
</style>
