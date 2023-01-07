<template>
  <div class="theme-blog-popover" v-show="show">
    <div class="header">
      <div class="title-wrapper">
        <el-icon size="20px"><Flag /></el-icon>
        <span class="title">{{ popover?.title }}</span>
      </div>
      <el-icon @click="show = false" class="close-icon" size="20px"
        ><CircleCloseFilled
      /></el-icon>
    </div>
    <div class="body content" v-if="bodyContent.length">
      <PopoverValue
        v-for="(v, idx) in bodyContent"
        :key="idx"
        :item="v"
      ></PopoverValue>
      <hr v-if="footerContent.length" />
    </div>
    <div class="footer content">
      <PopoverValue
        v-for="(v, idx) in footerContent"
        :key="idx"
        :item="v"
      ></PopoverValue>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElIcon, ElButton } from 'element-plus'
import { Flag, CircleCloseFilled } from '@element-plus/icons-vue'
import { computed, onMounted, ref, h } from 'vue'
import type { BlogPopover } from '@sugarat/theme'
import { parseStringStyle } from '@vue/shared'
import { useBlogConfig } from '../composables/config/blog'

const { popover } = useBlogConfig()

const show = ref(false)

const bodyContent = computed(() => {
  return popover?.body || []
})

const footerContent = computed(() => {
  return popover?.footer || []
})

onMounted(() => {
  if (popover?.title) {
    show.value = true
  }
})

const PopoverValue = (props: { key: number; item: BlogPopover.Value }) => {
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
      item.content
    )
  }
  return h(
    'div',
    {
      key
    },
    '123'
  )
}
</script>

<style lang="scss" scoped>
.theme-blog-popover {
  position: fixed;
  width: 270px;
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 19;
  box-sizing: border-box;
  border: 1px solid #409eff;
  border-radius: 6px;
  background-color: rgba(var(--bg-gradient));
  box-shadow: var(--box-shadow);
}
@media screen and (min-width: 760px) and (max-width: 1140px) {
  .theme-blog-popover {
    top: 200px;
  }
}
.header {
  background-color: #409eff;
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
  padding: 10px 15px 0;
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
</style>
