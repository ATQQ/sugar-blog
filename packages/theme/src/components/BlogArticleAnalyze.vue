<script lang="ts" setup>
// 阅读时间计算方式参考
// https://zhuanlan.zhihu.com/p/36375802
import { useData, useRoute } from 'vitepress'
import { computed, onMounted, ref, watch } from 'vue'
import { ElIcon } from 'element-plus'
import {
  AlarmClock,
  Clock,
  CollectionTag,
  EditPen,
  UserFilled
} from '@element-plus/icons-vue'
import { useBlogConfig, useCurrentArticle, useDocMetaInsertPosition, useDocMetaInsertSelector } from '../composables/config/blog'
import countWord, { formatDate, formatShowDate } from '../utils/client'
import type { Theme } from '../composables/config'
import BlogDocCover from './BlogDocCover.vue'

const { article, authorList } = useBlogConfig()
const readingTimePosition = article?.readingTimePosition || 'inline'

const { frontmatter } = useData()
const tags = computed(() => {
  const { tag, tags, categories } = frontmatter.value
  return [
    ...new Set(
      []
        .concat(tag, tags, categories)
        .flat()
        .filter(v => !!v)
    )
  ]
})
const showAnalyze = computed(
  () => frontmatter.value?.readingTime ?? article?.readingTime ?? true
)

const wordCount = ref(0)
const imageCount = ref(0)
const wordTime = computed(() => {
  return ~~((wordCount.value / 275) * 60)
})

const imageTime = computed(() => {
  const n = imageCount.value
  if (imageCount.value <= 10) {
    // 等差数列求和
    return n * 13 + (n * (n - 1)) / 2
  }
  return 175 + (n - 10) * 3
})

const readTime = computed(() => {
  return Math.ceil((wordTime.value + imageTime.value) / 60)
})

const docMetaInsertSelector = useDocMetaInsertSelector()
const docMetaInsertPosition = useDocMetaInsertPosition()

const route = useRoute()
const $des = ref<HTMLDivElement>()

function analyze() {
  if (!$des.value) {
    return
  }
  document.querySelectorAll('.meta-des').forEach(v => v.remove())
  const docDomContainer = window.document.querySelector('#VPContent')
  const imgs = docDomContainer?.querySelectorAll<HTMLImageElement>(
    '.content-container .main img'
  )
  imageCount.value = imgs?.length || 0

  const words
    = docDomContainer?.querySelector('.content-container .main')?.textContent
    || ''

  wordCount.value = countWord(words)

  let el = docDomContainer?.querySelector(docMetaInsertSelector.value)
  if (!el) {
    el = docDomContainer?.querySelector('h1')
  }
  el?.[docMetaInsertPosition.value]?.($des.value!)
}

onMounted(() => {
  const observer = new MutationObserver(() => {
    const targetInstance = document.querySelector('#hack-article-des')
    if (!targetInstance) {
      analyze()
    }
  })
  observer.observe(document.body, {
    childList: true, // 观察目标子节点的变化，是否有添加或者删除
    subtree: true // 观察后代节点，默认为 false
  })

  // 初始化时执行一次
  analyze()
})

// 阅读量
const pv = ref(6666)

const currentArticle = useCurrentArticle()
const publishDate = computed(() => {
  return formatShowDate(currentArticle.value?.meta?.date || '')
})

const hoverDate = computed(() => {
  return currentArticle.value?.meta?.date ? `: ${formatDate(currentArticle.value?.meta?.date)}` : ''
})

const timeTitle = computed(() =>
  frontmatter.value.date ? '发布时间' : '最近修改时间'
)
const hiddenTime = computed(() => frontmatter.value.date === false)

const { theme } = useData<Theme.Config>()
const globalAuthor = computed(() => theme.value.blog?.author || '')
const author = computed(
  () =>
    (frontmatter.value.author || currentArticle.value?.meta.author)
    ?? globalAuthor.value
)
const currentAuthorInfo = computed(() =>
  authorList?.find(v => author.value === v.nickname)
)
const hiddenAuthor = computed(() => frontmatter.value.author === false)

watch(
  () => route.path,
  () => {
    // TODO: 调用接口取数据
    pv.value = 123
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div v-if="showAnalyze && readingTimePosition === 'top'" class="doc-analyze" data-pagefind-ignore="all">
    <span>
      <ElIcon><EditPen /></ElIcon>
      字数：{{ wordCount }} 个字
    </span>
    <span>
      <ElIcon><AlarmClock /></ElIcon>
      预计：{{ readTime }} 分钟
    </span>
  </div>
  <div id="hack-article-des" ref="$des" class="meta-des">
    <!-- TODO：是否需要原创？转载等标签，理论上可以添加标签解决，可以参考 charles7c -->
    <span v-if="author && !hiddenAuthor" class="author" title="本文作者">
      <ElIcon><UserFilled /></ElIcon>
      <a
        v-if="currentAuthorInfo"
        class="link"
        :href="currentAuthorInfo.url"
        :title="currentAuthorInfo.des"
      >
        {{ currentAuthorInfo.nickname }}
      </a>
      <template v-else>
        {{ author }}
      </template>
    </span>
    <span v-if="publishDate && !hiddenTime" class="publishDate" :title="timeTitle + hoverDate">
      <ElIcon><Clock /></ElIcon>
      {{ publishDate }}
    </span>
    <span v-if="tags.length" class="tags" title="标签">
      <ElIcon><CollectionTag /></ElIcon>
      <a v-for="tag in tags" :key="tag" class="link" :href="`/?tag=${tag}`">{{ tag }}
      </a>
    </span>
    <template v-if="readingTimePosition === 'inline' && showAnalyze">
      <span title="文章字数">
        <ElIcon><EditPen /></ElIcon>
        {{ wordCount }} 个字
      </span>
      <span title="预计阅读时间">
        <ElIcon><AlarmClock /></ElIcon>
        {{ readTime }} 分钟
      </span>
    </template>
    <template v-if="readingTimePosition === 'newLine' && showAnalyze">
      <div style="width: 100%;" class="new-line-meta-des">
        <span title="文章字数">
          <ElIcon><EditPen /></ElIcon>
          {{ wordCount }} 个字
        </span>
        <span title="预计阅读时间">
          <ElIcon><AlarmClock /></ElIcon>
          {{ readTime }} 分钟
        </span>
      </div>
    </template>
    <!-- 封面展示 -->
    <ClientOnly>
      <BlogDocCover />
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.doc-analyze {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  span {
    margin-right: 16px;
    display: flex;
    align-items: center;
    .el-icon {
      margin-right: 4px;
    }
  }
}
.meta-des,.new-line-meta-des {
  text-align: left;
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  >span {
    margin-right: 16px;
    display: flex;
    align-items: center;
    .el-icon {
      margin-right: 4px;
    }
  }

  .link {
    color: var(--vp-c-text-2);
    &:hover {
      color: var(--vp-c-brand-1);
      cursor: pointer;
    }
  }
}
.tags {
  a.link:not(:last-child) {
    &::after {
      content: '·';
      display: inline-block;
      padding: 0 4px;
    }
  }
}
</style>
