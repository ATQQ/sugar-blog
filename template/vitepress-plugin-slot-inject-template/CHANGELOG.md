# vitepress-plugin-slot-inject-template

## 0.1.1

### Patch Changes

- fix: 模板注入逻辑改用 `@sugarat/theme-shared` 的 `createSlotInjectPlugin`（基于 `@vue/compiler-sfc`），组件构建同步改为 `mkdist`，产物为纯 JS `.vue`；`vue` 加入 `peerDependencies`。
- Updated dependencies
  - @sugarat/theme-shared@0.1.0

## 0.1.0

### Minor Changes

- feat: init plugin
