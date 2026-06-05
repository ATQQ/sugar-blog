#!/usr/bin/env zx
import waitOn from 'wait-on'

/** `build:node` 之前需要已由其它构建任务产出的目录（按需增删） */
const waitResources = [
  'packages/shared/dist/index.d.ts',
  'packages/vitepress-plugin-back2top/dist/index.d.ts',
  'packages/vitepress-plugin-giscus/dist/index.d.ts',
  'packages/vitepress-plugin-artalk/dist/index.d.ts',
  'packages/vitepress-plugin-image-preview/dist/index.d.ts',
  'packages/vitepress-plugin-announcement/dist/index.d.ts',
  'packages/vitepress-plugin-51la/dist/index.d.ts',
  'packages/vitepress-plugin-rss/dist/index.d.ts',
  'packages/vitepress-plugin-pagefind/dist/index.d.ts',
]

await waitOn({ resources: waitResources })
await $`pnpm --filter @sugarat/theme build:node`
