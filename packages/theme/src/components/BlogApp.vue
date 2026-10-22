<script setup lang="ts" name="BlogApp">
import Theme from 'vitepress/theme'
import { useData, useRoute, withBase } from 'vitepress'
import { computed, watch } from 'vue'
import { useDarkTransition } from '../hooks/useDarkTransition'
import { useArticles, useBlogInfoCollapsible, useBlogThemeMode, useDarkTransitionConfig, useRecommendConfig, useShowRecommend } from '../composables/config/blog'
import { useSidebarToggle } from '../composables/sidebar'
import BlogHomeInfo from './BlogHomeInfo.vue'
import BlogHomeBanner from './BlogHomeBanner.vue'
import BlogList from './BlogList.vue'
import BlogSidebar from './BlogSidebar.vue'

import BlogArticleAnalyze from './BlogArticleAnalyze.vue'
import BlogAlert from './BlogAlert.vue'
import BlogFooter from './BlogFooter.vue'
import BlogHomeHeaderAvatar from './BlogHomeHeaderAvatar.vue'
import BlogOml2d from './BlogOml2d.vue'
import BlogButtonAfterArticle from './BlogButtonAfterArticle.vue'

const { frontmatter, theme } = useData()
const docs = useArticles()
const route = useRoute()
const layout = computed(() => frontmatter.value.layout)
const isBlogTheme = useBlogThemeMode()
const showRecommend = useShowRecommend()
const recommendConfig = useRecommendConfig()
const { isSidebarCollapsed, isSidebarAutoHidden, expand, setAutoHidden } = useSidebarToggle({
  collapsed: recommendConfig.value?.collapsed,
})
const collapsible = computed(() => recommendConfig.value?.collapsible ?? true)
const expandText = computed(() => recommendConfig.value?.expandText || '相关文章')
const sidebarDisabled = computed(() => frontmatter.value.sidebar === false)

// 关闭展开/收起引导时，确保侧栏保持展开
watch(collapsible, (val) => {
  if (!val && isSidebarCollapsed.value)
    expand()
}, { immediate: true })
const { Layout } = Theme

const blogInfoCollapsible = useBlogInfoCollapsible()

// 提取所有顶部导航中的链接
const navLinks = computed(() => {
  const links = new Set<string>()
  const clean = (p: string) => decodeURIComponent(p || '').replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '')
  const traverse = (items: any[]) => {
    if (!Array.isArray(items))
      return
    for (const item of items) {
      if (item?.link) {
        links.add(clean(item.link))
      }
      if (item?.items) {
        traverse(item.items)
      }
    }
  }
  traverse(theme.value.nav || [])
  return links
})

// 若通过顶部导航进入的文章页面在侧边栏中无对应文章，则自动隐藏侧边栏
// 仅切换主题内的 html class，不修改 VitePress 的 frontmatter
const autoHideSidebar = computed(() => {
  if (layout.value === 'home')
    return false
  if (frontmatter.value.sidebar !== undefined)
    return false

  const clean = (p: string) => decodeURIComponent(p || '').replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '')
  const curPath = clean(route.path)

  const isNav = navLinks.value.has(curPath) || navLinks.value.has(clean(withBase(curPath)))
  if (!isNav)
    return false

  const hasArticle = docs.value.some((doc) => {
    if (doc.meta.hidden || doc.meta.recommend === false || doc.meta.publish === false)
      return false
    return clean(doc.route) === curPath
  })

  return !hasArticle
})

watch(autoHideSidebar, val => setAutoHidden(val), { immediate: true, flush: 'sync' })

// 切换深色模式过渡
// https://vitepress.dev/zh/guide/extending-default-theme#on-appearance-toggle
useDarkTransition()
const openTransition = useDarkTransitionConfig()
</script>

<template>
  <Layout :class="{ 'blog-theme-layout': openTransition }">
    <template #layout-top>
      <slot name="layout-top" />
      <ClientOnly>
        <button
          v-if="isBlogTheme && showRecommend && layout !== 'home' && !sidebarDisabled && !isSidebarAutoHidden && collapsible && isSidebarCollapsed"
          class="sidebar-expand-trigger"
          :title="expandText"
          @click="expand"
        >
          <div class="expand-dot" />
          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <div class="expand-dot" />
        </button>
        <BlogOml2d />
        <BlogAlert />
      </ClientOnly>
    </template>

    <template #doc-before>
      <slot name="doc-before" />
      <!-- 阅读时间分析 -->
      <ClientOnly>
        <BlogArticleAnalyze />
      </ClientOnly>
    </template>

    <template #nav-bar-content-before>
      <slot name="nav-bar-content-before" />
    </template>
    <!-- 自定义首页 -->
    <template v-if="isBlogTheme" #home-hero-before>
      <slot name="home-hero-before" />
      <div class="home">
        <BlogHomeHeaderAvatar />
        <div class="header-banner">
          <BlogHomeBanner />
        </div>
        <div class="content-wrapper">
          <div class="blog-list-wrapper">
            <BlogList />
          </div>
          <div
            :class="{
              'normal-mode': blogInfoCollapsible,
            }" class="blog-info-wrapper"
          >
            <BlogHomeInfo />
          </div>
        </div>
      </div>
    </template>
    <template v-if="isBlogTheme" #sidebar-nav-after>
      <slot name="sidebar-nav-after" />
      <BlogSidebar />
    </template>
    <template #doc-after>
      <slot name="doc-after" />
      <!-- 评论 -->
      <ClientOnly>
        <BlogButtonAfterArticle />
      </ClientOnly>
    </template>
    <template #layout-bottom>
      <BlogFooter v-if="layout === 'home'" />
      <slot name="layout-bottom" />
    </template>
    <!-- 透传默认主题的其它插槽 -->
    <!-- navbar -->
    <template #nav-bar-title-before>
      <slot name="nav-bar-title-before" />
    </template>
    <template #nav-bar-title-after>
      <slot name="nav-bar-title-after" />
    </template>
    <template #nav-bar-content-after>
      <slot name="nav-bar-content-after" />
    </template>
    <template #nav-screen-content-before>
      <slot name="nav-screen-content-before" />
    </template>
    <template #nav-screen-content-after>
      <div v-if="blogInfoCollapsible" class="minify-mode blog-info-wrapper">
        <BlogHomeInfo />
      </div>
      <slot name="nav-screen-content-after" />
    </template>

    <!-- sidebar -->
    <template #sidebar-nav-before>
      <slot name="sidebar-nav-before" />
    </template>

    <!-- content -->
    <template #page-top>
      <slot name="page-top" />
    </template>
    <template #page-bottom>
      <slot name="page-bottom" />
    </template>

    <template #not-found>
      <slot name="not-found" />
    </template>
    <template #home-hero-info>
      <slot name="home-hero-info" />
    </template>
    <template #home-hero-image>
      <slot name="home-hero-image" />
    </template>
    <template #home-hero-after>
      <slot name="home-hero-after" />
    </template>
    <template #home-features-before>
      <slot name="home-features-before" />
    </template>
    <template #home-features-after>
      <slot name="home-features-after" />
    </template>

    <template #doc-footer-before>
      <slot name="doc-footer-before" />
    </template>

    <template #doc-top>
      <slot name="doc-top" />
    </template>
    <template #doc-bottom>
      <slot name="doc-bottom" />
    </template>

    <template #aside-top>
      <slot name="aside-top" />
    </template>
    <template #aside-bottom>
      <slot name="aside-bottom" />
    </template>
    <template #aside-outline-before>
      <slot name="aside-outline-before" />
    </template>
    <template #aside-outline-after>
      <slot name="aside-outline-after" />
    </template>
    <template #aside-ads-before>
      <slot name="aside-ads-before" />
    </template>
    <template #aside-ads-after>
      <slot name="aside-ads-after" />
    </template>
  </Layout>
</template>

<style scoped>
.home {
  margin: 0 auto;
  padding: 20px;
  max-width: 1126px;
}

@media screen and (min-width: 960px) {
  .home {
    padding-top: var(--vp-nav-height);
  }
}
.header-banner {
  width: 100%;
  padding: 60px 0;
}

.content-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.blog-list-wrapper {
  width: 100%;
}

.blog-info-wrapper {
  margin-left: 16px;
  position: sticky;
  top: 100px;
}

@media screen and (max-width: 959px) {
  .blog-info-wrapper {
    margin-left: 16px;
    position: sticky;
    top: 40px;
  }
}
@media screen and (max-width: 767px) {
  .content-wrapper {
    flex-wrap: wrap;
  }
  .blog-info-wrapper {
    margin: 20px 0;
    width: 100%;
  }
  .normal-mode {
    display: none;
  }
  .minify-mode {
    display: block;
  }
}
@media screen and (min-width: 768px) {
  .minify-mode {
    display: none;
  }
  .normal-mode {
    display: block;
  }
}

.sidebar-expand-trigger {
  display: none;
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  width: 20px;
  height: 52px;
  padding: 0;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(226, 232, 240, 0.95);
  border-left: none;
  border-radius: 0 8px 8px 0;
  box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.05);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  color: var(--vp-c-text-2, #475569);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}

:root.dark .sidebar-expand-trigger {
  background: rgba(30, 41, 59, 0.88);
  border-color: rgba(71, 85, 105, 0.7);
  color: var(--vp-c-text-2, #94a3b8);
  box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.3);
}

.expand-dot {
  width: 3.5px;
  height: 3.5px;
  border-radius: 50%;
  background: var(--vp-c-text-3, #94a3b8);
  transition: background-color 0.2s ease;
}

.sidebar-expand-trigger:hover {
  width: 24px;
  background: rgba(255, 255, 255, 0.98);
  color: var(--vp-c-brand-1, #409eff);
  border-color: var(--vp-c-brand-1, #409eff);
  box-shadow: 3px 5px 16px rgba(64, 158, 255, 0.28);
}

:root.dark .sidebar-expand-trigger:hover {
  background: rgba(30, 41, 59, 0.98);
}

.sidebar-expand-trigger:hover .expand-dot {
  background-color: var(--vp-c-brand-1, #409eff);
}

.sidebar-expand-trigger:active {
  transform: translateY(-50%) scale(0.96);
}

@media screen and (min-width: 960px) {
  .sidebar-expand-trigger {
    display: flex;
  }
}
</style>

<style>
@import url(./../styles/dark-transition.css);
</style>
