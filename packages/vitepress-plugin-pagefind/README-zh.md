# vitepress-plugin-pagefind

[English](./README.md) | 简体中文

基于[pagefind](https://github.com/cloudcannon/pagefind)实现的离线全文搜索插件

**UI 风格近似 Algolia**

|                               搜索按钮                                |                              搜索框                              |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTY3OTgxOTEzNjUwMw==679819136503) | ![](https://img.cdn.sugarat.top/mdImg/MTY3OTgxOTE1MDQ0OA==679819150448) |



## 如何使用

①: 安装插件
```sh
npm i vitepress-plugin-pagefind
# or
yarn add vitepress-plugin-pagefind
# or
pnpm add vitepress-plugin-pagefind
```

②: 引入插件

在 `.vitepress/config.ts` 引入插件（推荐）
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

当然也可以是在 `vite.config.ts`中引入
```ts
//vite.config.ts
import { pagefindPlugin } from "vitepress-plugin-pagefind";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [pagefindPlugin()],
});
```

**(可选)** ③: 搜索优化

如果你的文档主要内容是中文，推荐做以下设置，优化一下搜索

在配置中加入 `chineseSearchOptimize` 方法

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

详见下面的示例4了解为什么要这样做
## 高级用法

### 示例1：自定义搜素框文案
```ts
pagefindPlugin({
  btnPlaceholder: '搜索',
  placeholder: '搜索文档',
  emptyText: '空空如也',
  heading: '共: {{searchResult}} 条结果'
})
```

### 示例2：生成文章检索时排除一些元素
目的是避免检索到页面中的公共部分内容（比如全局弹窗，侧边栏，导航栏等等）

```ts
pagefindPlugin({
  excludeSelector:['img','a.header-anchor']
})
```

### 示例 3：设置检索内容的语言
不同的页面语言，pagefind 会使用不同的生成内容检索的策略，更多细节说明可以阅读 [pagefind：multilingual](https://pagefind.app/docs/multilingual/#language-support) 文档

```ts
pagefindPlugin({
  forceLanguage:'zh-cn'
})
```

**建议**：不设置的前提下，插件会默认使用 `vitepress` 配置中设置的 `lang` 值
```ts
import { defineConfig } from 'vitepress'
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  // ...其它配置
  lang:'zh-cn',
  // ^^^^^^^^^
})
```
你可以在构建信息中看到，最后使用的是哪一种检索策略

下图示例

![](https://img.cdn.sugarat.top/mdImg/MTY4MDkzNzI3MjQ3OQ==680937272479)

### 示例 4：搜索优化
#### 4.1 搜索词优化
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

如果你有更好的实现，欢迎分享

#### 4.2 搜索结果优化
可以关闭内置的搜索结果优化，使用`filter`方法自定义过滤行为

```js
pagefindPlugin({
  resultOptimization: false,
  filter(searchItem, idx, originArray) {
    console.log(searchItem);
    return !searchItem.route.includes('404') 
  }
})
```

### 示例 5: 国际化
[pagefind](https://pagefind.app/docs/multisite/#merging-multiple-languages) 搜索结果默认只会包含与当前页面语言一样的页面 (通过 `lang` 属性区分)

下面是一份配置，使搜索框在不同的语言页面下展示不同的文案

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

更多可配置的选项请查看下面的完整配置项

## 完整配置项如下
详细类型定义见文件 [src/type.ts](./src/type.ts)

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
   * 针对一些特殊的语言
   * 自定义用户输入内容的分词逻辑
   * @see https://pagefind.app/docs/multilingual/#specialized-languages
   */
  customSearchQuery?: (input: string) => string
  /**
   * 搜索结果优化
   * @default true
   */
  resultOptimization?: boolean
  /**
   * 自定义搜索结果过滤规则
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

## 开箱即用的多语言支持
由 [Pagefind](https://pagefind.app/docs/multilingual/#language-support)驱动

## 感谢
感谢下面的项目提供灵感

* [pagefind](https://github.com/cloudcannon/pagefind)
* [vitepress-plugin-search](https://github.com/emersonbottero/vitepress-plugin-search)
* [vue-command-palette](https://github.com/xiaoluoboding/vue-command-palette)
* [@sugarat/theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/theme)