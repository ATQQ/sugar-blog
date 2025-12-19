# vitepress-plugin-image-preview

VitePress 图片预览插件，样式参考 [Element Plus Image Viewer](https://element-plus.org/zh-CN/component/image.html)。

## 安装

```bash
pnpm add vitepress-plugin-image-preview
```

## 使用

在 `.vitepress/config.ts` 中引入插件：

```ts
import { defineConfig } from 'vitepress'
import { ImagePreviewPlugin } from 'vitepress-plugin-image-preview'

export default defineConfig({
  vite: {
    plugins: [
      ImagePreviewPlugin()
    ]
  }
})
```

## 选项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| selector | 图片选择器 | `string` | `.content-container .main img,.VPPage img` |
| wrapperId | 监听容器 ID | `string` | `#VPContent` |

## 示例

```ts
ImagePreviewPlugin({
  selector: '.my-content img',
  wrapperId: '#app'
})
```
