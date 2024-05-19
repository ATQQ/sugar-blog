<script lang="ts" setup>
import { ElButton, ElIcon } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { computed, h, onMounted, ref, watch } from 'vue'
import type { BlogPopover } from '@sugarat/theme'
import { parseStringStyle } from '@vue/shared'
import { useDebounceFn, useWindowSize } from '@vueuse/core'
import { useRoute, useRouter } from 'vitepress'
import { useBlogConfig } from '../composables/config/blog'
import { vOuterHtml } from '../directives'

const { popover: popoverProps } = useBlogConfig()

const show = ref(false)

const bodyContent = computed(() => {
  return popoverProps?.body || []
})

const footerContent = computed(() => {
  return popoverProps?.footer || []
})
const storageKey = 'theme-blog-popover'
const closeFlag = `${storageKey}-close`

// 移动端最小化
const { width } = useWindowSize()
const router = useRouter()
const route = useRoute()
onMounted(() => {
  if (!popoverProps?.title) {
    return
  }

  // 取旧值
  const oldValue = localStorage.getItem(storageKey)
  const newValue = JSON.stringify(popoverProps)
  localStorage.setItem(storageKey, newValue)

  // 移动端最小化
  if (width.value < 768 && popoverProps?.mobileMinify) {
    show.value = false
    return
  }

  // >= 0 每次都展示，区别是否自动消失
  if (Number(popoverProps?.duration ?? '') >= 0) {
    show.value = true
    if (popoverProps?.duration) {
      setTimeout(() => {
        show.value = false
      }, popoverProps?.duration)
    }
    return
  }

  if (oldValue !== newValue && popoverProps?.duration === -1) {
    // 当做新值处理
    show.value = true
    localStorage.removeItem(closeFlag)
    return
  }

  // 新旧相等，判断是否点击过close，没点击关闭依然展示
  if (oldValue === newValue && popoverProps?.duration === -1 && !localStorage.getItem(closeFlag)) {
    show.value = true
  }
})

const onAfterRouteChanged = useDebounceFn(() => {
  popoverProps?.onRouteChanged?.(route, show)
}, 10)

watch(route, onAfterRouteChanged, { immediate: true })

function handleClose() {
  show.value = false
  if (popoverProps?.duration === -1) {
    localStorage.setItem(closeFlag, `${+new Date()}`)
  }
}

function PopoverValue(props: { key: number; item: BlogPopover.Value },
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
      ElButton,
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
</script>

<template>
  <div v-show="show" class="theme-blog-popover" data-pagefind-ignore="all">
    <div class="header">
      <div class="title-wrapper">
        <ElIcon size="20px">
          <i v-if="popoverProps?.icon" v-outer-html="popoverProps.icon" />
          <svg v-else t="1716085184855" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4274" width="200" height="200"><path d="M660.48 872.448q6.144 0-3.584 15.36t-29.696 33.792-47.104 33.792-57.856 15.36q-27.648 0-53.248-15.36t-45.056-33.792-29.696-33.792-6.144-15.36l272.384 0zM914.432 785.408q7.168 9.216 6.656 17.92t-4.608 14.848-10.24 9.728-12.288 3.584l-747.52 0q-14.336 0-20.992-11.776t4.608-29.184q17.408-30.72 40.96-68.608t44.544-81.408 36.352-92.16 15.36-101.888q0-51.2 14.336-92.16t37.376-71.68 53.248-52.224 62.976-32.768q-16.384-26.624-16.384-55.296 0-41.984 28.672-70.656t70.656-28.672 70.656 28.672 28.672 70.656q0 14.336-4.096 28.16t-11.264 25.088q34.816 11.264 66.048 32.768t54.272 53.248 36.864 72.704 13.824 91.136q0 51.2 15.36 100.864t36.864 94.208 45.568 81.408 43.52 63.488zM478.208 142.336q0 16.384 11.264 28.16t27.648 11.776l2.048 0q16.384-1.024 27.648-12.288t11.264-27.648q0-17.408-11.264-28.672t-28.672-11.264-28.672 11.264-11.264 28.672z" p-id="4275" /></svg>
        </ElIcon>
        <span class="title">{{ popoverProps?.title }}</span>
      </div>
      <ElIcon class="close-icon" size="20px" @click="handleClose">
        <i v-if="popoverProps?.closeIcon" v-outer-html="popoverProps.closeIcon" />
        <CircleCloseFilled v-else />
      </ElIcon>
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
    v-show="!show && (popoverProps?.reopen ?? true) && popoverProps?.title" class="theme-blog-popover-close"
    :class="{ twinkle: !show && (popoverProps?.twinkle ?? true) }"
    @click="show = true"
  >
    <ElIcon>
      <i v-if="popoverProps?.icon" v-outer-html="popoverProps.icon" />
      <svg v-else t="1716085184855" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4274" width="200" height="200"><path d="M660.48 872.448q6.144 0-3.584 15.36t-29.696 33.792-47.104 33.792-57.856 15.36q-27.648 0-53.248-15.36t-45.056-33.792-29.696-33.792-6.144-15.36l272.384 0zM914.432 785.408q7.168 9.216 6.656 17.92t-4.608 14.848-10.24 9.728-12.288 3.584l-747.52 0q-14.336 0-20.992-11.776t4.608-29.184q17.408-30.72 40.96-68.608t44.544-81.408 36.352-92.16 15.36-101.888q0-51.2 14.336-92.16t37.376-71.68 53.248-52.224 62.976-32.768q-16.384-26.624-16.384-55.296 0-41.984 28.672-70.656t70.656-28.672 70.656 28.672 28.672 70.656q0 14.336-4.096 28.16t-11.264 25.088q34.816 11.264 66.048 32.768t54.272 53.248 36.864 72.704 13.824 91.136q0 51.2 15.36 100.864t36.864 94.208 45.568 81.408 43.52 63.488zM478.208 142.336q0 16.384 11.264 28.16t27.648 11.776l2.048 0q16.384-1.024 27.648-12.288t11.264-27.648q0-17.408-11.264-28.672t-28.672-11.264-28.672 11.264-11.264 28.672z" p-id="4275" /></svg>
    </ElIcon>
  </div>
</template>

<style lang="scss" scoped>
.theme-blog-popover {
  width: 258px;
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 22;
  box-sizing: border-box;
  border: 1px solid var(--vp-c-brand-3);
  border-radius: 6px;
  background-color: rgba(var(--bg-gradient-home));
  box-shadow: var(--box-shadow);

  :deep(.el-button.el-button--primary) {
    background-color: var(--vp-c-brand-2);
    border-color: var(--vp-c-brand-2);
  }
}

.header {
  background-color: var(--vp-c-brand-3);
  color: #fff;
  padding: 6px 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .close-icon {
    cursor: pointer;
  }
}

.title-wrapper {
  display: flex;
  align-items: center;

  .title {
    font-size: 14px;
    padding-left: 6px;
  }
}

.body {
  box-sizing: border-box;
  padding: 10px 10px 0;

  hr {
    border: none;
    border-bottom: 1px solid #eaecef;
  }
}

.footer {
  box-sizing: border-box;
  padding: 10px;
}

.body.content,
.footer.content {
  text-align: center;

  h4 {
    text-align: center;
    font-size: 12px;
  }

  p {
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
  }

  img {
    width: 100%;
    // TODO: 未来优化，自动预获取图片高度填充
    height: 100px;
    object-fit: contain;
    margin: 0 auto;
  }
}

.theme-blog-popover-close {
  cursor: pointer;
  opacity: 0.5;
  position: fixed;
  z-index: 22;
  top: 80px;
  right: 10px;
  position: fixed;
  background-color: var(--vp-c-brand-3);
  padding: 8px;
  color: #fff;
  font-size: 12px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
}
.theme-blog-popover-close.twinkle {
  animation: twinkle 1s ease-in-out infinite;
}

@keyframes twinkle {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
