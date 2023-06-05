<template>
  <div class="user-works-page">
    <h1>个人的一些项目/线上作品</h1>
    <p class="description">描述信息</p>
    <!-- TODO：侧导筛选时间 -->
    <!-- 过滤，可吸顶 -->
    <div class="filter">
      <!-- 时间： -->
      <div></div>
      <!-- TODO: tags -->
      <div></div>
    </div>
    <!-- 作品列表 -->
    <div class="works">
      <!-- 标题，描述信息，时间，线上链接，代码仓库，示例图片（几张，多种展示样式支持） -->
      <div class="work" v-for="(work, idx) in workList" :key="idx">
        <!-- 大日期标题 -->
        <!-- TODO: 支持锚点 -->
        <h2 v-if="work.year">{{ work.year }}</h2>
        <!-- 作品标题 -->
        <h3 class="title">
          <a v-if="work.url" rel="noopener" target="_blank" :href="work.url">{{
            work.title
          }}</a>
          <span v-else>{{ work.title }}</span>
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
                ></path>
              </svg>
            </span>
            <span>{{ work.time.start }}</span>
            <span v-if="work.time.end"> - {{ work.time.end }}</span>
          </div>
          <!-- GitHub links-->
          <div class="links" v-if="work.github">
            <a
              class="github-link"
              v-if="work.github"
              :href="work.github"
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
                  ></path>
                </svg>
              </i>
              <span class="lastupdate" v-if="work.time.lastupdate"
                >最后更新时间：{{ work.time.lastupdate }}</span
              >
            </a>
          </div>
          <!-- 其它链接 -->
          <div class="links" v-if="work.links?.length">
            <i class="icon" v-if="work.links?.length">
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
                  ></path>
                  <path
                    d="M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l.5-.5"
                  ></path>
                </g>
              </svg>
            </i>
            <a
              class="link"
              v-for="link in work.links || []"
              :href="link.url"
              :key="link.url"
              :title="link.title"
              target="_blank"
              rel="noopener"
            >
              {{ link.title }}
            </a>
          </div>
        </div>
        <!-- 封面图 -->
        <div class="images">
          <!-- swiper -->
          <!-- list -->
          <div class="list-mode">
            <el-image
              v-for="(url, idx) in covers"
              :key="url"
              :src="url"
              loading="lazy"
              :preview-src-list="covers"
              :initial-index="idx"
              hide-on-click-modal
            />
          </div>
          <!-- card -->
        </div>
        <!-- TODO：支持HTML复杂内容 -->
        <div class="description">很不错呀</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElImage } from 'element-plus'
import { reactive, watch, watchEffect } from 'vue'
import { getGithubUpdateTime, formatDate } from '../utils'
import { useUserWorks } from '../composables/config/blog'
import { Theme } from '../composables/config'

const works = useUserWorks()
const workList = reactive<
  (Theme.UserWork & {
    year?: string | undefined
  })[]
>([])

// 格式化数据
watch(
  works,
  (val) => {
    const sortDate = [...val]
    // 数据排序
    sortDate.sort((a, b) => +new Date(b.time.start) - +new Date(a.time.start))

    // 数据分组
    const groupDate = sortDate.reduce((prev, cur) => {
      const year = new Date(cur.time.start).getFullYear()
      const data = { ...cur }
      if (!prev[year]) {
        prev[year] = []
        // 第一项数据加上year属性
        // @ts-ignore
        data.year = year
      }
      prev[year].push(data)
      return prev
    }, {} as Record<string, (Theme.UserWork & { year?: string })[]>)
    workList.push(...Object.values(groupDate).reverse().flat())
  },
  { immediate: true }
)

// 更新时间信息
watchEffect(() => {
  if (workList.length) {
    workList.forEach((data) => {
      // 接口获取最后更新时间
      if (!data.time.lastupdate && data.github) {
        data.time.lastupdate = '获取中...'
        getGithubUpdateTime(data.github)
          .then((time) => {
            data.time = {
              ...data.time,
              lastupdate: formatDate(time, 'yyyy-MM-dd')
            }
          })
          .catch(() => {
            data.time.lastupdate = '地址解析失败'
          })
      }
    })
  }
})

const covers = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
]
</script>

<style lang="scss" scoped>
.user-works-page {
  max-width: 900px;
  margin: 20px auto;
  padding: 16px;
  h1 {
    font-size: 32px;
    font-weight: bold;
  }
  .description {
    margin-top: 10px;
    color: #999;
    font-size: 16px;
  }
  a {
    font-weight: 500;
    color: var(--vp-c-brand);
  }
}
.work {
  h2 {
    padding-top: 24px;
    line-height: 32px;
    font-size: 24px;
  }
  h3 {
    margin: 32px 0 0;
    line-height: 28px;
    font-size: 20px;
  }
  .info {
    display: flex;
    font-size: 14px;
    margin-top: 10px;
    flex-wrap: wrap;
  }
  .links,
  .times {
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
}
.lastupdate {
  color: var(--vp-c-text-1);
}
.list-mode {
  height: 360px;
  margin: 10px auto;
  overflow-y: auto;
}
.split {
  display: inline-block;
  width: 1px;
  height: 8px;
  margin: 0 10px;
  background-color: #4e5969;
}
</style>
