<h1 align="center"> VitePress @sugarat/theme </h1>

<p align="center">
简约风的 <a href="https://theme.sugarat.top"  target="_blank"target="_blank">VitePress 博客主题</a> 示例运行项目。
</p>

<p align="center">
    <a href="https://atqq.github.io/vitepress-blog-sugar-template/" target="_blank">GitHub Pages Demo</a>
</p>

## Usage

先安装 `pnpm`

```sh
npm i -g pnpm
```

安装依赖

```sh
pnpm install
```

开发启动

```sh
pnpm dev
```

构建

```sh
pnpm build
```

预览产物

```sh
pnpm serve
```

## Github Pages 部署

① Github Pages 开启 Git Actions 部署支持

![](https://img.cdn.sugarat.top/mdImg/sugar/8a2454c628d0e2abcc7a0451ddd7d2dc)

② 复制文件 `.github/workflows/deploy.yml` 到自己的项目相同目录下

示例项目已包含，可以直接进行下一步

③ 修改 `docs/.vitepress/config.mts` 里的构建配置

`base` 改为 `"/仓库名/"` 即可

```ts
// 省略无关代码
const base = '/vitepress-blog-sugar-template/'
export default defineConfig({
  base,
})
```

④ 推送 `main` 分支即可

需要进一步修改部署和构建配置，详见`deploy.yml` 文件。

## Gitee Pages 部署

① 按照 [SPA](https://help.gitee.com/services/gitee-pages/spa-support) 要求添加 `.spa` 文件在`docs/public` 目录下

示例项目已包含，可以直接进行下一步

② 参照 `Usage` 部分构建代码

③ 推送构建后的页面资源到部署文档的分支

例如`gh-pages`

④ 参照[文档](https://help.gitee.com/services/gitee-pages/intro)选择分支和目录进行部署

*Gitee Pages 需要实名才能使用，同时需要人工审核。*
