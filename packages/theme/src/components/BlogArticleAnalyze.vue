<script lang="ts" setup>
// 阅读时间计算方式参考
// https://zhuanlan.zhihu.com/p/36375802
import { useData } from 'vitepress'

// 移除外部依赖，图标内置
// import { ElIcon } from 'element-plus'
// import {
//   UserFilled
// } from '@element-plus/icons-vue'

import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useAnalyzeTitles, useArticleConfig, useAuthorList, useCurrentArticle, useDocMetaInsertPosition, useDocMetaInsertSelector, useFormatShowDate, useGlobalAuthor } from '../composables/config/blog'
import countWord, { formatDate } from '../utils/client'
import BlogDocCover from './BlogDocCover.vue'

function createIcon(d: string | string[]) {
  return defineComponent({
    render: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 1024 1024',
    }, [d].flatMap(d => h('path', { fill: 'currentColor', d })))
  })
}

const AlarmClock = createIcon(
  [
    'M512 832a320 320 0 1 0 0-640 320 320 0 0 0 0 640m0 64a384 384 0 1 1 0-768 384 384 0 0 1 0 768',
    'm292.288 824.576 55.424 32-48 83.136a32 32 0 1 1-55.424-32zm439.424 0-55.424 32 48 83.136a32 32 0 1 0 55.424-32zM512 512h160a32 32 0 1 1 0 64H480a32 32 0 0 1-32-32V320a32 32 0 0 1 64 0zM90.496 312.256A160 160 0 0 1 312.32 90.496l-46.848 46.848a96 96 0 0 0-128 128L90.56 312.256zm835.264 0A160 160 0 0 0 704 90.496l46.848 46.848a96 96 0 0 1 128 128z'
  ]
)

const Clock = createIcon([
  'M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896',
  'M480 256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32',
  'M480 512h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32'
])

const CollectionTag = createIcon(
  'M256 128v698.88l196.032-156.864a96 96 0 0 1 119.936 0L768 826.816V128zm-32-64h576a32 32 0 0 1 32 32v797.44a32 32 0 0 1-51.968 24.96L531.968 720a32 32 0 0 0-39.936 0L243.968 918.4A32 32 0 0 1 192 893.44V96a32 32 0 0 1 32-32'
)
const EditPen = createIcon(
  'm199.04 672.64 193.984 112 224-387.968-193.92-112-224 388.032zm-23.872 60.16 32.896 148.288 144.896-45.696zM455.04 229.248l193.92 112 56.704-98.112-193.984-112-56.64 98.112zM104.32 708.8l384-665.024 304.768 175.936L409.152 884.8h.064l-248.448 78.336zm384 254.272v-64h448v64h-448z'
)
const UserFilled = createIcon(
  'M288 320a224 224 0 1 0 448 0 224 224 0 1 0-448 0m544 608H160a32 32 0 0 1-32-32v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 0 1-32 32z'
)

const formatShowDate = useFormatShowDate()
const article = useArticleConfig()
const authorList = useAuthorList()
const readingTimePosition = computed(() => article?.value?.readingTimePosition || 'inline')

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
  () => frontmatter.value?.readingTime ?? article?.value?.readingTime ?? true
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

const currentArticle = useCurrentArticle()
const publishDate = computed(() => {
  return formatShowDate.value(currentArticle.value?.meta?.date || '')
})

const hoverDate = computed(() => {
  return currentArticle.value?.meta?.date ? `: ${formatDate(currentArticle.value?.meta?.date)}` : ''
})

const hiddenTime = computed(() => frontmatter.value.date === false)

const globalAuthor = useGlobalAuthor()
const author = computed(
  () =>
    (frontmatter.value.author || currentArticle.value?.meta.author)
    ?? globalAuthor.value
)
const currentAuthorInfo = computed(() =>
  authorList?.value?.find(v => author.value === v.nickname)
)
const hiddenAuthor = computed(() => frontmatter.value.author === false)

const { topWordCount, topReadTime, inlineWordCount, inlineReadTime, authorTitle, readTimeTitle, wordCountTitle, publishDateTitle, lastUpdatedTitle, tagTitle } = useAnalyzeTitles(wordCount, readTime)
const timeTitle = computed(() =>
  frontmatter.value.date ? publishDateTitle.value : lastUpdatedTitle.value
)
</script>

<template>
  <div v-if="showAnalyze && readingTimePosition === 'top'" class="doc-analyze" data-pagefind-ignore="all">
    <span>
      <i class="icon">
        <EditPen />
      </i>
      {{ topWordCount }}
    </span>
    <span>
      <i class="icon">
        <AlarmClock />
      </i>
      {{ topReadTime }}
    </span>
  </div>
  <div id="hack-article-des" ref="$des" class="meta-des">
    <!-- TODO：是否需要原创？转载等标签，理论上可以添加标签解决，可以参考 charles7c -->
    <span v-if="author && !hiddenAuthor" class="author" :title="authorTitle">
      <i class="icon">
        <UserFilled />
      </i>
      <a v-if="currentAuthorInfo" class="link" :href="currentAuthorInfo.url" :title="currentAuthorInfo.des">
        {{ currentAuthorInfo.nickname }}
      </a>
      <template v-else>
        {{ author }}
      </template>
    </span>
    <span v-if="publishDate && !hiddenTime" class="publishDate" :title="timeTitle + hoverDate">
      <i class="icon">
        <Clock />
      </i>
      {{ publishDate }}
    </span>
    <template v-if="readingTimePosition === 'inline' && showAnalyze">
      <span :title="wordCountTitle">
        <i class="icon">
          <EditPen />
        </i>
        {{ inlineWordCount }}
      </span>
      <span :title="readTimeTitle">
        <i class="icon">
          <AlarmClock />
        </i>
        {{ inlineReadTime }}
      </span>
    </template>
    <template v-if="readingTimePosition === 'newLine' && showAnalyze">
      <div style="width: 100%;" class="new-line-meta-des">
        <span :title="wordCountTitle">
          <i class="icon">
            <EditPen />
          </i>
          {{ inlineWordCount }}
        </span>
        <span :title="readTimeTitle">
          <i class="icon">
            <AlarmClock />
          </i>
          {{ inlineReadTime }}
        </span>
      </div>
    </template>
    <span v-if="tags.length" class="tags" :title="tagTitle">
      <i class="icon">
        <CollectionTag />
      </i>
      <a v-for="tag in tags" :key="tag" class="link" :href="`/?tag=${tag}`">{{ tag }}
      </a>
    </span>
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
  }
}

.meta-des,
.new-line-meta-des {
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
    flex-wrap: wrap;

    .icon {
      margin-right: 4px;
      --color: inherit;
      align-items: center;
      display: inline-flex;
      height: 1em;
      justify-content: center;
      line-height: 1em;
      position: relative;
      width: 1em;
      fill: currentColor;
      color: var(--color) inherit;
      font-size: inherit;
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
