# @sugarat/theme-shared

## 0.1.0

### Minor Changes

- feat: 新增 `createSlotInjectPlugin` / `transformVitePressLayout` 工具，基于 `@vue/compiler-sfc` 结构化解析 VitePress 默认主题 `Layout.vue`，向 `<script setup>` 块与插槽位置注入组件 import/占位，不依赖 `<script setup lang="ts">` 标签格式（兼容 VitePress 1.x 与 2.x，含 alpha.20+），解析失败时回退宽松正则。同时支持自定义 import 路径与组件包装器（如 `ClientOnly`），并对重复注入做幂等处理。

## 0.0.7

### Patch Changes

- feat: rss 插件优化

## 0.0.6

### Patch Changes

- perf: reduce-build-time

## 0.0.5

### Patch Changes

- feat: `getVitePressPages` support VitePress 2.x

## 0.0.4

### Patch Changes

- feat: `getVitePressPages` support markdown env

## 0.0.3

### Patch Changes

- feat: add `getVitePressPages`,`renderDynamicMarkdown`

## 0.0.2

### Patch Changes

- fix(rss): support git submodule

## 0.0.1

### Patch Changes

- feat: init shared package
