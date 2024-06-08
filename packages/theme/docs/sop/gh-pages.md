---
sticky: 2
description: 快速完成博客的发布部署到 GitHub/Gitee Pages。
tag:
 - SOP
---
# 使用 GitHub/Gitee Pages 部署博客

## Github Pages 部署

① Github Pages 开启 Git Actions 部署支持

![](https://img.cdn.sugarat.top/mdImg/sugar/8a2454c628d0e2abcc7a0451ddd7d2dc)

② 复制文件 `.github/workflows/deploy.yml` 到自己的项目相同目录下

:::details 示例 deploy.yml 文件
```yaml
name: Deploy Pages

# 触发条件，push到main分支或者pull request到main分支
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

  # 支持手动在工作流上触发
  workflow_dispatch:

# 设置时区
env:
  TZ: Asia/Shanghai

# 权限设置
permissions:
  # 允许读取仓库内容的权限。
  contents: read
  # 允许写入 GitHub Pages 的权限。
  pages: write
  # 允许写入 id-token 的权限。
  id-token: write

# 并发控制配置
concurrency:
  group: pages
  cancel-in-progress: false

# 定义执行任务
jobs:
  # 构建任务
  build:

    runs-on: ubuntu-latest

    # node v20 运行
    strategy:
      matrix:
        node-version: [20]

    steps:
      # 拉取代码
      - name: Checkout
        uses: actions/checkout@v3
        with:
          # 保留 Git 信息
          fetch-depth: 0

      # 设置使用 Node.js 版本
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      # 使用 最新的 PNPM
      # 你也可以指定为具体的版本
      - uses: pnpm/action-setup@v2
        name: Install pnpm
        with:
          version: latest
          # version: 9
          run_install: false

        # 安装依赖
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

        # 构建项目
      - name: Build blog project
        run: |
          echo ${{ github.workspace }}
          pnpm build

        # 资源拷贝
      - name: Build with Jekyll
        uses: actions/jekyll-build-pages@v1
        with:
          source: ./docs/.vitepress/dist
          destination: ./_site

        # 上传 _site 的资源，用于后续部署
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  # 部署任务
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
:::

示例项目已包含，可以直接进行下一步

③ 修改 `docs/.vitepress/config.mts` 里的构建配置

**如果项目名已经为 name.github.io 域名，则不需要修改，保持默认值 `/` 即可**

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
~~Gitee Pages 需要实名才能使用，同时需要人工审核。~~

**Gitee Pages 已经下线，无法使用咯**

**Gitee Pages 已经下线，无法使用咯**

**Gitee Pages 已经下线，无法使用咯**

① 按照 [SPA](https://help.gitee.com/services/gitee-pages/spa-support) 要求添加 `.spa` 文件在`docs/public` 目录下

示例项目已包含，可以直接进行下一步

② 参照 `Usage` 部分构建代码

③ 推送构建后的页面资源到部署文档的分支

例如`gh-pages`

④ 参照[文档](https://help.gitee.com/services/gitee-pages/intro)选择分支和目录进行部署
