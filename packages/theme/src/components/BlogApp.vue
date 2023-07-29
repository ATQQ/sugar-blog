<script setup lang="ts" name="BlogApp">
import Theme from 'vitepress/theme'
import BlogHomeInfo from './BlogHomeInfo.vue'
import BlogHomeBanner from './BlogHomeBanner.vue'
import BlogList from './BlogList.vue'
import BlogComment from './BlogComment.vue'
import BlogSearch from './BlogSearch.vue'
import BlogSidebar from './BlogSidebar.vue'
import BlogImagePreview from './BlogImagePreview.vue'
import BlogArticleAnalyze from './BlogArticleAnalyze.vue'
import BlogAlert from './BlogAlert.vue'
import BlogPopover from './BlogPopover.vue'
import { useBlogThemeMode } from '../composables/config/blog'

const isBlogTheme = useBlogThemeMode()
const { Layout } = Theme
</script>

<template>
  <Layout>
    <template #layout-top>
      <BlogAlert />
      <BlogPopover />
    </template>

    <template #doc-before>
      <!-- 阅读时间分析 -->
      <ClientOnly>
        <BlogArticleAnalyze />
      </ClientOnly>
      <!-- 图片预览 -->
      <BlogImagePreview />
    </template>

    <!-- 自定义搜索，替代Algolia，未来择机移除 -->
    <template #nav-bar-content-before>
      <BlogSearch />
    </template>
    <!-- 自定义首页 -->
    <template #home-hero-before v-if="isBlogTheme">
      <div class="home">
        <div class="header-banner">
          <BlogHomeBanner />
        </div>
        <div class="content-wrapper">
          <div class="blog-list-wrapper">
            <BlogList />
          </div>
          <div class="blog-info-wrapper"><BlogHomeInfo /></div>
        </div>
      </div>
    </template>
    <template #sidebar-nav-after v-if="isBlogTheme">
      <BlogSidebar />
    </template>
    <!-- 评论 -->
    <template #doc-after>
      <BlogComment />
    </template>
  </Layout>
</template>
<style scoped lang="scss">
.home {
  margin: 0 auto;
  padding: 20px;
  max-width: 1126px;
}

@media screen and (min-width: 960px) {
  .home {
    padding-top: var(--vp-nav-height);
  }
}

.header-banner {
  width: 100%;
  padding: 60px 0;
}

.content-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.blog-list-wrapper {
  width: 100%;
}
.blog-info-wrapper {
  margin-left: 16px;
  position: sticky;
  top: 100px;
}

@media screen and (max-width: 959px) {
  .blog-info-wrapper {
    margin-left: 16px;
    position: sticky;
    top: 40px;
  }
}

@media screen and (max-width: 767px) {
  .content-wrapper {
    flex-wrap: wrap;
  }

  .blog-info-wrapper {
    margin: 20px 0;
    width: 100%;
  }
}
</style>
