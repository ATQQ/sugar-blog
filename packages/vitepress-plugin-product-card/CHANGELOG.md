# vitepress-plugin-product-card

## 0.1.0

### Minor Changes

- 首个版本发布，从 `@sugarat/theme` 抽离
  - 提供 `productCardMarkdownPlugin`：markdown-it 容器插件，解析 `::: card` 语法
  - 提供 `ProductCard` Vue 组件与 `registerProductCard` 便利函数（`/client` 子入口）
  - 支持 GitHub 创建/更新时间自动获取（全局与单卡两级配置）
  - 支持 GitHub 图标在时间行前置或作为标签兜底展示
  - 双 CJS/ESM 产物、内置 `.d.ts` 类型定义
