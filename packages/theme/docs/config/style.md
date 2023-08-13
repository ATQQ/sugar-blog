---
description: 介绍一下自定义主题的部分样式
title: 🔧 主题配置 - 样式配置
readingTime: false
tag:
 - 配置
top: 3
recommend: 3
---

# 样式配置
样式自定义，参考[官方文档思路](https://vitepress.vuejs.org/guide/theme-introduction#customizing-css)

在 `.vitepress/theme/index.ts` 中引入自定义的样式文件，覆盖默认主题样式即可

例如:

博客模板里，提供了一个如下例子

```ts
// .vitepress/theme/index.ts [!code focus]
import BlogTheme from '@sugarat/theme'
// 自定义样式重载 // [!code focus]
import './style.scss' // [!code focus]

export default BlogTheme
```

里面有如下内容
```scss
.VPHome {
  // 自定义首页背景图
  &::before {
    // 图片来源：https://zhuanlan.zhihu.com/p/54060187
    background-image: url(./assets/bg.webp);
    background-size: cover;
  }
  // 定义遮罩样式
  background: radial-gradient(
    ellipse,
    rgba(var(--bg-gradient-home), 1) 0%,
    rgba(var(--bg-gradient-home), 0) 150%
  );
}
```
解除注释后，就能看到模板首页背景图发生了变化

![](https://img.cdn.sugarat.top/mdImg/MTY3Njk5MTAzODkzOQ==676991038939)

## 首页背景
```scss
.VPHome {// [!code focus]
  &::before {// [!code focus]
    background-image: url(./assets/bg.webp); // [!code focus]
    background-size: cover; // [!code focus]
  } // [!code focus]
} // [!code focus]

.VPHome {
  // 定义遮罩样式，控制图片展示的程度
  background: radial-gradient(
    ellipse,
    rgba(var(--bg-gradient-home), 1) 0%,
    rgba(var(--bg-gradient-home), 0) 150%
  );
}
```

## 置顶样式
可以自行修改置顶icon的样式
```scss
.blog-item .pin.pin::before {
  // 修改颜色
  background-image: linear-gradient(red, red);
}
```
![](https://img.cdn.sugarat.top/mdImg/MTY3NzA3OTExMjgxMA==677079112810)

```scss
// 隐藏置顶的icon
.blog-item .pin.pin::before {
  display: none;
}
```
![](https://img.cdn.sugarat.top/mdImg/MTY3NzA3OTIwODAzNg==677079208036)


## 主题色
vitepress 最新的默认主题色偏紫色，看着感觉有点不习惯

![](https://img.cdn.sugarat.top/mdImg/MTY5MTkyODQ0ODUzOQ==691928448539)

可以默认将其还原了为之前的绿色

绿色主题的代码如下

`.vitepress/theme/green-theme.var.css`

```css
:root{
  /* 使用之前的绿色主题，重写当前紫色的 */
  /* 所有变量：https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css */
  --vp-c-brand: var(--vp-c-green);
  --vp-c-brand-light: var(--vp-c-green-light);
  --vp-c-brand-lighter: var(--vp-c-green-lighter);
  --vp-c-brand-dark: var(--vp-c-green-dark);
  --vp-c-brand-darker: var(--vp-c-green-darker);
  --vp-c-brand-dimm-1: var(--vp-c-green-dimm-1);
  --vp-c-brand-dimm-2: var(--vp-c-green-dimm-2);
  --vp-c-brand-dimm-3: var(--vp-c-green-dimm-3);
  --vp-c-brand-text: var(--vp-c-green);
}
```
将其引入到`.vitepress/theme/index.ts`中即可

```ts
import BlogTheme from '@sugarat/theme'
// 导入绿色主题
import './green-theme.var.css'

export default BlogTheme
```

## More
... wait a moment