<script setup lang="ts">
import { computed } from 'vue'
import { useHomeFooterConfig } from '../composables/config/blog'
import packageJSON from '../../package.json'
import { copyrightSVG, icpSVG, themeSVG } from '../constants/svg'

const footerData = useHomeFooterConfig()

const renderData = computed(() => {
  if (!footerData) {
    return []
  }
  const flatData = [footerData].flat()
  return flatData.flat().map((footer, idx) => {
    const { icpRecord, securityRecord, copyright, version, message } = footer
    const data: {
      name: string
      link?: string
      icon?: string | boolean
    }[] = []
    // message
    const messageData: string[] = [message || []].flat()

    // version
    const isLast = idx === flatData.length - 1
    if ((version !== false && isLast) || version === true) {
      data.push({
        name: `@sugarat/theme@${packageJSON.version}`,
        link: 'https://theme.sugarat.top/',
        icon: themeSVG
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
    return {
      data,
      messageData
    }
  })
})
</script>

<template>
  <footer v-if="renderData.length" class="blog-footer">
    <!-- eslint-disable vue/require-v-for-key -->
    <!-- see https://cn.vuejs.org/guide/essentials/list.html#v-for-on-template -->
    <template v-for="({ data, messageData }) in renderData">
      <p v-for="message in messageData" v-html="message" />
      <p class="footer-item-list">
        <span v-for="item in data" class="footer-item">
          <i v-if="item.icon === 'security'">
            <img src="./../styles/gongan.png" alt="公网安备">
          </i>
          <i v-else-if="item.icon" v-html="item.icon" />
          <a v-if="item.link" :href="item.link" target="_blank" rel="noopener noreferrer">
            {{ item.name }}
          </a>
          <span v-else>{{ item.name }}</span>
        </span>
      </p>
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
