<script lang="ts" setup>
import { ref } from 'vue'
import data from './config'

const pageSize = ref(6)
</script>

<template>
  <div>
    <!-- TODO: 随机大屏展示 -->
    <!-- 列表 -->
    <div class="example-list">
      <!-- 卡片 -->
      <div v-for="(d) in data" :key="d.blog.link" class="example-card">
        <div class="blog-info">
          <div class="cover-content">
            <!-- 封面 -->
            <img :src="d.blog.cover" alt="cover">
            <!-- 博客介绍，hover 展示 -->
            <div class="blog-info-content">
              <h3 v-if="d.blog.name">
                {{ d.blog.name }}
              </h3>
              <p>{{ d.blog.desc }}</p>
              <!-- 外链打开 -->
              <i><a target="_blank" :href="d.blog.link">Go！</a></i>
            </div>
          </div>
          <!-- 作者信息 -->
          <div v-if="d.author" class="author-content">
            <!-- 头像 -->
            <img v-if="d.author?.avatar" :src="d.author?.avatar" :alt="d.author.name">
            <!-- 作者名 -->
            <a target="_blank" :href="d.author.link || d.blog.link">{{ d.author.name }}</a>
          </div>
        </div>
      </div>
    </div>
    <!-- 翻页 -->
  </div>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
