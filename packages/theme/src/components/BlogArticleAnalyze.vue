<template>
  <div class="doc-analyze">
    <span>正文字数：{{ wordCount }} 个字</span>
    <!-- <span>图片数：{{ imageCount }}</span> -->
    <span>预计阅读：{{ readTime }} 分钟</span>
    <div class="meta-des" ref="$des">{{ publishDate }}</div>
    <!-- <div class="meta-des" ref="$des">{{ publishDate }} · 阅读 {{ pv }}</div> -->
  </div>
</template>

<script lang="ts" setup>
// 阅读时间计算方式参考
// https://zhuanlan.zhihu.com/p/36375802
import { useData, useRoute } from 'vitepress'
import { computed, ref, watch } from 'vue'
import { formatShowDate } from '../utils/index'

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

const route = useRoute()
const $des = ref<HTMLDivElement>()

const analyze = () => {
  if (!$des.value) {
    return
  }
  const docDomContainer = window.document.querySelector('#VPContent')
  const imgs = docDomContainer?.querySelectorAll<HTMLImageElement>(
    '.content-container .main img'
  )
  imageCount.value = imgs?.length || 0

  const words = docDomContainer?.textContent || ''
  wordCount.value = words.length
  docDomContainer?.querySelector('h1')?.after($des.value!)
}

watch(
  () => route.path,
  () => {
    setTimeout(analyze)
  },
  {
    immediate: true
  }
)

// 阅读量
const pv = ref(6666)
const docMeta = useData()

const publishDate = computed(() => {
  return formatShowDate(docMeta.frontmatter.value.date)
})

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

<style lang="scss" scoped>
.doc-analyze {
  color: var(--vp-c-text-3);
  text-align: center;
  margin-bottom: 20px;
  span {
    margin: 0 10px;
  }
}
.meta-des {
  text-align: left;
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-top: 6px;
}
</style>
