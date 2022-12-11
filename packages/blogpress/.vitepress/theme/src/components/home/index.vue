<script setup>
import Theme from 'vitepress/theme'
import HeroBanner from '../hero-banner/index.vue'
import BlogList from '../blog-list/index.vue'
import BlogInfo from '../blog-info/index.vue'
import Comment from '../comment.vue'

const { Layout } = Theme
</script>

<template>
  <Layout>
    <!-- 自定义首页 -->
    <template #home-hero-before>
      <div class="home">
        <div class="header-banner">
          <hero-banner />
        </div>
        <div class="content-wrapper">
          <div><blog-list /></div>
          <div class="blog-info-wrapper"><blog-info /></div>
        </div>
      </div>
    </template>
    <!-- 评论 -->
    <template #doc-after>
      <Comment />
    </template>
  </Layout>
</template>
<style scoped lang="scss">
.home {
  margin: 0 auto;
  padding: 20px;
  max-width: 1126px;
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
