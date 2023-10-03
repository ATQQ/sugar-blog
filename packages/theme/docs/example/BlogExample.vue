<script lang="ts" setup>
import { VPTeamMembers } from 'vitepress/theme'
import { ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import data from './config'

const randomIdx = ref(random())
useIntervalFn(() => {
  randomIdx.value = random()
}, 1000)
function random() {
  return Math.floor(Math.random() * data.length)
}

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
            <img src="https://img.cdn.sugarat.top/mdImg/MTY3MzE3MDUxOTMwMw==673170519303" alt="cover">
            <!-- 博客介绍，hover 展示 -->
            <div class="blog-info-content">
              <h3>标题</h3>
              <p>描述</p>
              <!-- 外链打开 -->
              <i><a target="_blank" href="">Go！</a></i>
            </div>
          </div>
          <!-- 作者信息 -->
          <div v-if="d.author" class="author-content">
            <!-- 头像 -->
            <img v-if="d.author?.avatar" :src="d.author?.avatar" :alt="d.author.name">
            <!-- 作者名 -->
            <label class="author-name">{{ d.author.name }}
              <input hidden type="checkbox">
            </label>
          </div>
          <!-- active 展示详情 -->
          <div v-if="d.members.length" class="user-content">
            <VPTeamMembers size="small" :members="d.members" />
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
