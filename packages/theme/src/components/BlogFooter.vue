<script setup lang="ts">
import { computed } from 'vue'
import { useHomeFooterConfig } from '../composables/config/blog'
import packageJSON from '../../package.json'
import { copyrightSVG, icpSVG, themeSVG } from '../constants/svg'
import { vOuterHtml } from '../directives'

const footerConfig = useHomeFooterConfig()

const renderData = computed(() => {
  const footerData = footerConfig.value
  if (!footerData) {
    return []
  }
  const flatData = [footerData].flat()
  return flatData.flat().map((footer, idx) => {
    const { icpRecord, securityRecord, copyright, version, message, bottomMessage, list } = footer
    const data: ({
      name: string
      link?: string
      icon?: string | boolean
    } | string) [] = []
    // message
    const messageData = [message || []].flat()
    const bottomMessageData = [bottomMessage || []].flat()

    // version
    const isLast = idx === flatData.length - 1
    if ((version !== false && isLast) || version) {
      const versionItem = typeof version === 'object' ? version : {}

      data.push({
        name: versionItem?.name || `@sugarat/theme@${packageJSON.version}`,
        link: versionItem?.link || 'https://theme.sugarat.top/',
        icon: versionItem?.icon || themeSVG
      })
    }
    // copyright
    if (typeof copyright === 'string') {
      data.push({
        name: copyright,
        icon: copyrightSVG
      })
    }
    if (copyright instanceof Object) {
      data.push({
        icon: copyrightSVG,
        name: copyright.message,
        ...copyright
      })
    }
    // 备案信息
    if (icpRecord) {
      data.push({
        icon: icpSVG,
        ...icpRecord
      })
    }
    // 网备信息
    if (securityRecord) {
      data.push({
        icon: 'security',
        ...securityRecord
      })
    }
    if (list) {
      const listData = [list || []].flat()
      data.push(...listData.map((v) => {
        if (typeof v === 'string') {
          return v
        }
        return {
          name: v.text,
          icon: v.icon,
          link: v.link
        }
      }))
    }
    return {
      data,
      messageData,
      bottomMessageData
    }
  })
})
</script>

<template>
  <footer v-if="renderData.length" class="blog-footer">
    <!-- eslint-disable vue/require-v-for-key -->
    <!-- see https://cn.vuejs.org/guide/essentials/list.html#v-for-on-template -->
    <template v-for="({ data, messageData, bottomMessageData }) in renderData">
      <!-- 在内置footer上方渲染 -->
      <p v-for="message in messageData" v-html="message" />
      <!-- 内置的列表 -->
      <p class="footer-item-list">
        <template v-for="item in data">
          <span v-if="typeof item !== 'string'" class="footer-item">
            <i v-if="item.icon === 'security'">
              <img src="./../styles/gongan.png" alt="公网安备">
            </i>
            <i v-else-if="item.icon" v-html="item.icon" />
            <a v-if="item.link" :href="item.link" target="_blank" rel="noopener noreferrer">
              {{ item.name }}
            </a>
            <span v-else>{{ item.name }}</span>
          </span>
          <!-- TODO: 理论上存在问题，待优化 -->
          <span v-else v-outer-html="item" />
        </template>
      </p>
      <!-- 在内置的footer下方渲染 -->
      <p v-for="message in bottomMessageData" v-html="message" />
    </template>
  </footer>
</template>

<style lang="scss" scoped>
footer.blog-footer {
  text-align: center;
  position: relative;
  border-top: 1px solid var(--vp-c-gutter);
  padding: 20px 12px;
  background-color: var(--vp-c-bg);

  p {
    line-height: 24px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
  }
}

.footer-item-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 719px) {
  .footer-item-list {
    flex-direction: column;
    align-items: center;
  }
}

.footer-item {
  display: flex;
  align-items: center;
  margin: 0 8px;

  i {
    margin-right: 4px;
    font-style: normal;
  }

  i :deep(svg) {
    fill: var(--vp-c-text-2);
    width: 16px;
    height: 16px;
  }

  i :deep(img) {
    width: 16px;
    height: 16px;
  }

  a:hover {
    color: var(--vp-c-brand-1);
    text-decoration: underline;
    text-decoration-color: var(--vp-c-brand-1);
    text-decoration-style: dashed;
  }
}
</style>
