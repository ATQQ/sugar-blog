# vitepress-plugin-announcement

## 0.1.10

### Patch Changes

- fix: 组件构建改为 `mkdist`（`.vue` 转纯 JS + 类型声明），发布产物不再包含 `lang="ts"`，下游无需 TypeScript 即可构建（修复 #467）；Layout 注入逻辑切换到 `@sugarat/theme-shared` 的 `createSlotInjectPlugin`，兼容 VitePress 2.0.0-alpha.20+ 的 `<script setup>`（无 `lang` 属性）形态（修复 #469）；`vue` 加入 `peerDependencies`（组件运行时依赖）。
- Updated dependencies
  - @sugarat/theme-shared@0.1.0

## 0.1.9

### Patch Changes

- fix: 修复 Safari/WebKit（iPhone）下图标不显示的问题

## 0.1.8

### Patch Changes

- fix: peerDependencies warn

## 0.1.7

### Patch Changes

- 4e56ed4: chore: clean deps
- feat: support image alt

## 0.1.7-beta.0

### Patch Changes

- chore: clean deps

## 0.1.6

### Patch Changes

- fix: peer deps warn

## 0.1.5

### Patch Changes

- fix: 关闭 图标 iOS 不渲染

## 0.1.4

### Patch Changes

- feat: `content` support markdown
- feat: support add `style` tag

## 0.1.3

### Patch Changes

- feat: support i18n

## 0.1.2

### Patch Changes

- feat: add default props

## 0.1.1

### Patch Changes

- fix: replace invalid CSS variable
- chore: add btn props type
- docs: add more examples

## 0.1.0

### Minor Changes

- feat: init plugin
