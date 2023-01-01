<template>
  <div class="card recommend">
    <!-- 头部 -->
    <div class="card-header">
      <span class="title">🔥 精选文章</span>
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
import { useArticles } from '../composables/config/blog'
import { formatShowDate } from '../utils/index'

const docs = useArticles()

const recommendList = computed(() => {
  const data = docs.value.filter((v) => v.meta.sticky)
  data.sort((a, b) => b.meta.sticky! - a.meta.sticky!)
  return [...data]
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

.recommend {
  flex-direction: column;
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

    &:nth-child(1) .num {
      background-color: #f56c6c;
      color: #fff;
      font-size: 12px;
      border-radius: 8px 0 8px 0;
    }

    &:nth-child(2) .num {
      background-color: #67c23a;
      color: #fff;
      font-size: 12px;
      border-radius: 0 8px 0 8px;
    }

    &:nth-child(3) .num {
      background-color: #409eff;
      color: #fff;
      font-size: 12px;
      border-radius: 6px;
    }

    .num {
      display: block;
      font-size: 14px;
      color: var(--description-font-color);
      font-weight: 600;
      margin: 6px 12px 10px 0;
      width: 18px;
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
    }

    .suffix {
      font-size: 12px;
      color: var(--vp-c-text-2);
    }
  }
}
</style>
