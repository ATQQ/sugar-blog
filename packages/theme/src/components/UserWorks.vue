<script lang="ts" setup>
import { ElCarousel, ElCarouselItem, ElImage, ElMessage } from 'element-plus'
import VPDocAsideOutline from 'vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue'
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { slugify } from '@mdit-vue/shared'
import { useWindowSize } from '@vueuse/core'
import {
  formatDate,
  getGithubDirUpdateTime,
  getGithubUpdateTime
} from '../utils/client'
import {
  useActiveAnchor,
  useAutoUpdateAnchor,
  useUserWorks
} from '../composables/config/blog'
import type { Theme } from '../composables/config'

const currentAnchor = useAutoUpdateAnchor()
// 更新锚点的时候更新 url 中的 hash
watch(
  () => currentAnchor.id,
  (val) => {
    if (val) {
      window.history.replaceState(null, '', `#${val}`)
    }
  }
)
const mountActiveAnchorEl = useActiveAnchor()
watch(mountActiveAnchorEl, () => {
  const { value } = mountActiveAnchorEl
  if (value) {
    value.scroll({
      behavior: 'smooth'
    })
  }
})

const works = useUserWorks()
const workList = reactive<
(Theme.UserWork & {
  year?: string | undefined
  startTime: string
  lastUpdate?: string
  endTime?: string
  covers?: string[]
  coverLayout?: string
})[]
  >([])

// 格式化数据
watch(
  works,
  (val) => {
    const sortDate = [...val.list].map((v) => {
      const { time } = v

      // 格式化时间
      const metaInfo
        = typeof time === 'string'
          ? {
              startTime: time,
              endTime: '',
              lastUpdate: ''
            }
          : {
              startTime: time.start,
              endTime: time.end,
              lastUpdate: time.lastupdate
            }

      // 格式化封面信息
      const covers: string[] = []
      let coverLayout = 'swiper'

      if (typeof v.cover === 'string') {
        covers.push(v.cover)
      }
      else if (Array.isArray(v.cover)) {
        covers.push(...v.cover)
      }
      else if (typeof v.cover === 'object') {
        covers.push(...v.cover.urls)
        coverLayout = v.cover.layout ?? coverLayout
      }
      return {
        ...v,
        ...metaInfo,
        covers,
        coverLayout
      }
    })
    // 过滤出置顶数据
    const topDate = sortDate.filter(v => v.top !== undefined)
    const normalDate = sortDate.filter(v => v.top === undefined)
    // 数据排序
    topDate.sort((a, b) => a.top! - b.top!)
    normalDate.sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime))
    if (topDate.length) {
      // @ts-expect-error
      topDate[0].year = works.value.topTitle ?? '置顶'
    }
    // 数据分组
    const groupDate = normalDate.reduce((prev, cur) => {
      const { startTime } = cur
      const year = new Date(startTime).getFullYear()
      const data = { ...cur }
      if (!prev[year]) {
        prev[year] = []
        // 第一项数据加上year属性
        // @ts-expect-error
        data.year = year
      }
      prev[year].push(data)
      return prev
    }, {} as Record<string, (Theme.UserWork & { year?: string; startTime: string })[]>)
    workList.push(...topDate, ...Object.values(groupDate).reverse().flat())
  },
  { immediate: true }
)

const init = ref(true)
// 更新时间信息
watchEffect(() => {
  if (workList.length && init.value) {
    init.value = false
    workList.forEach((data) => {
      // 接口获取最后更新时间
      if (!data.lastUpdate && data.github) {
        data.lastUpdate = '获取中...'
        const { github } = data
        if (typeof github === 'string') {
          getGithubUpdateTime(github)
            .then((time) => {
              data.lastUpdate = formatDate(time, 'yyyy-MM-dd')
            })
            .catch(() => {
              data.lastUpdate = '地址解析失败'
            })
        }
        else {
          const { owner, repo, path, branch } = github
          // 拼接Github链接
          let githubUrl = `https://github.com/${owner}/${repo}`
          if (path) {
            githubUrl += `/tree/${branch || 'master'}/${path}`
          }
          else if (branch) {
            githubUrl += `/tree/${branch}`
          }
          data.github = githubUrl
          getGithubDirUpdateTime(owner, repo, path ?? '', branch)
            .then((time) => {
              data.lastUpdate = formatDate(time, 'yyyy-MM-dd')
            })
            .catch(() => {
              data.lastUpdate = '地址解析失败'
            })
        }
      }
    })
  }
})

const { width } = useWindowSize()
const isCardMode = computed(() => width.value > 768)
function handleChooseTag(tag: string) {
  ElMessage({
    message: `点击了${tag}标签，标签过滤功能开发中ing...`,
    type: 'warning'
  })
}
</script>

<template>
  <div class="user-works-page VPDoc">
    <div class="aside-container">
      <!-- TODO:过滤，可吸顶 -->
      <div class="filter">
        <!-- 时间： -->
        <div />
        <!-- TODO: tags -->
        <div />
      </div>
    </div>
    <!-- 作品列表 -->
    <div class="works">
      <h1>{{ works.title }}</h1>
      <p v-if="works.description" class="description">
        {{ works.description }}
      </p>
      <!-- 标题，描述信息，时间，线上链接，代码仓库，示例图片（几张，多种展示样式支持） -->
      <div v-for="(work, idx) in workList" :key="idx" class="work">
        <!-- 大日期标题 -->
        <h2 v-if="work.year" :id="`work_${work.year}`">
          <a :href="`#work_${work.year}`">{{ work.year }}</a>
        </h2>
        <!-- 作品标题 -->
        <h3 :id="slugify(work.title)" class="title">
          <a class="pin" :href="`#${slugify(work.title)}`" />
          <a v-if="work.url" rel="noopener" target="_blank" :href="work.url">{{
            work.title
          }}</a>
          <span v-else>{{ work.title }}</span>
          <Badge v-if="work.status" :type="work.status?.type || 'tip'">
            {{
              work.status.text
            }}
          </Badge>
        </h3>
        <!-- 补充信息 -->
        <div class="info">
          <!-- times -->
          <div class="times">
            <span class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <title>上线时间</title>
                <path
                  d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm-.22-13h-.06c-.4 0-.72.32-.72.72v4.72c0 .35.18.68.49.86l4.15 2.49c.34.2.78.1.98-.24a.71.71 0 0 0-.25-.99l-3.87-2.3V7.72c0-.4-.32-.72-.72-.72z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span>{{ work.startTime }}</span>
            <span v-if="work.endTime"> - {{ work.endTime }}</span>
          </div>
          <!-- GitHub links -->
          <div v-if="work.github" class="links">
            <a
              v-if="work.github"
              class="github-link"
              :href="work.github as string"
              target="_blank"
              rel="noopener"
            >
              <i class="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 496 512"
                >
                  <path
                    d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9c1.6 2.3 4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2z"
                    fill="currentColor"
                  />
                </svg>
              </i>
              <span v-if="work.lastUpdate" class="lastupdate">最后更新时间：{{ work.lastUpdate }}</span>
            </a>
          </div>
          <!-- 其它自定义链接 -->
          <div v-if="work.links?.length" class="links">
            <i v-if="work.links?.length" class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M10 14a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-.5.5"
                  />
                  <path
                    d="M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l.5-.5"
                  />
                </g>
              </svg>
            </i>
            <a
              v-for="link in work.links || []"
              :key="link.url"
              class="link"
              :href="link.url"
              :title="link.title"
              target="_blank"
              rel="noopener"
            >
              {{ link.title }}
            </a>
          </div>
          <!-- tags -->
          <div v-if="work.tags?.length" class="tags">
            <i class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                data-v-d328c40a=""
              >
                <path
                  fill="currentColor"
                  d="M256 128v698.88l196.032-156.864a96 96 0 0 1 119.936 0L768 826.816V128H256zm-32-64h576a32 32 0 0 1 32 32v797.44a32 32 0 0 1-51.968 24.96L531.968 720a32 32 0 0 0-39.936 0L243.968 918.4A32 32 0 0 1 192 893.44V96a32 32 0 0 1 32-32z"
                />
              </svg>
            </i>
            <span
              v-for="tag in work.tags"
              :key="tag"
              class="tag"
              @click="handleChooseTag(tag)"
            >{{ tag }}
            </span>
          </div>
        </div>
        <!-- 封面图 -->
        <div v-if="work.covers?.length" class="images">
          <!-- swiper -->
          <div v-if="work.coverLayout === 'swiper'" class="swiper-mode">
            <ElCarousel
              autoplay
              height="260px"
              :type="isCardMode && work.covers.length >= 3 ? 'card' : ''"
            >
              <ElCarouselItem
                v-for="(url, idx) in work.covers"
                :key="url"
                style="text-align: center"
              >
                <ElImage
                  :key="url"
                  preview-teleported
                  :src="url"
                  loading="lazy"
                  :preview-src-list="work.covers"
                  :initial-index="idx"
                  hide-on-click-modal
                  :alt="`${work.title}-${idx}`"
                />
              </ElCarouselItem>
            </ElCarousel>
          </div>
          <!-- list -->
          <div v-if="work.coverLayout === 'list'" class="list-mode">
            <ElImage
              v-for="(url, idx) in work.covers"
              :key="url"
              :src="url"
              loading="lazy"
              :preview-src-list="work.covers"
              :initial-index="idx"
              hide-on-click-modal
            />
          </div>
        </div>
        <div class="description" v-html="work.description" />
      </div>
    </div>
    <div class="aside-container">
      <div class="aside-outline-container">
        <VPDocAsideOutline />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-works-page {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 20px auto;
  padding: 16px;
  h1 {
    font-size: 32px;
    font-weight: bold;
  }
  .description {
    margin-top: 16px;
    color: #999;
    font-size: 16px;
  }
  a {
    font-weight: 500;
    color: var(--vp-c-brand-1);
  }
}
.works-container {
  display: flex;
  justify-content: center;
}
.work {
  max-width: 900px;

  h2 {
    margin-top: 6px;
    padding-top: 18px;
    line-height: 32px;
    font-size: 24px;
    border-top: 1px solid var(--vp-c-divider);
    a {
      color: inherit;
    }
    &:hover {
      a {
        &::before {
          opacity: 1;
        }
      }
    }
    a {
      position: relative;
      &::before {
        position: absolute;
        left: -16px;
        opacity: 0;
        content: var(--vp-header-anchor-symbol);
      }
    }
  }
  h3 {
    margin: 32px 0 0;
    line-height: 28px;
    font-size: 20px;
    position: relative;
    &.title > a.pin {
      position: absolute;
      left: -16px;
      &::before {
        left: -16px;
        opacity: 0;
        content: var(--vp-header-anchor-symbol);
      }
    }
    &:hover > a.pin {
      &::before {
        opacity: 1;
      }
    }
  }
  .info {
    display: flex;
    font-size: 14px;
    margin-top: 10px;
    flex-wrap: wrap;
  }
  .links,
  .times,
  .tags {
    display: flex;
    align-items: center;
    .icon {
      color: var(--vp-c-text-1);
      display: block;
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
  }
  .times {
    margin-right: 18px;
  }
  .links {
    a {
      display: flex;
      align-items: center;
    }
    a.github-link {
      margin-right: 10px;
    }
    a.link {
      margin-right: 0;
      &::after {
        content: ',';
        color: var(--vp-c-text-1);
        margin-right: 6px;
        margin-left: 2px;
      }
      &:last-child::after {
        content: '';
      }
    }
  }
  .tags {
    span.tag {
      cursor: pointer;
    }
    span.tag:not(:last-child) {
      &::after {
        content: '·';
        display: inline-block;
        padding: 0 4px;
      }
    }
  }
}
.aside-container {
  display: none;
  flex: 1;
  padding-left: 32px;
  width: 100%;
  max-width: 256px;
}
@media screen and (min-width: 960px) {
  .aside-container {
    display: block;
  }
}
.aside-outline-container {
  position: sticky;
  top: calc(
    var(--vp-nav-height) + var(--vp-layout-top-height, 0px) +
      var(--vp-doc-top-height, 0px) + 32px
  );
}
.lastupdate {
  color: var(--vp-c-text-1);
}

.list-mode {
  max-height: 370px;
  overflow-y: auto;
  margin: 10px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .el-image {
    :deep(img) {
      object-fit: contain;
      // max-height: 360px;
    }
  }
}

.swiper-mode {
  margin-top: 16px;
  .el-image {
    :deep(img) {
      object-fit: contain;
      max-height: 260px;
    }
  }
}
.split {
  display: inline-block;
  width: 1px;
  height: 8px;
  margin: 0 10px;
  background-color: #4e5969;
}
</style>
