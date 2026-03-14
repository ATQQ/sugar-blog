---
description: 介绍如何利用 Layout 插槽扩展主题功能
title: 🧩 Layout 插槽
tag:
 - 配置
 - 插槽
---

# Layout 插槽

主题基于 VitePress 默认主题进行扩展，因此支持默认主题的所有插槽，你可以利用这些插槽在页面的特定位置注入自定义内容。

## 可用插槽

由于主题的 Layout (`BlogApp`) 对 VitePress 默认主题的 Layout 进行了封装并透传了所有插槽，因此你可以使用[官方文档列出的所有插槽](https://vitepress.dev/zh/guide/extending-default-theme#layout-slots)。

常用插槽包括：

*   `doc-before`: 在文档内容之前
*   `doc-after`: 在文档内容之后
*   `doc-top`: 在文档顶部
*   `doc-bottom`: 在文档底部
*   `layout-top`: 在整个布局顶部
*   `layout-bottom`: 在整个布局底部
*   `nav-bar-content-before`: 导航栏内容之前
*   `nav-bar-content-after`: 导航栏内容之后

::: tip 提示
主题内部也使用了一些插槽来实现特定功能（例如 `doc-before` 用于展示阅读分析，`doc-after` 用于展示评论和打赏），你的自定义内容会与主题内容并存。
:::

## 如何使用

### 1. 创建自定义 Layout 组件

在 `.vitepress/theme/` 目录下创建一个自定义 Layout 组件，例如 `MyLayout.vue`。

```vue
<!-- .vitepress/theme/MyLayout.vue -->
<script setup>
import BlogTheme from '@sugarat/theme'

const { Layout } = BlogTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="custom-slot">
        🚀 在文章内容前插入自定义内容
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.custom-slot {
  padding: 10px;
  background-color: var(--vp-c-bg-alt);
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  color: var(--vp-c-brand);
  font-weight: bold;
}
</style>
```

### 2. 注册自定义 Layout

修改 `.vitepress/theme/index.ts`，引入并使用你的自定义 Layout。

```ts
// .vitepress/theme/index.ts
import BlogTheme from '@sugarat/theme'
import MyLayout from './MyLayout.vue'

// 自定义样式重载
// import './style.css'

export default {
  ...BlogTheme,
  Layout: MyLayout
}
```

### 3. 效果验证

启动项目，进入任意文章页面，你应该能看到在文章内容上方出现了 "🚀 在文章内容前插入自定义内容"。

## 方式二：使用渲染函数 (h)

如果你只需要简单的插入一些组件或内容，可以使用 Vue 的渲染函数 `h` 直接在 `index.ts` 中定义 Layout，无需创建额外的 `.vue` 文件。

```ts
// .vitepress/theme/index.ts
import BlogTheme from '@sugarat/theme'
import { h } from 'vue'
import MyComponent from './MyComponent.vue'

export default {
  ...BlogTheme,
  Layout: h(BlogTheme.Layout, undefined, {
    'doc-before': () => h(MyComponent),
    'doc-after': () => h('div', { style: 'padding: 20px; text-align: center;' }, '版权所有 © 2024')
  })
}
```

这种方式更加简洁，适合逻辑简单的场景。

## 高级用法

你还可以结合 `useData` 或 `useRoute` 来根据不同页面展示不同内容。

```vue
<script setup>
import BlogTheme from '@sugarat/theme'
import { useData } from 'vitepress'
import { computed } from 'vue'

const { Layout } = BlogTheme
const { frontmatter } = useData()

// 仅在特定 layout 或包含特定 frontmatter 的页面显示
const showCustomContent = computed(() => {
  return frontmatter.value.layout !== 'home'
})
</script>

<template>
  <Layout>
    <template #doc-after>
      <div v-if="showCustomContent" class="custom-footer">
        自定义页脚内容
      </div>
    </template>
  </Layout>
</template>
```
