<script lang="ts" setup>
import { ElButton, ElIcon } from 'element-plus'
import { CircleCloseFilled, Flag } from '@element-plus/icons-vue'
import { computed, h, onMounted, ref } from 'vue'
import type { BlogPopover } from '@sugarat/theme'
import { parseStringStyle } from '@vue/shared'
import { useWindowSize } from '@vueuse/core'
import { useBlogConfig } from '../composables/config/blog'

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
          window.open(item.link, '_self')
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
          <Flag />
        </ElIcon>
        <span class="title">{{ popoverProps?.title }}</span>
      </div>
      <ElIcon class="close-icon" size="20px" @click="handleClose">
        <CircleCloseFilled />
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
    @click="show = true"
  >
    <ElIcon size="20px">
      <Flag />
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
</style>
