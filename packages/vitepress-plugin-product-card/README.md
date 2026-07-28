# vitepress-plugin-product-card

在 VitePress 站点里通过 `::: card` markdown 容器语法快速渲染「产品/项目/作品」卡片，卡片可自动拉取 GitHub 仓库的创建时间与最后更新时间，并支持全局与单卡两级覆盖。

## 特性

- 零依赖 markdown-it 容器解析（`::: card`）
- 自带一个响应式 Vue 3 组件 `ProductCard`（客户端拉 GitHub API 自动展示创建/更新时间）
- 双入口：Node 侧引入 markdown 插件、Client 侧引入并注册 Vue 组件
- 全局默认 + 单卡覆盖：`showCreated` / `showUpdated`
- 支持 GitHub 图标：有时间时前置在时间行；无时间时以标签形式出现
- 深色模式友好（沿用 VitePress CSS 变量）

## 安装

```bash
pnpm add vitepress-plugin-product-card
```

## 使用

### 1. 注册 markdown 容器插件

`.vitepress/config.ts`：

```ts
import { defineConfig } from 'vitepress'
import { productCardMarkdownPlugin } from 'vitepress-plugin-product-card'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(productCardMarkdownPlugin, {
        // 可选：全局默认开关
        showCreated: true,
        showUpdated: true,
        // 可选：自定义组件名（默认 ProductCard）
        componentName: 'ProductCard'
      })
    }
  }
})
```

### 2. 注册 Vue 组件

`.vitepress/theme/index.ts`：

```ts
import DefaultTheme from 'vitepress/theme'
import { registerProductCard } from 'vitepress-plugin-product-card/client'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    registerProductCard(app)
    // 或自定义组件名：registerProductCard(app, 'MyCards')
  }
}
```

### 3. 在 markdown 中使用

```md
::: card 我的产品
- title: sugar-blog
  desc: 简约风的 VitePress 博客主题
  icon: 📝
  iconColor: '#42b883'
  link: https://theme.sugarat.top
  github: https://github.com/ATQQ/sugar-blog
  tags: [VitePress, Vue3, TypeScript]
----
- title: 关闭时间展示的卡片
  desc: 单卡覆盖全局默认
  github: https://github.com/some/repo
  showCreated: false
  showUpdated: false
:::
```

## 字段说明

| 字段 | 类型 | 说明 |
|---|---|---|
| `title` | `string` | 卡片标题（必填） |
| `desc` | `string` | 卡片描述，支持行内 markdown |
| `icon` | `string` | 图标：URL / 相对路径 → 渲染 `<img>`；否则渲染为字符 |
| `iconColor` | `string` | 字符 icon 的背景色（CSS 变量或 hex） |
| `link` | `string` | 点击标题跳转的地址 |
| `github` | `string` | GitHub 仓库地址，自动拉取创建/更新时间 |
| `tags` | `string[]` | 标签数组（可用 `["a", "b"]` 或 `a` 单值） |
| `showCreated` | `boolean` | 覆盖全局默认，是否展示创建时间 |
| `showUpdated` | `boolean` | 覆盖全局默认，是否展示最后更新时间 |

多张卡片之间使用 `----` 分隔。开头的 `- title:` 表示新卡片起始。

## 插件参数

```ts
interface CardContainerDefaults {
  /** 是否展示 GitHub 仓库创建时间，默认 true */
  showCreated?: boolean
  /** 是否展示 GitHub 仓库最后更新时间，默认 true */
  showUpdated?: boolean
  /** 输出 html_block 使用的组件名，默认 ProductCard */
  componentName?: string
}
```

## GitHub 图标行为

- 已展示时间行：GitHub 图标前置在时间行左侧，时间行整体作为链接跳转 GitHub 仓库；
- 未展示时间行（如 `showCreated: false` 且 `showUpdated: false`，或 API 拉取失败）：在标签行首自动追加一枚 `GitHub` 标签，点击跳转仓库。

## 关于 GitHub API 限流

组件通过匿名 `fetch` 访问 `https://api.github.com/repos/{owner}/{repo}`，未鉴权时限流约 60 次/小时。超限时静默失败，卡片仍然渲染，只是不显示时间信息。

## Peer Dependencies

- `vitepress`: `^1.0.0-0 || ^2.0.0-0`
- `vue`: `^3.3.0`

## License

MIT
