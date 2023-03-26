# vitepress-plugin-pagefind

Offline full-text search based on [pagefind](https://github.com/cloudcannon/pagefind) implementation.

**similar UI as Algolia**

|                               Search Btn                                |                              Search Dialog                              |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTY3OTgxOTEzNjUwMw==679819136503) | ![](https://img.cdn.sugarat.top/mdImg/MTY3OTgxOTE1MDQ0OA==679819150448) |



## Usage

step1: install plugin
```sh
npm i vitepress-plugin-pagefind
# or
yarn add vitepress-plugin-pagefind
# or
pnpm add vitepress-plugin-pagefind
```

step2: import plugin

in `.vitepress/config.ts`
```ts
import { defineConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite:{
    plugins:[pagefindPlugin()],
  }
})

```

or in `vite.config.ts`
```ts
//vite.config.ts
import { pagefindPlugin } from "vitepress-plugin-pagefind";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [pagefindPlugin()],
});
```

## Options
```ts
interface SearchConfig {
  /**
   * @default
   * 'Search'
   */
  btnPlaceholder?: string
  /**
   * @default
   * 'Search Docs'
   */
  placeholder?: string
  /**
   * @default
   * 'No results found.'
   */
  emptyText?: string
  /**
   * @default
   * 'Total: {{searchResult}} search results.'
   */
  heading?: string
}
```

example
```ts
pagefindPlugin({
  btnPlaceholder: '搜索',
  placeholder: '搜索文档',
  emptyText: '空空如也',
  heading: '共: {{searchResult}} 条结果'
})
```
## Multi language support
Provided by [Pagefind](https://pagefind.app/docs/multilingual/#language-support)

## Thanks
Thanks to the following libraries for inspiration.

* [pagefind](https://github.com/cloudcannon/pagefind)
* [vitepress-plugin-search](https://github.com/emersonbottero/vitepress-plugin-search)
* [vue-command-palette](https://github.com/xiaoluoboding/vue-command-palette)
* [@sugarat/theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/theme)