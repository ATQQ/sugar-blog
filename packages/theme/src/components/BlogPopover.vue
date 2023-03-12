<template>
  <div class="theme-blog-popover" v-show="show" data-pagefind-ignore="all">
    <div class="header">
      <div class="title-wrapper">
        <el-icon size="20px"><Flag /></el-icon>
        <span class="title">{{ popoverProps?.title }}</span>
      </div>
      <el-icon @click="show = false" class="close-icon" size="20px"
        ><CircleCloseFilled
      /></el-icon>
    </div>
    <div class="body content" v-if="bodyContent.length">
      <PopoverValue v-for="(v, idx) in bodyContent" :key="idx" :item="v">
        {{ v.type !== 'image' ? v.content : '' }}
      </PopoverValue>
      <hr v-if="footerContent.length" />
    </div>
    <div class="footer content">
      <PopoverValue v-for="(v, idx) in footerContent" :key="idx" :item="v">
        {{ v.type !== 'image' ? v.content : '' }}
      </PopoverValue>
    </div>
  </div>
  <div
    class="theme-blog-popover-close"
    v-show="!show && (popoverProps?.reopen ?? true) && popoverProps?.title"
    @click="show = true"
  >
    <el-icon size="20px"><Flag /></el-icon>
  </div>
</template>

<script lang="ts" setup>
import { ElIcon, ElButton } from 'element-plus'
import { Flag, CircleCloseFilled } from '@element-plus/icons-vue'
import { computed, onMounted, ref, h } from 'vue'
import type { BlogPopover } from '@sugarat/theme'
import { parseStringStyle } from '@vue/shared'
import { useBlogConfig } from '../composables/config/blog'

const { popover: popoverProps } = useBlogConfig()

const show = ref(false)

const bodyContent = computed(() => {
  return popoverProps?.body || []
})

const footerContent = computed(() => {
  return popoverProps?.footer || []
})

onMounted(() => {
  if (!popoverProps?.title) {
    return
  }

  const storageKey = 'theme-blog-popover'
  // 取旧值
  const oldValue = localStorage.getItem(storageKey)
  const newValue = JSON.stringify(popoverProps)
  localStorage.setItem(storageKey, newValue)

  // >= 0 每次都展示，区别是否自动消失
  if (Number(popoverProps?.duration ?? '') >= 0) {
    show.value = true
    if (popoverProps?.duration) {
      setTimeout(() => {
        show.value = false
      }, popoverProps?.duration)
    }
  }

  if (oldValue !== newValue && popoverProps?.duration === -1) {
    // 当做新值处理
    show.value = true
  }
})

const PopoverValue = (
  props: { key: number; item: BlogPopover.Value },
  { slots }: any
) => {
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

<style lang="scss" scoped>
.theme-blog-popover {
  width: 258px;
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 19;
  box-sizing: border-box;
  border: 1px solid var(--el-color-primary-light-3);
  border-radius: 6px;
  background-color: rgba(var(--bg-gradient-home));
  box-shadow: var(--box-shadow);
}
@media screen and (min-width: 760px) and (max-width: 1140px) {
  .theme-blog-popover {
    top: 200px;
  }
}
.header {
  background-color: var(--el-color-primary-light-3);
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
  z-index: 19;
  top: 80px;
  right: 10px;
  position: fixed;
  background-color: var(--el-color-primary-light-3);
  padding: 8px;
  color: #fff;
  font-size: 12px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
}
</style>
