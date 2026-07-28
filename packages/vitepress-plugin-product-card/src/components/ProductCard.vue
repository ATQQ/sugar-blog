<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { formatDate } from './formatDate'

export interface ProductCardItem {
  icon?: string
  iconColor?: string
  title: string
  link?: string
  github?: string
  tags?: string[]
  descHtml?: string
  showCreated?: boolean
  showUpdated?: boolean
}

const props = defineProps<{ title?: string; items: ProductCardItem[] }>()

interface MetaState {
  createdAt?: string
  updatedAt?: string
}

const meta = reactive<Record<number, MetaState>>({})

function isImage(v?: string) {
  return !!v && /^(https?:\/\/|\/)/.test(v)
}

function parseGithubRepo(url: string): { owner: string; repo: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  if (!m) {
    return null
  }
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') }
}

function needMeta(item: ProductCardItem): boolean {
  if (!item.github) {
    return false
  }
  return item.showCreated !== false || item.showUpdated !== false
}

function showGithubTag(idx: number): boolean {
  return !!props.items[idx]?.github && !(meta[idx]?.createdAt || meta[idx]?.updatedAt)
}

onMounted(() => {
  props.items.forEach((item, idx) => {
    if (!needMeta(item)) {
      return
    }
    const info = parseGithubRepo(item.github!)
    if (!info) {
      return
    }
    fetch(`https://api.github.com/repos/${info.owner}/${info.repo}`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error(String(res.status))))
      .then((data) => {
        const state: MetaState = {}
        if (item.showCreated !== false && data?.created_at) {
          state.createdAt = formatDate(data.created_at, 'yyyy-MM-dd')
        }
        if (item.showUpdated !== false && (data?.pushed_at || data?.updated_at)) {
          state.updatedAt = formatDate(data.pushed_at || data.updated_at, 'yyyy-MM-dd')
        }
        meta[idx] = state
      })
      .catch(() => {})
  })
})
</script>

<template>
  <div class="sugar-product-card">
    <div v-if="title" class="pc-section-title">
      {{ title }}
    </div>
    <div v-for="(item, idx) in items" :key="idx" class="pc-item">
      <div
        v-if="item.icon"
        class="pc-icon"
        :style="!isImage(item.icon) ? { backgroundColor: item.iconColor || 'var(--vp-c-bg-alt)' } : undefined"
      >
        <img v-if="isImage(item.icon)" :src="item.icon" :alt="item.title">
        <span v-else class="pc-icon-char">{{ item.icon }}</span>
      </div>
      <div class="pc-body">
        <div class="pc-title-row">
          <a
            v-if="item.link"
            class="pc-title"
            :href="item.link"
            target="_blank"
            rel="noopener"
          >{{ item.title }}</a>
          <div v-else class="pc-title">
            {{ item.title }}
          </div>
        </div>
        <div v-if="item.descHtml" class="pc-desc" v-html="item.descHtml" />
        <a
          v-if="item.github && (meta[idx]?.createdAt || meta[idx]?.updatedAt)"
          class="pc-meta"
          :href="item.github"
          target="_blank"
          rel="noopener"
          aria-label="访问 GitHub 仓库"
        >
          <svg class="pc-gh-svg" viewBox="0 0 496 512" aria-hidden="true"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9c1.6 2.3 4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2z" /></svg>
          <span v-if="meta[idx]?.createdAt">创建于 {{ meta[idx].createdAt }}</span>
          <span v-if="meta[idx]?.createdAt && meta[idx]?.updatedAt" class="pc-meta-sep">·</span>
          <span v-if="meta[idx]?.updatedAt">更新于 {{ meta[idx].updatedAt }}</span>
        </a>
        <div v-if="showGithubTag(idx) || item.tags?.length" class="pc-tags">
          <a
            v-if="showGithubTag(idx)"
            class="pc-tag pc-tag-github"
            :href="item.github"
            target="_blank"
            rel="noopener"
            aria-label="访问 GitHub 仓库"
          >
            <svg class="pc-gh-svg" viewBox="0 0 496 512" aria-hidden="true"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9c1.6 2.3 4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2z" /></svg>GitHub
          </a>
          <span v-for="t in item.tags" :key="t" class="pc-tag">{{ t }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sugar-product-card {
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.pc-section-title {
  color: var(--vp-c-text-3);
  font-size: 13px;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.pc-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.pc-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-alt);
}

.pc-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pc-icon-char {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.pc-body {
  flex: 1;
  min-width: 0;
}

.pc-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.pc-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

a.pc-title:hover {
  color: var(--vp-c-brand-1);
}

.pc-desc {
  margin-top: 6px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}

.pc-desc :deep(a) {
  color: var(--vp-c-brand-1);
}

.pc-meta {
  margin-top: 8px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  line-height: 1.5;
}

a.pc-meta {
  color: var(--vp-c-text-3);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

a.pc-meta:hover {
  color: var(--vp-c-text-1);
}

.pc-meta-sep {
  margin: 0 6px;
}

.pc-gh-svg {
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: -2px;
  margin-right: 4px;
}

.pc-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pc-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.4;
}

.pc-tag-github {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft, var(--vp-c-bg-alt));
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pc-tag-github:hover {
  color: var(--vp-c-brand-2, var(--vp-c-brand-1));
}

@media (max-width: 640px) {
  .pc-icon {
    width: 44px;
    height: 44px;
  }
  .pc-title {
    font-size: 16px;
  }
}
</style>
