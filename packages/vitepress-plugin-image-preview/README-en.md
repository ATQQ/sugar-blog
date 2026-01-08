# vitepress-plugin-image-preview

VitePress Image Preview Plugin, style referenced from [Element Plus Image Viewer](https://element-plus.org/en-US/component/image.html).

## Install

```bash
pnpm add vitepress-plugin-image-preview
```

## Usage

Import the plugin in `.vitepress/config.ts`:

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

## Options

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| selector | Image selector | `string` | `.content-container .main img,.VPPage img` |
| wrapperId | Listener container ID | `string` | `#VPContent` |
| slots | Slots to attach event listener | `string \| string[]` | `['doc-before','page-top']` |
| showProgress | Show progress bar | `boolean` | `true` |
| infinite | Infinite loop | `boolean` | `false` |
| zoomRatio | Zoom ratio | `number` | `1.2` |
| hideOnClickModal | Hide modal on click | `boolean` | `false` |
| minScale | Minimum scale | `number` | `0.2` |
| maxScale | Maximum scale | `number` | `7` |
| toolbar | Toolbar | `string[]` | `['zoomOut', 'zoomIn','reset', 'rotateLeft', 'rotateRight', 'download']` |

## Advanced Usage

```ts
import { defineConfig } from 'vitepress'
import { ImagePreviewPlugin } from 'vitepress-plugin-image-preview'

export default defineConfig({
  vite: {
    plugins: [
      ImagePreviewPlugin({
        // Custom image selector
        selector: '.content-container .main img',
        // Custom wrapper id
        wrapperId: '#VPContent',
        // Show progress
        showProgress: true,
        // Enable infinite loop
        infinite: true,
        // Hide modal on click
        hideOnClickModal: true,
        // Custom zoom ratio
        zoomRatio: 1.1,
        // Custom toolbar
        toolbar: ['zoomIn', 'zoomOut', 'reset', 'rotateLeft', 'rotateRight', 'download']
      })
    ]
  }
})
```

## Type Definitions

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
