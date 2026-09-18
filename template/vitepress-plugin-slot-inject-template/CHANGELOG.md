# vitepress-plugin-slot-inject-template

## 0.1.1

### Patch Changes

- fix: 模板注入逻辑改用 `@sugarat/theme-shared` 的 `createSlotInjectPlugin`（基于 `@vue/compiler-sfc`），组件构建同步改为 `mkdist`，产物为纯 JS `.vue`；`vue` 加入 `peerDependencies`。
- fix: 关闭 mkdist 默认的 postcss/cssnano，避免压缩改写相对颜色、`@supports`、`v-bind()` 导致组件样式失效。
- Updated dependencies
  - @sugarat/theme-shared@0.1.0

## 0.1.0

### Minor Changes

- feat: init plugin
