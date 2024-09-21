# vitepress-plugin-slot-inject-template

VitePress 组件注入插件模板，适用基于默认 Layout 拓展的场景。

<!-- 请按照实际情况修改 package.json 中的包相关描述信息 -->

*大部分需要修改的地方，在代码中都通过 `TODO` 进行了标记，请按实际情况修改。*

*默认插件作用是向页面底部注入 Hello 文案。*

![alt text](image.png)
## 使用
安装依赖 `pnpm/npm/yarn`
```sh
pnpm add vitepress-plugin-slot-inject-template
```

引入插件在 `.vitepress/config.ts` 配置文件中

```ts
import { defineConfig } from 'vitepress'
import { templatePlugin } from 'vitepress-plugin-slot-inject-template'

export default defineConfig({
  vite: {
    // ↓↓↓↓↓
    plugins: [
      templatePlugin({
        // ...options
      })
    ]
    // ↑↑↑↑↑
  }
})
```

## 更多用法
<!-- TODO 补充更多用法 -->

## 完整配置
<!-- 参数的 TS 类型定义 -->
```ts
export interface TemplatePluginOptions {
  title: string
  description?: string
  author?: string
}
```
