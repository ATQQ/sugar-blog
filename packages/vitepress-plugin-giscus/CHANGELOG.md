# vitepress-plugin-giscus

## 0.1.2

### Patch Changes

- fix: 修复 Safari/WebKit（iPhone）下图标不显示的问题

  - 文章页元信息图标（作者、时间、字数、阅读时间、标签）在 Safari 上不可见
  - Icon 组件及各插件统一为 v-html / slot 注入的 SVG 补充尺寸约束
  - 作品页、返回顶部、赞赏按钮等场景同步修复

## 0.1.1

### Patch Changes

- fix: peerDependencies warn

## 0.1.0

### Minor Changes

- feat: init plugin
