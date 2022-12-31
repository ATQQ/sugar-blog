<template>
  <div class="blog-search">
    <div class="nav-search-btn-wait" @click="searchModal = true">
      <el-icon size="22px">
        <Search />
      </el-icon>
      <span class="search-tip">搜索</span>
    </div>
    <el-dialog
      class="search-dialog"
      :fullscreen="isFullScreen"
      append-to-body
      modal
      v-model="searchModal"
      width="500px"
      align-center
    >
      <template #header>
        <el-input
          ref="searchInput"
          autofocus
          size="large"
          v-model="searchWords"
          class="w-50 m-2"
          placeholder="Search Docs"
          :prefix-icon="Search"
        />
      </template>
      <el-empty v-if="!searchResult.length" description="No Result" />
      <ul v-else>
        <span>共：{{ searchResult.length }}个搜索结果</span>
        <el-button
          v-if="showNextResult"
          type="primary"
          size="small"
          class="nextPage"
          @click="handleNext"
        >
          换一组</el-button
        >
        <li v-for="item in showSearchResult" :key="item.route">
          <el-card body-style="padding:10px;" shadow="hover">
            <a :href="`/${item.route}`" @click="searchModal = false">
              <div class="title">
                <span>{{ item.meta.title }}</span>
                <span class="date">
                  {{ formatDate(item.meta.date, 'yyyy-MM-dd') }}</span
                >
              </div>
              <div class="des">
                {{ item.meta.description }}
              </div>
            </a>
          </el-card>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import {
  ElInput,
  ElEmpty,
  ElIcon,
  ElDialog,
  InputInstance,
  ElCard,
  ElButton
} from 'element-plus'
import { useWindowSize } from '@vueuse/core'
import { formatDate } from '../utils'
import { useConfig } from '../composables/config/blog'

const searchModal = ref(false)

const { width } = useWindowSize()
const isFullScreen = computed(() => width.value < 500)

const searchWords = ref('')
const searchInput = ref<InputInstance>()
watch(
  () => searchModal.value,
  () => {
    if (searchModal.value) {
      setTimeout(() => {
        searchInput.value?.focus()
      })
    }
  }
)

const blogConfig = useConfig()
const docs = computed(() => blogConfig.config.pagesData)

const searchResult = computed(() => {
  if (!searchWords.value) return []
  const result = docs.value.filter((v) =>
    `${v.meta.description}${v.meta.title}`.includes(searchWords.value)
  )
  result.sort((a, b) => {
    return +new Date(b.meta.date) - +new Date(a.meta.date)
  })
  return result
})
const pageSize = ref(6)
const currentPage = ref(0)
const showSearchResult = computed(() => {
  // 合法性处理
  const pageIdx =
    currentPage.value % Math.ceil(searchResult.value.length / pageSize.value)
  const startIdx = pageIdx * pageSize.value
  return searchResult.value.slice(startIdx, startIdx + pageSize.value)
})
const showNextResult = computed(
  () => searchResult.value.length > pageSize.value
)
const handleNext = () => {
  currentPage.value =
    (currentPage.value + 1) %
    Math.ceil(searchResult.value.length / pageSize.value)
}
</script>

<style lang="scss" scoped>
.blog-search {
  flex: 1;
  margin-left: 10px;

  .nav-search-btn-wait {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    box-sizing: border-box;
    width: 100px;

    &:hover {
      border: 2px solid #409eff;
      border-radius: 20px;
    }

    .search-tip {
      color: #909399;
      font-size: 14px;
      padding-left: 10px;
    }
  }
}
</style>

<style lang="scss">
.search-dialog {
  .el-empty {
    padding: 0;
  }

  .el-empty__image {
    width: 100px;
  }
  ul {
    position: relative;
  }
  li {
    margin-bottom: 10px;
    font-size: 12px;
  }

  li .title {
    display: flex;
    justify-content: space-between;
  }

  li .des {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    color: var(--el-color-info-dark-2);
  }

  li .date {
    color: var(--el-color-info-light-3);
    min-width: 80px;
  }

  .nextPage {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -30px;
  }
}
</style>
