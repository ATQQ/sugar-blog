# vitepress-plugin-pagefind

English | [简体中文](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-pagefind/README-zh.md)

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

**(optional)** step3: customSearchQuery

if your docs language（`lang`） is Chinese (`zh-`)

in `.vitepress/config.ts`，recommend import `chineseSearchOptimize` fun

```ts
import { defineConfig } from 'vitepress'
import { chineseSearchOptimize, pagefindPlugin } from 'vitepress-plugin-pagefind'

export default defineConfig({
  lang: 'zh-cn',
  vite: {
    plugins: [pagefindPlugin({
      customSearchQuery: chineseSearchOptimize
    })],
  },
})
```
see Example4 below for details

## Advanced Usage

### Example 1：custom search box text
```ts
pagefindPlugin({
  btnPlaceholder: '搜索',
  placeholder: '搜索文档',
  emptyText: '空空如也',
  heading: '共: {{searchResult}} 条结果'
})
```

### Example 2：exclude indexing some page elements
The main goal is to exclude public content from each article

```ts
pagefindPlugin({
  excludeSelector:['img','a.header-anchor']
})
```

### Example 3：Setting the force language option when indexing 
Different languages have different strategies for generating content index，more detail see [pagefind：multilingual](https://pagefind.app/docs/multilingual/#language-support) 

```ts
pagefindPlugin({
  forceLanguage:'zh-cn'
})
```

**recommend**：default use vitepress siteConfig `lang`
```ts
import { defineConfig } from 'vitepress'
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  // ...other config
  lang:'zh-cn',
  // ^^^^^^^^^
})
```
You can see the language used in the final build message.

like this below

![](https://img.cdn.sugarat.top/mdImg/MTY4MDkzNzI3MjQ3OQ==680937272479)

### Example 4：Search optimization

#### 4.1 input word optimization

[pagefind](https://pagefind.app/docs/multilingual/#specialized-languages) 目前对中文支持还不如英语完善，下面是官方的介绍

![](https://img.cdn.sugarat.top/mdImg/MTY4MDkzNzQ4NjYxMg==680937486612)

问题主要是自动分词这一块，咱们可以在搜索词的时候做一下优化，比如自动把搜索输入的内容拆成1个个的单字
```ts
pagefindPlugin({
  customSearchQuery(input){
    // 将搜索的每个中文单字两侧加上空格
    return input.replace(/[\u4e00-\u9fa5]/g, ' $& ')
    .replace(/\s+/g,' ')
    .trim();
  }
})
```

|                                 调整前                                  |                                 调整后                                  |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTY4MDkzODE4ODgwMQ==680938188801) | ![](https://img.cdn.sugarat.top/mdImg/MTY4MDkzODMzMzE1NA==680938333154) |

If you have a better implementation, welcome to share

#### 4.2 Search result optimization
You can turn off the built-in search results optimization

Implement it yourself using the `filter` method
```js
pagefindPlugin({
  resultOptimization: false,
  filter(searchItem, idx, originArray) {
    console.log(searchItem);
    return !searchItem.route.includes('404') 
  }
})
```
### Example 5: i18n
[pagefind](https://pagefind.app/docs/multisite/#merging-multiple-languages) search results will only contain content in the same language as the current page (distinguished by the lang attribute of the page)

Here is an example of how to configure the search box to display different text in different language pages

`.vitepress/config.ts`
```ts
export default defineConfig({
  // ...other config
  locales: {
    root: {
      lang: 'en',
      label: 'English'
    },
    zh: {
      lang: 'zh-cn',
      label: '简体中文',
    }
  },
  vite: {
    plugins: [pagefindPlugin(
      {
        locales: {
          root:{
            btnPlaceholder: 'Search',
            placeholder: 'Search Docs...',
            emptyText: 'No results',
            heading: 'Total: {{searchResult}} search results.',
          },
          zh: {
            btnPlaceholder: '搜索',
            placeholder: '搜索文档',
            emptyText: '空空如也',
            heading: '共: {{searchResult}} 条结果',
            // 搜索结果不展示最后修改日期日期
            showDate: false
          }
        }
      }
    )],
  }
})
```

|                                 English                                 |                                简体中文                                 |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTY4MTIyNjM1NzEyOQ==681226357129) | ![](https://img.cdn.sugarat.top/mdImg/MTY4MTIyNjMzNTU5Nw==681226335597) |


See options below for more details
## Options
TS DTS see [src/type.ts](./src/type.ts)

<details>
  <summary>show interface</summary>

  ```ts
interface PagefindOption {
  /**
   * Pass extra element selectors that Pagefind should ignore when indexing
   * @see https://pagefind.app/docs/config-options/#exclude-selectors
   * @default
   * ['div.aside' ,'a.header-anchor']
   */
  excludeSelector?: string[]
  /**
   * Ignores any detected languages and creates a single index for the entire site as the provided language.
   * Expects an ISO 639-1 code, such as en or zh.
   * @see https://pagefind.app/docs/config-options/#force-language
   */
  forceLanguage?: string
}

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

  /**
   * Automatically reloads the page when the page language changes.
   *
   * The purpose is to reload the index file for the target language.
   * @default true
   */
  langReload?: boolean
  /**
   * For some special languages.
   * Customize the conversion of user input
   * @see https://pagefind.app/docs/multilingual/#specialized-languages
   */
  customSearchQuery?: (input: string) => string
  /**
   * @default true
   */
  resultOptimization?: boolean
  /**
   * Customize the filtering schema
   */
  filter?: (searchItem: SearchItem, idx: number, array: SearchItem[]) => boolean
  /**
   * Search result Displays the date the document was last modified
   * @default true
   */
  showDate?: boolean
  /**
   * i18n
   */
  locales?: Record<string, Omit<SearchConfig, 'locales'>>
}
```
</details>

## Multi language support
Provided by [Pagefind](https://pagefind.app/docs/multilingual/#language-support)

## Thanks
Thanks to the following libraries for inspiration.

* [pagefind](https://github.com/cloudcannon/pagefind)
* [vitepress-plugin-search](https://github.com/emersonbottero/vitepress-plugin-search)
* [vue-command-palette](https://github.com/xiaoluoboding/vue-command-palette)
* [@sugarat/theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/theme)