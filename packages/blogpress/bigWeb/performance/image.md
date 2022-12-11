---
isTimeLine: true
title: 图片优化
date: 2020-04-14
tags:
 - 大前端
 - 性能优化
categories:
 - 大前端
---
# 图片优化
## 加载优化
* 使用css替代部分图片
* 小屏幕:使用 CDN 加载，计算出适配屏幕的宽度，然后去请求相应裁剪好的图片
* 小图使用base64
* 雪碧图
* 图片格式选择
  * 能够显示 WebP 格式的浏览器使用 WebP 格式
  * 小图使用 PNG
  * 大部分图标使用 SVG 代替
  * 照片使用 JPEG

**生成base64方法**

```js
function getBase64URL(url, width, height) {
    return new Promise(resolve => {
        let img = new Image()
        let canvas = document.createElement("canvas");
        img.src = url
        img.onload = function () {
            canvas.width = width ? width : img.width;
            canvas.height = height ? height : img.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL())
        }
    })
}
```

[CodePen:示例](https://codepen.io/sugarInSoup/pen/GRJMERQ)

## 图片格式
### JPEG/JPG
* ``有损压缩``
* 体积小
* 加载快
* 不支持透明

**优点**
* 图片体积压缩至原有体积的 50% 以下时，JPG 仍然可以保持住 60% 的品质

**缺点**
* 不支持透明度处理
* 处理线条感较强、颜色对比强烈的图像时，图片模糊会很明显

**使用场景**

使用 JPG 呈现大图，既可以保住图片的质量，图片体积也不会太大
* 背景图
* 轮播图
* Banner图

### PNG-8 与 PNG-24
8 位的 PNG 最多支持 256 种颜色，而 24 位的可以呈现约 1600 万种颜色。
* 无损压缩
* 质量高
* 体积大
* 支持透明

**优点**
* 比 JPG 更强的色彩表现力
* 无损压缩
* 支持透明度

**缺点**
* 体积太大

**应用场景**
* 呈现小的 Logo、颜色简单且对比强烈的图片或背景等。

### SVG
* 文本文件
* 体积小
* 不失真
* 兼容性好

SVG（可缩放矢量图形）是一种基于 XML 语法的图像格式。它和本文提及的其它图片种类有着本质的不同：SVG 对图像的处理不是基于像素点，而是是基于对图像的形状描述。

**优点**
* 文件体积小
* 可压缩性强
* 可无限放大而不失真(矢量图)

**缺点**
* 渲染成本比较高
* 可编程(需要学习成本)

### Base64
* 文本文件
* 依赖编码
* 小图标解决方案

Base64 是一种用于传输 8Bit 字节码的编码方式，通过对图片进行 Base64 编码，我们可以直接将编码结果写入 HTML 或者写入 CSS，从而减少 HTTP 请求的次数

Base64 编码后，图片大小会膨胀为原文件的 4/3

在传输非常小的图片的时候，Base64 带来的文件体积膨胀、以及浏览器解析 Base64 的时间开销，与它节省掉的 HTTP 请求开销相比，可以忽略不计

**使用场景**
* 实际尺寸很小（不超过 2kb 的）
* 图片无法以雪碧图的形式与其它小图结合（合成雪碧图仍是主要的减少 HTTP 请求的途径，Base64 是雪碧图的补充）
* 图片的更新频率非常低（不需我们重复编码和修改文件内容，维护成本较低）

### WebP

* 支持透明
* 支持动态图片

**优点**

>与 PNG 相比，WebP 无损图像的尺寸缩小了 26％。在等效的 SSIM 质量指数下，WebP 有损图像比同类 JPEG 图像小 25-34％。 无损 WebP 支持透明度（也称为 alpha 通道），仅需 22％ 的额外字节。对于有损 RGB 压缩可接受的情况，有损 WebP 也支持透明度，与 PNG 相比，通常提供 3 倍的文件大小。

**缺点**
* 兼容性差
* 编码同样质量的 WebP 文件会占用更多的计算资源

