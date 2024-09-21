---
# cover: https://cdn.upyun.sugarat.top/mdImg/sugar/7af94a65e3b4dd05e61e3411daba7fdd
description: 开发了一个适用于 VitePress 的公告插件 vitepress-plugin-announcement
---

# VitePress 的公告插件开发实记

## 前言
笔者维护的 [VitePress 博客主题](https://theme.sugarat.top/)在近1年多的时间里集成了非常多功能，不少用户希望将里面的部分功能分离出来，方便在其它 VitePress 站点也可以独立使用。

分离的 [公告插件](https://www.npmjs.com/package/vitepress-plugin-announcement)，效果如下：

![](https://cdn.upyun.sugarat.top/mdImg/sugar/a588c971f6cea84e44d9316a25130510)

接下来将介绍一下用法，讲解一下实现原理，提供一个插件模板供大家快速开发同类型插件。

## 如何使用
*只需要 2 步：*

1. 安装插件

`pnpm/npm/yarn` 均可，笔者比较偏好 `pnpm`

```sh
pnpm add vitepress-plugin-announcement
```

2. 配置插件

引入插件在 `.vitepress/config.ts` VitePress 配置文件中

```ts
import { defineConfig } from 'vitepress'
import { AnnouncementPlugin } from 'vitepress-plugin-announcement'

export default defineConfig({
  vite: {
    // ↓↓↓↓↓
    plugins: [
      AnnouncementPlugin({
        title: '标题',
        body: [
          { type: 'text', content: '文本内容' },
          {
            type: 'image',
            src: '图片'
          }
        ],
        footer: [
          {
            type: 'button',
            content: '按钮',
            link: 'https://sugarat.top'
          },
        ],
      })
    ]
    // ↑↑↑↑↑
  }
})
```
目前支持 `文本/图片/按钮` 三种类型。

## 实现原理
*这里只阐述关键点，详细部分将计划单独拆一篇文章进行讲解（完整的搭配插件模板 0 - 1 实现）*

### 注入自定义组件

在 [VitePress 官方文档自定义板块](https://vitepress.dev/zh/guide/custom-theme) 中可以了解到，

![](https://cdn.upyun.sugarat.top/mdImg/sugar/f11bda8aaa31da7306d25f276851825b)

VitePress 入口的组件是在 `.vitepress/theme/index` 中导出的 `Layout.vue` 组件。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/24b83aaedbc9d4aeaec2832233ac0682)

同时 VitePress 默认主题的 Layout 已经提供了许多[可以直接使用的插槽](https://vitepress.dev/zh/guide/extending-default-theme#layout-slots)，于是乎，咱们可以把组件直接放入这些位置即可。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/1b8654d5b94215b90faa0697837d323a)

VitePress 是由 Vite 驱动，所以按照 [Vite 插件](https://cn.vitejs.dev/guide/api-plugin.html#plugin-api)的思路去拓展即可。

这里利用插件的 [transform 钩子](https://cn.rollupjs.org/plugin-development/#transform) 去处理。

```ts
const pluginOps = {
  name: 'vitepress-plugin-announcement',
  transform(code, id) {
    // 具体处理逻辑
  }
}
```

将我们的组件插入到[默认主题的 Layout.vue](https://github.com/ATQQ/vitepress/blob/30c665b29d419c1b5057222743e5394e7260b809/src/client/theme-default/Layout.vue) 里即可。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/b224510bb3ae435f19803bc4b1b6c71f)

期望插入后的代码如下
```vue
<script setup lang="ts">
import Announcement from './Announcement.vue' // [!code ++]
</script>

<template>
  <div>
    <slot name="layout-top" />
    <Announcement /> // [!code ++]
  </div>
</template>
```

下面是具体的处理逻辑，简单字符串替换插入我们需要的内容即可

```ts
const pluginOps = {
  name: 'vitepress-plugin-announcement',
  enforce: 'pre',
  transform(code, id) {
    // 筛选出 Layout 文件
    if (id.endsWith('vitepress/dist/client/theme-default/Layout.vue')) {
      // 插入自定义组件调用代码
      const slotPosition = '<slot name="layout-top" />'
      let transformResult = code.replace(slotPosition, `${slotPosition}<Announcement/>`)

      // 导入自定义组件导入代码
      const setupPosition = '<script setup lang="ts">'
      transformResult = transformResult.replace(setupPosition, `${setupPosition}\nimport Announcement from './Announcement.vue'`)
      return transformResult
    }
  }
}
```

同时通过 [enforce](https://cn.vitejs.dev/guide/api-plugin.html#plugin-ordering) 参数控制插件顺序，这里需要尽可能的提前执行，处理源代码。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/baa052b4c71a2bef35102bcbc772823f)

接下来就是处理 `import` 的导入，如果不做处理，`Layout.vue` 里是找不到这些组件，就一定会报错。
```ts
import Announcement from './Announcement.vue' // [!code ++]
```

于是这里，再利用 [config 钩子](https://cn.vitejs.dev/guide/api-plugin.html#config)，传入 [resolve.alias 配置](https://cn.vitejs.dev/config/shared-options.html#resolve-alias) 即可。

```ts
// 构造插件里实际组件的路径
const aliasComponentFile = `${getDirname()}/components/Announcement.vue`

const pluginOps = {
  config() {
    return {
      resolve: {
        alias: {
          './Announcement.vue': aliasComponentFile
        }
      }
    }
  }
}
```

至此自定义组件的注入就算是完成了，接下来介绍如何将外部的参数传入到组件里。

### 插件配置传递
方式有很多种，笔者这里采用改动最小，使用较为广泛的一种 [虚拟模块](https://cn.vitejs.dev/guide/api-plugin.html#virtual-modules-convention) 。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/788388654dbcd652581f791a5fed243d)

*官方示例里已经介绍了如何使用，这里不做赘述。*

组件中导入配置代码
```vue
<script lang="ts" setup>
import announcementOptions from 'virtual:announcement-options'
</script>
```

插件中处理虚拟模块逻辑。

```ts
import { stringify } from 'javascript-stringify'

function AnnouncementPlugin(options) {
  const virtualModuleId = 'virtual:announcement-options'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  const pluginOps = {
    name: 'vitepress-plugin-announcement',
    enforce: 'pre',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(this, id) {
      if (id === resolvedVirtualModuleId) {
        // 虚拟模块处理
        return `export default ${stringify(options)}`
      }
    },
  }
  return pluginOps
}
```

tips：由于 JSON.stringify 默认不会处理函数，这里就偷懒用一下社区的库 [javascript-stringify](https://www.npmjs.com/package/javascript-stringify) 进行处理。

*如果要用 JSON.stringify 处理，需要传入第二个 `replacer` 参数，对函数做特殊处理。*

至此，关键的两步就算搞定了，剩余的工作就是具体组件的样式和交互实现开发了，按常规 Vue 组件开发即可。

## 插件模板介绍
在开发插件的过程中，笔者把此类基于 slot 位置注入的插件分离了一个模板 [vitepress-plugin-slot-inject-template](https://github.com/ATQQ/sugar-blog/tree/master/template/vitepress-plugin-slot-inject-template)

### 目录结构
```sh
├── scripts # 构建相关脚本，无特殊需求可以不用修改
|  ├── copyComponents.mjs
|  └── watchAndCopy.mjs
├── src
|  ├── components # 组件实现
|  ├── index.ts # 插件入口
|  ├── type.ts # 插件配置参数类型定义
|  └── util.ts # 插件使用的工具函数
├── README.md
├── package.json
└── tsconfig.json
```
参考了 VitePress 默认主题中部分实现。

### 使用步骤
1. 插件入口 `src/index.ts`，修改一下插件&组件命名信息和组件插入位置。
2. 按照实际需求编写组件实现。
3. 完善 README.md 使用文档后发布 npm 包即可。

## 最后
>样式实现参考了 [reco-1.x 主题](https://github.com/vuepress-reco/vuepress-theme-reco-1.x) 中的 [@vuepress-reco/vuepress-plugin-bulletin-popover](https://github.com/vuepress-reco/vuepress-theme-reco-1.x/tree/master/packages/%40vuepress-reco/vuepress-plugin-bulletin-popover) 插件

后续继续按照 [vitepress 插件开发计划](https://sugarat.top/essay/dev/vitepress-plugins.html) 推进，将开发过程内容整理成教程与插件模板。

插件完整源码 [vitepress-plugin-announcement](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-announcement)