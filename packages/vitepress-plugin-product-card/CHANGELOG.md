# vitepress-plugin-product-card

## 0.1.1

### Patch Changes

- fix: 组件构建改为 `mkdist`（`.vue` 转纯 JS + 类型声明），发布产物不再包含 `lang="ts"`，下游无需 TypeScript 即可构建（修复 #467 同款问题）；`./client` 出口产物同步由 `mkdist` 提供类型声明。
- fix: 关闭 mkdist 默认的 postcss/cssnano，避免压缩改写相对颜色、`@supports`、`v-bind()` 导致组件样式失效。

## 0.1.0

### Minor Changes

- 首个版本发布，从 `@sugarat/theme` 抽离
  - 提供 `productCardMarkdownPlugin`：markdown-it 容器插件，解析 `::: card` 语法
  - 提供 `ProductCard` Vue 组件与 `registerProductCard` 便利函数（`/client` 子入口）
  - 支持 GitHub 创建/更新时间自动获取（全局与单卡两级配置）
  - 支持 GitHub 图标在时间行前置或作为标签兜底展示
  - 双 CJS/ESM 产物、内置 `.d.ts` 类型定义
