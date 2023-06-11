<template>
  <div class="card friend-wrapper" v-if="friendList?.length">
    <!-- 头部 -->
    <div class="card-header">
      <span class="title">🤝 友情链接</span>
    </div>
    <!-- 文章列表 -->
    <ol class="friend-list">
      <li v-for="v in friendList" :key="v.nickname">
        <a :href="v.url" target="_blank">
          <el-avatar :size="50" :src="v.avatar" :alt="v.alt" />
          <div>
            <span class="nickname">{{ v.nickname }}</span>
            <p class="des">{{ v.des }}</p>
          </div>
        </a>
      </li>
    </ol>
  </div>
</template>

<script lang="ts" setup>
import { ElAvatar } from 'element-plus'
import { useDark } from '@vueuse/core'
import { computed } from 'vue'
import { useBlogConfig } from '../composables/config/blog'
import { getImageUrl } from '../utils'

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance'
})

const { friend } = useBlogConfig()
const friendList = computed(() => {
  return friend?.map((v) => {
    const { avatar, nickname } = v
    const avatarUrl = getImageUrl(avatar, isDark.value)
    let alt = nickname
    if (typeof avatar !== 'string') {
      alt = avatar.alt || ''
    }

    return {
      ...v,
      avatar: avatarUrl,
      alt
    }
  })
})
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  margin: 0 auto 10px;
  padding: 10px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition: all 0.3s;
  background-color: rgba(var(--bg-gradient));
  display: flex;

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
}

.card-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 12px;
  }
}

.friend-wrapper {
  flex-direction: column;
}

.friend-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0 10px 0 0px;
  width: 100%;

  li {
    padding: 6px;
    margin-top: 10px;
    .el-avatar {
      min-width: 50px;
    }
    a {
      display: flex;
    }
    div {
      padding-left: 10px;
    }
    .nickname {
      font-size: 16px;
      font-weight: 450;
    }

    .des {
      color: var(--vp-c-text-2);
      font-size: 14px;
    }
  }
}
</style>
