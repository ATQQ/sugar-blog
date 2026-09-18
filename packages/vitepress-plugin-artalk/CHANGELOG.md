# vitepress-plugin-artalk

## 0.1.6

### Patch Changes

- fix: 组件构建改为 `mkdist`（`.vue` 转纯 JS + 类型声明），发布产物不再包含 `lang="ts"`，下游无需 TypeScript 即可构建（修复 #467）；Layout 注入逻辑切换到 `@sugarat/theme-shared` 的 `createSlotInjectPlugin`，兼容 VitePress 2.0.0-alpha.20+ 的 `<script setup>`（无 `lang` 属性）形态（修复 #469）；`vue` 加入 `peerDependencies`（组件运行时依赖）。
- Updated dependencies
  - @sugarat/theme-shared@0.1.0

## 0.1.5

### Patch Changes

- fix: 支持背景模糊时，修复悬停透明度过渡消失的问题

## 0.1.4

### Patch Changes

- style: 使评论按钮与返回顶部按钮样式保持一致
- feat: 新增悬浮按钮 `marginBottom`、`iconSize` 配置项（默认分别为 `40`、`20`）
- fix: 修复悬浮按钮背景误用相对颜色语法导致 `--vp-c-brand-soft` 透明度被覆盖、主题色下背景过深的问题

## 0.1.3

### Patch Changes

- fix: 修复 Safari/WebKit（iPhone）下图标不显示的问题

## 0.1.2

### Patch Changes

- fix: 修复初始化不显示评论区的bug，防止重复初始化并在卸载时断开 Observer

## 0.1.1

### Patch Changes

- fix: peerDependencies warn

## 0.1.0

### Minor Changes

- feat: init plugin
