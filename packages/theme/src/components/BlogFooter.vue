<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useHomeFooterConfig } from '../composables/config/blog'
import packageJSON from '../../package.json'
import { copyrightSVG, icpSVG, themeSVG } from '../constants/svg'

const footer = useHomeFooterConfig()
const data = ref<{
  name: string
  link?: string
  icon?: string | boolean
}[]>([])
onMounted(() => {
  if (!footer) {
    return
  }
  const { icpRecord, securityRecord, copyright, version } = footer
  // version
  if (version !== false) {
    data.value.push({
      name: `@sugarat/theme@${packageJSON.version}`,
      link: 'https://www.npmjs.com/package/@sugarat/create-theme',
      icon: themeSVG
    })
  }
  // copyright
  if (typeof copyright === 'string') {
    data.value.push({
      name: copyright,
      icon: copyrightSVG
    })
  }
  if (copyright instanceof Object) {
    data.value.push({
      icon: copyrightSVG,
      name: copyright.message,
      ...copyright
    })
  }
  // 备案信息
  if (icpRecord) {
    data.value.push({
      icon: icpSVG,
      ...icpRecord
    })
  }
  // 网备信息
  if (securityRecord) {
    data.value.push({
      icon: 'security',
      ...securityRecord
    })
  }
})
</script>

<template>
  <footer v-if="footer" class="blog-footer">
    <p v-if="footer?.message" v-html="footer?.message" />
    <p class="footer-item-list">
      <span v-for="(item, index) in data" :key="index" class="footer-item">
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
