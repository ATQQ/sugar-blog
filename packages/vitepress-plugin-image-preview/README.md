# vitepress-plugin-image-preview

[English](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-image-preview/README-en.md) | 简体中文


VitePress 图片预览插件，样式参考 [Element Plus Image Viewer](https://element-plus.org/zh-CN/component/image.html#image-preview)。

![图片预览](image.png)

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
| slots | 插槽 | `string \| string[]` | `['doc-before','page-top']` |
| showProgress | 是否在预览图片时显示进度条 | `boolean` | `true` |
| infinite | 是否开启无限循环 | `boolean` | `false` |
| zoomRatio | 缩放速率 | `number` | `1.2` |
| hideOnClickModal | 点击 modal 时是否隐藏 | `boolean` | `false` |
| minScale | 最小缩放比例 | `number` | `0.2` |
| maxScale | 最大缩放比例 | `number` | `7` |
| toolbar | 工具栏 | `string[]` | `['zoomOut', 'zoomIn','reset', 'rotateLeft', 'rotateRight', 'download']` |

## 高级用法

```ts
import { defineConfig } from 'vitepress'
import { ImagePreviewPlugin } from 'vitepress-plugin-image-preview'

export default defineConfig({
  vite: {
    plugins: [
      ImagePreviewPlugin({
        // 自定义图片选择器
        selector: '.content-container .main img',
        // 自定义监听容器 ID
        wrapperId: '#VPContent',
        // 显示进度条
        showProgress: true,
        // 开启无限循环
        infinite: true,
        // 点击遮罩关闭
        hideOnClickModal: true,
        // 自定义缩放比率
        zoomRatio: 1.1,
        // 自定义工具栏
        toolbar: ['zoomIn', 'zoomOut', 'reset', 'rotateLeft', 'rotateRight', 'download']
      })
    ]
  }
})
```

## 类型定义

```ts
export interface ImagePreviewOptions {
  /**
   * Image selector
   * @default '.content-container .main img,.VPPage img'
   */
  selector?: string
  /**
   * Wrapper selector to attach event listener
   * @default '#VPContent'
   */
  wrapperId?: string

  /**
   * Slots to attach event listener
   * @default ['doc-before','page-top']
   */
  slots?: string | string[]

  /**
   * Show progress bar | 是否在预览图片时显示进度条
   * @default true
   */
  showProgress?: boolean

  /**
   * Infinite loop | 是否开启无限循环
   * @default false
   */
  infinite?: boolean

  /**
   * Zoom ratio | 缩放速率
   * @default 1.2
   */
  zoomRatio?: number

  /**
   * Hide modal on click | 点击 modal 时是否隐藏
   * @default false
   */
  hideOnClickModal?: boolean

  /**
   * Minimum scale | 最小缩放比例
   * @default 0.2
   */
  minScale?: number

  /**
   * Maximum scale | 最大缩放比例
   * @default 7
   */
  maxScale?: number

  /**
   * Toolbar | 工具栏
   * @default ['zoomOut', 'zoomIn','reset', 'rotateLeft', 'rotateRight', 'download']
   */
  toolbar?: string[]
}
```