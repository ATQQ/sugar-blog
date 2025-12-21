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

## Example

```ts
ImagePreviewPlugin({
  selector: '.my-content img',
  wrapperId: '#app'
})
```
