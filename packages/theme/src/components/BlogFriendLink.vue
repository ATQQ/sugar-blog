<script lang="ts" setup>
import { useDark, useIntervalFn } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useFriendData } from '../composables/config/blog'
import { getImageUrl, shuffleArray } from '../utils/client'
import type { Theme } from '../'
import { friendLinkSvgStr } from '../constants/svg'
import Avatar from './Avatar.vue'

type FriendListItem = Theme.FriendLink & {
  avatar: string
  alt: string
}

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance'
})

const friendData = useFriendData()
const friendConfig = computed<Theme.FriendConfig>(() => ({
  list: [],
  random: false,
  limit: Number.MAX_SAFE_INTEGER,
  title: `${friendLinkSvgStr}友情链接`,
  ...(Array.isArray(friendData.value) ? { list: friendData.value } : friendData.value)
}))

const limit = computed(() => {
  const { limit } = friendConfig.value
  return (!limit || limit <= 0) ? 0 : limit || Number.MAX_SAFE_INTEGER
})

const scrollSpeed = computed(() => {
  const { scrollSpeed } = friendConfig.value
  return scrollSpeed ?? 1500
})

const openScroll = computed(() => {
  return scrollSpeed.value > 0 && limit.value < friendConfig.value.list.length
})

const isMounted = ref(false)
const randomFriendList = ref<Theme.FriendLink[]>([])
const currentIndex = ref(0)
const isTransitioning = ref(false)
const isPageVisible = ref(true)
const isImageDark = computed(() => isMounted.value && isDark.value)

function refreshRandomFriendList() {
  currentIndex.value = 0
  isTransitioning.value = false
  randomFriendList.value = friendConfig.value.random
    ? shuffleArray(friendConfig.value.list)
    : []
}

const friendList = computed<FriendListItem[]>(() => {
  const source = isMounted.value && friendConfig.value.random
    ? randomFriendList.value
    : friendConfig.value.list
  const data = [...source]

  // 展示个数限制，删除多余的
  if (scrollSpeed.value === 0 && limit.value) {
    data.splice(limit.value)
  }
  const list = data.map((v) => {
    const { avatar, nickname } = v
    const avatarUrl = getImageUrl(avatar, isImageDark.value)
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
  return list
})

const cardHeight = 76
const scrollWrapperHeight = computed(() => {
  return openScroll.value ? limit.value * cardHeight : 0
})
const containerHeight = computed(() => {
  return scrollWrapperHeight.value ? `${scrollWrapperHeight.value}px` : 'auto'
})

const displayList = computed(() => {
  if (openScroll.value) {
    return [...friendList.value, ...friendList.value.slice(0, limit.value)]
  }
  return friendList.value
})

const listStyle = computed(() => {
  const translate = -1 * currentIndex.value * cardHeight
  return {
    transform: `translateY(${translate}px)`,
    transition: isTransitioning.value ? 'transform 0.5s ease-in-out' : 'none'
  }
})

function resetScrollState() {
  currentIndex.value = 0
  isTransitioning.value = false
}

function getFriendKey(item: FriendListItem, idx: number) {
  const key = `${item.url}-${item.nickname}`
  const cloneIndex = idx - friendList.value.length
  return cloneIndex >= 0 ? `${key}-clone-${cloneIndex}` : key
}

const { resume, pause } = useIntervalFn(() => {
  if (!openScroll.value)
    return

  currentIndex.value++
  isTransitioning.value = true

  if (currentIndex.value === friendList.value.length) {
    setTimeout(() => {
      isTransitioning.value = false
      currentIndex.value = 0
    }, 500)
  }
}, scrollSpeed, {
  immediate: false
})

function syncScrollState() {
  if (openScroll.value && isPageVisible.value) {
    resume()
  }
  else {
    pause()
  }

  if (!openScroll.value) {
    resetScrollState()
  }
}

function handleVisibilityChange() {
  isPageVisible.value = !document.hidden
  syncScrollState()
}

watch(openScroll, syncScrollState)

watch(() => [friendConfig.value.list, friendConfig.value.random], () => {
  if (isMounted.value) {
    refreshRandomFriendList()
  }
}, {
  deep: true
})

onMounted(() => {
  isMounted.value = true
  isPageVisible.value = !document.hidden
  refreshRandomFriendList()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  syncScrollState()
})

onUnmounted(() => {
  pause()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div v-if="friendList?.length" class="card friend-wrapper">
    <!-- 头部 -->
    <div class="card-header">
      <span class="title svg-icon" v-html="friendConfig.title" />
    </div>
    <!-- 友链列表 -->
    <div
      class="scroll-wrapper" :style="{
        height: containerHeight,
      }"
    >
      <ol class="friend-list" :style="listStyle">
        <li v-for="(v, idx) in displayList" :key="getFriendKey(v, idx)" class="scroll-item">
          <a :href="v.url" target="_blank">
            <Avatar :size="50" :src="v.avatar" :alt="v.alt" />
            <div class="info-wrapper">
              <span class="nickname">{{ v.nickname }}</span>
              <p class="des">{{ v.des }}</p>
            </div>
          </a>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
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
}
.card:hover {
  box-shadow: var(--box-shadow-hover);
}

.card-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.card-header .title {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.friend-wrapper {
  flex-direction: column;
}

.scroll-wrapper {
  overflow: hidden;
  position: relative;
}

.friend-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 10px 10px 0 0px;
  width: 100%;
  position: relative;
  width: 100%;
}
.friend-list li {
  box-sizing: border-box;
  padding: 0 5px;
  height: 76px;
  cursor: pointer;
}
.friend-list li a {
  display: flex;
  align-items: center;
}
.friend-list li div {
  padding-left: 10px;
}
.friend-list li .info-wrapper {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.friend-list li .nickname {
  font-size: 16px;
  font-weight: 450;
}
.friend-list li .des {
  color: var(--vp-c-text-2);
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
