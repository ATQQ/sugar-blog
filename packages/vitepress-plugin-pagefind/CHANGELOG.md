# vitepress-plugin-pagefind

## 0.3.3

### Patch Changes

- fix: dev pending and build failed

## 0.3.2

### Patch Changes

- chore: add peer deps

## 0.3.1

### Patch Changes

- chore: 搜索结果标题添加#

## 0.3.0

### Minor Changes

- feat: 支持过滤 `publish: false` 文章
- feat: 搜索框样式对齐 `vitepress local search`，支持展示更多的搜索内容
- feat: 移动端样式调整，展示更多的数据
- fix: 描述信息生成错误
- chore: 移除 `timeZone` 配置
- chore: 数据改用异步方式获取
- chore: 使用媒体查询替代 `useWindowSize`
- chore: 无关代码/依赖移除

## 0.2.14

### Patch Changes

- fix: Hydration error

## 0.2.13

### Patch Changes

- fix: 与其它库 build 时存在冲突

## 0.2.12

### Patch Changes

- chore: 补充meta中丢失的 frontmatter 数据

## 0.2.11

### Patch Changes

- fix: 鼠标移入抖动

## 0.2.10

### Patch Changes

- fix: setActiveLink

## 0.2.9

### Patch Changes

- fix: search modal style
- fix：not found Search.vue

## 0.2.8

### Patch Changes

- feat: 支持用户自定义生成索引的指令

## 0.2.7

### Patch Changes

- feat: update pagefind v1

## 0.2.6

### Patch Changes

- feat: 支持配置解析 `frontmatter` 的时区

## 0.2.5

### Patch Changes

- fix: 搜索默认情况下无法展示 index.md 内容

## 0.2.4

### Patch Changes

- feat: support `filter` function process search results
- fix: after use `srcDir`，result will empty

## 0.2.3

### Patch Changes

- fix: ctrl+k open browser search

## 0.2.2

### patch Changes

- feat: support i18n
- fix: support ctrl+k
- chore: readme error link

## 0.2.1

### patch Changes

- chore: get file timestamp use stdout replace output

## 0.2.0

### Minor Changes

- feat: support [custom index page lang](https://pagefind.app/docs/config-options/#force-language)
- feat: support customSearchQuery（The goal is to [optimize Chinese search](https://pagefind.app/docs/multilingual/#specialized-languages)）
- feat：support custom [excludeSelector](https://pagefind.app/docs/config-options/#exclude-selectors)
- fix: print warn not a git repository
- fix: the indexing text includes anchor points and sidebar content
- fix: after set base, will not have search info
- chore: use vitepress hook replace hack code

## 0.1.1

- fix: 全局 BG 色和 Vitepress 主题样式冲突

## 0.1.0

### Minor Changes

- feat: 从 [@sugarat/theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/theme) 主题分离独立的 pagefind 插件
