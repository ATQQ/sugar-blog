<script lang="ts" setup>
import { onMounted } from 'vue'
import type { TemplatePluginOptions } from 'vitepress-plugin-slot-inject-template'

// TODO：按实际情况修改虚拟模块名称
// @ts-expect-error
import templatePluginOptions from 'virtual:slot-inject-template-options'

// TODO：按实际情况修改，如果要用子组件
import ChildDemo from './ChildDemo.vue'

// TODO：Vue组件里要用的工具方法，按实际情况添加即可
import { inBrowser, parseStringStyle, useDebounceFn } from './util'

// TODO：按实际情况修改命名
const pluginOptions: TemplatePluginOptions = templatePluginOptions

onMounted(() => {
  console.log('ParentDemo mounted')
  console.log(pluginOptions)
})
</script>

<template>
  <div class="parent-demo">
    <h1> {{ pluginOptions.title || 'Hello VitePress Slot Plugin Demo' }} </h1>
    <ChildDemo>这是一个示例按钮</ChildDemo>
  </div>
</template>

<style lang="css" scoped>
/* TODO：按实际情况添加样式 */
@import url(./style.css);
</style>
