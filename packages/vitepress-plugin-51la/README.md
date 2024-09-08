# vitepress-plugin-51la

[English](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-51la/README-en.md) | 简体中文

为 `VitePress` 站点引入 [51.la](https://v6.51.la/) 的网站数据统计能力。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/f0793f6be7da88ea7ccbfcccfef7aa9e)

## Usage
安装依赖 `pnpm/npm/yarn`
```sh
pnpm add vitepress-plugin-51la
```

引入插件在 `.vitepress/config.ts` 配置文件中

```ts
import { defineConfig } from 'vitepress'
import { La51Plugin } from 'vitepress-plugin-51la'

export default defineConfig({
  vite: {
    // ↓↓↓↓↓
    plugins: [
      La51Plugin({
        id: 'your-id',
        ck: 'your-ck'
      })
    ]
    // ↑↑↑↑↑
  }
})
```
构建后即可生效，自动向页面中注入[51.la](https://v6.51.la/)统计代码。

```sh
pnpm run build
```

## 更多用法
### 构建开发都生效
```ts
La51Plugin({
  id: 'your-id',
  ck: 'your-ck',
  apply: 'all'
})
```

### 异步引入
```ts
La51Plugin({
  id: 'your-id',
  ck: 'your-ck',
  importType: 'async'
})
```

## 完整配置
```ts
export interface LA51PluginOptions {
  /**
   * 动态掩码，防止 SDK 被盗刷
   */
  id: string
  /**
   * 一个网站多个统计 ID 的数据分离标识
   */
  ck: string
  /**
   * 引入方式
   * @default 'sync'
   * @doc 'sync' 同步加载，'async' 异步加载，'old' 旧式安装
   */
  importMode?: 'sync' | 'async' | 'old'
  /**
   * 生效阶段
   * @default 'build'
   * @doc 'build' 构建时生效，'serve' 开发时生效，'all' 所有阶段生效
   */
  apply?: 'build' | 'serve' | 'all'
  /**
   * 开启事件分析功能
   * @default false
   */
  autoTrack?: boolean
  /**
   * 使用单页面应用统计，如使用了Vue / React等框架构建的单页面应用网站
   * @default true
   */
  hashMode?: boolean
  /**
   * 屏幕录制
   * @default false
   */
  screenRecord?: boolean
  /**
   * 统计分析 SDK 地址
   * @default '//sdk.51.la/js-sdk-pro.min.js'
   */
  sdk?: string
  /**
   * 事件分析 SDK Prefix
   *
   * 默认和SDK同域根目录
   * 详细说明见 https://www.yuque.com/dvqnxr/ztsh8g/ysygdp#MK9RJ
   */
  prefix?: string
}
```