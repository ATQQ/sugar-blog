---
description: 汇总使用过程中遇到的常见问题及解决方案
title: ❓ 常见问题
tag:
 - QA
---

# 常见问题解答

汇总了用户在使用 VitePress 和本主题过程中经常遇到的一些问题。

## 构建相关

### 1. 构建时报错 `Dead link found`

**现象：**
执行 `build` 命令时，控制台报错提示发现死链（Dead link），导致构建失败。

**原因：**
文档中存在无法访问的链接（通常是相对路径错误或引用了不存在的文件）。

**解决方案：**

1.  **修正链接**：根据报错信息找到对应的文件和行号，修正链接地址。
2.  **忽略死链**：如果链接确实存在（例如动态生成的），可以在 `.vitepress/config.ts` 中配置忽略死链。

```ts
export default defineConfig({
  // 忽略死链检查
  ignoreDeadLinks: true,
  // 或者使用正则/函数进行更细粒度的控制
  // ignoreDeadLinks: [
  //   // 忽略 localhost 链接
  //   /^https?:\/\/localhost/,
  //   // 忽略具体路径
  //   /\/path\/to\/ignore\//
  // ],
})
```

### 2. 样式丢失或错乱

**现象：**
开发环境正常，但打包部署后样式丢失，或者某些组件样式异常。

**原因：**
*   CSS 变量未正确定义。
*   使用了不兼容的 CSS 语法。
*   第三方库样式未引入。

**解决方案：**
*   检查 `.vitepress/theme/index.ts` 中是否正确引入了主题样式。
*   确保自定义样式没有覆盖关键的主题变量。
*   如果是部署在非根目录（如 GitHub Pages 的子路径），确保配置了正确的 `base` 路径。

```ts
// .vitepress/config.ts
export default defineConfig({
  base: '/repo-name/' // 如果部署在 https://username.github.io/repo-name/
})
```

## Markdown 相关

### 1. 为什么我的 HTML 标签没有渲染？

**现象：**
在 Markdown 中直接写的 HTML 标签被原样输出，没有被解析为 HTML 元素。

**原因：**
VitePress 默认支持在 Markdown 中混合使用 HTML，但某些标签或写法可能受限，或者被某些 Markdown 插件转义。

**解决方案：**
*   确保 HTML 标签闭合正确。
*   尽量使用 Vue 组件而非原生 HTML 标签来实现复杂交互。
*   检查是否在代码块中，代码块中的内容会被转义。

### 2. 数学公式不显示或显示为源码

**现象：**
在 Markdown 中使用 `$E=mc^2$` 语法，但页面显示为源码，未渲染成数学公式。

**原因：**
VitePress 的数学公式支持默认是关闭的。

**解决方案：**

安装依赖
```sh
add -D markdown-it-mathjax3@^4
```
在 `.vitepress/config.ts` 中开启 markdown 的 math 配置：
```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    math: true
  }
})
```

开启后：
*   行内公式：`$E=mc^2$` -> $E=mc^2$
*   块级公式：

```math
$\frac{1}{2\pi}\int_{-\infty}^{\infty}e^{-\frac{x^2}{2}}dx$
```

$\frac{1}{2\pi}\int_{-\infty}^{\infty}e^{-\frac{x^2}{2}}dx$


更多细节参考 [VitePress 官方文档 - 数学方程](https://vitepress.dev/zh/guide/markdown#math-equations)

### 3. Frontmatter 配置不生效

**现象：**
在 Markdown 文件顶部配置了 `layout: home` 或其他参数，但页面没有变化。

**原因：**
*   Frontmatter 格式错误（必须在文件最顶部，使用 `---` 包裹）。
*   缩进错误（YAML 对缩进敏感）。
*   使用了不支持的字段。

**解决方案：**
*   检查格式是否如下：

```yaml
---
layout: home
title: 首页
---
```

*   使用 VS Code 插件辅助检查 YAML 语法。

## 主题功能相关

### 1. 如何自定义首页布局？

**方案：**
主题支持通过插槽（Slots）扩展首页。参考 [Layout 插槽](./slots.md) 文档，使用 `home-hero-before`、`home-features-after` 等插槽插入自定义内容。

### 2. 如何修改主题色？

**方案：**
主题提供了多种内置主题色，也可以自定义。
在 `.vitepress/config.ts` 中配置 `themeColor`。

```ts
const blogTheme = getThemeConfig({
  themeColor: 'vp-green' // 或 'el-blue' 等
})
```

如果要完全自定义，可以在 `.vitepress/theme/style.css` 中覆盖 CSS 变量：

```css
:root {
  --vp-c-brand: #bd34fe;
  --vp-c-brand-light: #c55dfc;
  --vp-c-brand-dark: #a91ee4;
}
```

### 3. 搜索功能无法使用

**原因：**
*   未正确配置搜索提供商（Pagefind/Algolia/Local）。
*   构建后未生成索引文件。

**解决方案：**
*   如果使用 `pagefind`（默认），请确保在**构建后**（`pnpm build`）预览或部署才能看到效果，开发环境（`pnpm dev`）可能无法完全模拟。
*   检查 `config.ts` 中的 `search` 配置。

## 其它

### 1. 遇到 `ReferenceError: document is not defined` / `window is not defined`

**原因：**
VitePress 在构建时会进行服务端渲染（SSR），Node.js 环境中不存在 `window` 或 `document` 对象。代码在组件加载时直接访问了这些浏览器特有的 API。

**解决方案：**
*   将访问浏览器 API 的代码放入 `onMounted` 生命周期钩子中。
*   使用 `ClientOnly` 组件包裹仅在客户端渲染的组件。
*   判断环境：

```ts
if (typeof window !== 'undefined') {
  // 浏览器环境代码
}
```

### 2. 页面刷新后 404

**原因：**
部署在 SPA 模式下（如 Nginx），路由是前端路由，刷新时服务器找不到对应的 html 文件。

**解决方案：**
配置服务器（Nginx/Apache/Vercel等）将所有 404 请求重定向到 `index.html`。
或者开启 VitePress 的 `cleanUrls: false`（默认），生成带有 `.html` 后缀的链接。

---

如果以上没有覆盖您遇到的问题，欢迎在 [GitHub Issues](https://github.com/ATQQ/sugar-blog/issues) 提问。
