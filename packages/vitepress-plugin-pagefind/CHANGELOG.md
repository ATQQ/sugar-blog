# vitepress-plugin-pagefind

## 0.2.4

### Patch Changes

- feat: 支持自定义搜索结果过滤逻辑
- fix: 使用`srcDir`后，无搜索结果展示

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
