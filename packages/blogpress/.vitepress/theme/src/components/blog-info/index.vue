<template>
  <div class="blog-info">
    <!-- 统计数据，日后支持，点击筛选出左侧的数据 -->
    <div class="card overview-data">
      <div class="overview-item">
        <span class="count">{{ homeData?.length }}</span>
        <span class="label">博客文章</span>
      </div>
      <div class="split"></div>
      <div class="overview-item">
        <span class="count">+{{ currentMonth?.length }}</span>
        <span class="label">本月上新</span>
      </div>
      <div class="split"></div>
      <div class="overview-item">
        <span class="count">+{{ currentWeek?.length }}</span>
        <span class="label">本周上新</span>
      </div>
    </div>
    <div class="card overview-data recommend">
      <!-- 头部 -->
      <div class="recommend-header">
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElButton, ElLink } from 'element-plus'
import { useHomeData } from '../../composables/home'
import { isCurrentWeek } from '../../utils'
import { formatShowDate } from '../blog-item'

const homeData = useHomeData()!
const nowMonth = new Date().getMonth()
const nowYear = new Date().getFullYear()
const currentMonth = computed(() => {
  return homeData?.filter((v) => {
    const pubDate = new Date(v.meta?.date)
    return pubDate?.getMonth() === nowMonth && pubDate.getFullYear() === nowYear
  })
})

const currentWeek = computed(() => {
  return homeData?.filter((v) => {
    const pubDate = new Date(v.meta?.date)
    return isCurrentWeek(pubDate)
  })
})

const recommendList = computed(() => {
  const data = homeData.filter((v) => v.meta.sticky)
  data.sort((a, b) => b.meta.sticky! - a.meta.sticky!)
  return [...data]
})
const pageSize = ref(8)
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
.blog-info {
  display: flex;
  flex-direction: column;
  min-width: 240px;
  position: relative;
  box-sizing: border-box;
}

@media screen and (min-width: 767px) {
  .blog-info {
    max-width: 300px;
  }
}

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
  cursor: pointer;
  display: flex;

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
}

.overview-data {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.split {
  width: 1px;
  opacity: 0.8;
  height: 10px;
  background-color: var(--badge-font-color);
}

.overview-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 0 10px;

  .count {
    font-size: 18px;
  }

  .label {
    margin-top: 6px;
    font-size: 12px;
    color: var(--description-font-color);
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

.recommend-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 12px;
  }
}
</style>
