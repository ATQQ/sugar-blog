<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue'
import { useData, useRoute, useRouter } from 'vitepress'
import type { Announcement, AnnouncementOptions } from 'vitepress-plugin-announcement'

// @ts-expect-error
import announcementOptions from 'virtual:announcement-options'
import AnnouncementButton from './AnnouncementButton.vue'
import AnnouncementIcon from './AnnouncementIcon.vue'
import { inBrowser, parseStringStyle, useDebounceFn, useWindowSize } from './util'

const { localeIndex } = useData()

const popoverProps = computed<AnnouncementOptions>(() => ({ ...announcementOptions, ...announcementOptions?.locales?.[localeIndex.value] }))

const show = ref((popoverProps.value?.duration ?? 0) >= 0)

const bodyContent = computed(() => {
  return popoverProps.value?.body || []
})

const footerContent = computed(() => {
  return popoverProps.value?.footer || []
})
const storageKey = computed(() => `vitepress-plugin-announcement-${localeIndex.value}`)
const closeFlag = computed(() => `${storageKey.value}-close`)

// 移动端最小化
const { width } = useWindowSize()
const router = useRouter()
const route = useRoute()
watch(popoverProps, () => {
  if (!popoverProps.value?.title) {
    return
  }

  if (!inBrowser) {
    return
  }

  // 取旧值
  const oldValue = localStorage.getItem(storageKey.value)
  const newValue = JSON.stringify(popoverProps.value)
  localStorage.setItem(storageKey.value, newValue)

  // 移动端最小化
  if (width.value < 768 && popoverProps.value?.mobileMinify) {
    show.value = false
    return
  }

  // >= 0 每次都展示，区别是否自动消失
  if (Number(popoverProps.value?.duration ?? '') >= 0) {
    show.value = true
    if (popoverProps.value?.duration) {
      setTimeout(() => {
        show.value = false
      }, popoverProps.value?.duration)
    }
    return
  }

  if (oldValue !== newValue && popoverProps.value?.duration === -1) {
    // 当做新值处理
    show.value = true
    localStorage.removeItem(closeFlag.value)
    return
  }

  // 新旧相等，判断是否点击过close，没点击关闭依然展示
  if (oldValue === newValue && popoverProps.value?.duration === -1 && !localStorage.getItem(closeFlag.value)) {
    show.value = true
  }
}, { immediate: true })

const onAfterRouteChanged = useDebounceFn(() => {
  popoverProps.value?.onRouteChanged?.(route, show)
}, 10)

watch(route, onAfterRouteChanged, { immediate: true })

function handleClose() {
  show.value = false
  if (popoverProps.value?.duration === -1) {
    localStorage.setItem(closeFlag.value, `${+new Date()}`)
  }
}

function PopoverValue(props: { key: number; item: Announcement.Value },
  { slots }: any) {
  const { key, item } = props
  if (item.type === 'title') {
    return h(
      'h4',
      {
        style: parseStringStyle(item.style || '')
      },
      item.content
    )
  }
  if (item.type === 'text') {
    return h(
      'p',
      {
        style: parseStringStyle(item.style || '')
      },
      item.content
    )
  }
  if (item.type === 'image') {
    return h('img', {
      src: item.src,
      style: parseStringStyle(item.style || '')
    })
  }
  if (item.type === 'button') {
    return h(
      AnnouncementButton,
      {
        type: 'primary',
        onClick: () => {
          if (/^\s*http(s)?:\/\//.test(item.link)) {
            window.open(item.link)
          }
          else {
            router.go(item.link)
          }
        },
        style: parseStringStyle(item.style || ''),
        ...item.props
      },
      slots
    )
  }
  return h(
    'div',
    {
      key
    },
    ''
  )
}

const showReopen = computed(() => {
  return !show.value && (popoverProps.value?.reopen ?? true) && !!popoverProps.value.title
})
</script>

<template>
  <div v-show="show" class="theme-blog-popover" data-pagefind-ignore="all">
    <div class="header">
      <div class="title-wrapper">
        <AnnouncementIcon size="20px" :icon="popoverProps.icon">
          <svg t="1716085184855" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4274" width="200" height="200"><path d="M660.48 872.448q6.144 0-3.584 15.36t-29.696 33.792-47.104 33.792-57.856 15.36q-27.648 0-53.248-15.36t-45.056-33.792-29.696-33.792-6.144-15.36l272.384 0zM914.432 785.408q7.168 9.216 6.656 17.92t-4.608 14.848-10.24 9.728-12.288 3.584l-747.52 0q-14.336 0-20.992-11.776t4.608-29.184q17.408-30.72 40.96-68.608t44.544-81.408 36.352-92.16 15.36-101.888q0-51.2 14.336-92.16t37.376-71.68 53.248-52.224 62.976-32.768q-16.384-26.624-16.384-55.296 0-41.984 28.672-70.656t70.656-28.672 70.656 28.672 28.672 70.656q0 14.336-4.096 28.16t-11.264 25.088q34.816 11.264 66.048 32.768t54.272 53.248 36.864 72.704 13.824 91.136q0 51.2 15.36 100.864t36.864 94.208 45.568 81.408 43.52 63.488zM478.208 142.336q0 16.384 11.264 28.16t27.648 11.776l2.048 0q16.384-1.024 27.648-12.288t11.264-27.648q0-17.408-11.264-28.672t-28.672-11.264-28.672 11.264-11.264 28.672z" p-id="4275" /></svg>
        </AnnouncementIcon>
        <span class="title">{{ popoverProps?.title }}</span>
      </div>
      <AnnouncementIcon class="close-icon" size="20px" :icon="popoverProps?.closeIcon" @click="handleClose">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z" /></svg>
      </AnnouncementIcon>
    </div>
    <div v-if="bodyContent.length" class="body content">
      <PopoverValue v-for="(v, idx) in bodyContent" :key="idx" :item="v">
        {{ v.type !== 'image' ? v.content : '' }}
      </PopoverValue>
      <hr v-if="footerContent.length">
    </div>
    <div class="footer content">
      <PopoverValue v-for="(v, idx) in footerContent" :key="idx" :item="v">
        {{ v.type !== 'image' ? v.content : '' }}
      </PopoverValue>
    </div>
  </div>
  <div
    v-show="showReopen" class="theme-blog-popover-close"
    :class="{ twinkle: popoverProps?.twinkle }"
    @click="show = true"
  >
    <AnnouncementIcon :icon="popoverProps?.icon">
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4274" width="200" height="200"><path d="M660.48 872.448q6.144 0-3.584 15.36t-29.696 33.792-47.104 33.792-57.856 15.36q-27.648 0-53.248-15.36t-45.056-33.792-29.696-33.792-6.144-15.36l272.384 0zM914.432 785.408q7.168 9.216 6.656 17.92t-4.608 14.848-10.24 9.728-12.288 3.584l-747.52 0q-14.336 0-20.992-11.776t4.608-29.184q17.408-30.72 40.96-68.608t44.544-81.408 36.352-92.16 15.36-101.888q0-51.2 14.336-92.16t37.376-71.68 53.248-52.224 62.976-32.768q-16.384-26.624-16.384-55.296 0-41.984 28.672-70.656t70.656-28.672 70.656 28.672 28.672 70.656q0 14.336-4.096 28.16t-11.264 25.088q34.816 11.264 66.048 32.768t54.272 53.248 36.864 72.704 13.824 91.136q0 51.2 15.36 100.864t36.864 94.208 45.568 81.408 43.52 63.488zM478.208 142.336q0 16.384 11.264 28.16t27.648 11.776l2.048 0q16.384-1.024 27.648-12.288t11.264-27.648q0-17.408-11.264-28.672t-28.672-11.264-28.672 11.264-11.264 28.672z" p-id="4275" /></svg>
    </AnnouncementIcon>
  </div>
</template>

<style lang="css" scoped>
@import url(./style.css);
</style>
