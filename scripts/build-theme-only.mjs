#!/usr/bin/env zx
import waitOn from 'wait-on'

/** `build:node` 之前需要已由其它构建任务产出的目录（按需增删） */
const waitResources = [
  'packages/shared/dist',
  'packages/vitepress-plugin-back2top/dist',
  'packages/vitepress-plugin-giscus/dist',
  'packages/vitepress-plugin-artalk/dist',
  'packages/vitepress-plugin-image-preview/dist',
  'packages/vitepress-plugin-announcement/dist',
  'packages/vitepress-plugin-51la/dist',
  'packages/vitepress-plugin-rss/dist',
  'packages/vitepress-plugin-pagefind/dist',
]

await waitOn({ resources: waitResources })
await $`pnpm --filter @sugarat/theme build:node`
