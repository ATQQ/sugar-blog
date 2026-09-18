/**
 * 在并行 buildlib 启动前清掉 wait-on 依赖的入口类型文件，
 * 避免残留 dist 让 theme / pagefind 等任务误判依赖已就绪。
 */
import { rm } from 'node:fs/promises'

const targets = [
  'packages/shared/dist/index.d.ts',
  'packages/vitepress-plugin-back2top/dist/index.d.ts',
  'packages/vitepress-plugin-giscus/dist/index.d.ts',
  'packages/vitepress-plugin-artalk/dist/index.d.ts',
  'packages/vitepress-plugin-image-preview/dist/index.d.ts',
  'packages/vitepress-plugin-announcement/dist/index.d.ts',
  'packages/vitepress-plugin-51la/dist/index.d.ts',
  'packages/vitepress-plugin-rss/dist/index.d.ts',
  'packages/vitepress-plugin-pagefind/dist/index.d.ts',
  'packages/vitepress-plugin-product-card/dist/index.d.ts',
]

await Promise.all(targets.map(file => rm(file, { force: true })))
