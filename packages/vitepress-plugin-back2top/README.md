# vitepress-plugin-back2top

[English](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-back2top/README-en.md) | 简体中文

VitePress 回到顶部插件，为页面添加一个回到顶部的按钮。

![示例](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-back2top/image.png?raw=true)

## 安装

```bash
pnpm add vitepress-plugin-back2top
```

## 使用

在 `.vitepress/config.ts` 中引入插件：

```ts
import { defineConfig } from 'vitepress'
import { back2topPlugin } from 'vitepress-plugin-back2top'

export default defineConfig({
  vite: {
    plugins: [
      back2topPlugin({
        // ...配置项
      })
    ]
  }
})
```

## Frontmatter 配置

你也可以在单篇文章的 `frontmatter` 中动态覆盖或关闭回到顶部配置：

```yaml
---
# 关闭回到顶部
backToTop: false
---

---
# 覆盖回到顶部配置
backToTop:
  top: 100
  icon: <svg>...</svg>
---
```

## 选项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| top | 距离顶部多少距离出现 | `number` | `450` |
| icon | 自定义 SVG 图标代码 | `string` | - |

## 类型定义

```ts
export interface BackToTopPluginOptions {
  /**
   * 距离顶部多少距离出现
   * @default 450
   */
  top?: number

  /**
   * 设置展示图标，svg
   * @recommend https://iconbuddy.app/search?q=fire
   */
  icon?: string
}
```
