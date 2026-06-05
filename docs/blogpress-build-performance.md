# blogpress 构建耗时分析与优化报告

> 目标：分析 `packages/blogpress` 的生产构建（`pnpm build` → `vitepress build`）耗时分布，定位瓶颈并落地优化。

## 测量环境

| 项 | 值 |
|---|---|
| CPU / 内存 | 4 vCPU / 15 GB |
| Node | 22.14 |
| pnpm | 10.33 |
| Markdown 文件数 | 563 |
| VitePress | 2.0.0-alpha.17 |

## 测量方法

除使用 `pnpm build` 取总耗时外，还通过 VitePress 的编程式 `build()` API + 注入一个临时 Vite 计时插件，拿到 **阶段级**（client 打包 / server 打包 / 渲染 / sitemap / RSS / pagefind）的精确耗时。

VitePress build 流程：`bundle()`（先 client 后 server，**串行**）→ `rendering pages`（SSR 渲染所有页）→ `generateSitemap` → `buildEnd`（主题注入的 RSS + pagefind）。

## 基线（vite 5.4.19 / rollup）

- 首次冷构建（含 pnpm 开销）：`real 27.5s`
- 稳定构建：`build complete in 23.3s`

| 阶段 | 耗时 | 占比 |
|---|---|---|
| client 打包 (ssr=false) | 10.9s | 46% |
| server 打包 (ssr=true) | 6.1s | 26% |
| 渲染页面（SSR 563 页） | 3.6s | 15% |
| pagefind 索引 | ~2.0–3.6s | 9–15% |
| RSS（2 个 feed） | ~0.2s | <1% |
| sitemap | ~0.18s | <1% |

**结论：打包（client + server）≈ 17s，占 72%，是绝对瓶颈，且两次打包串行执行。**

## 优化：切换 rolldown-vite

VitePress `2.0.0-alpha.17` 已原生支持 [rolldown-vite](https://vite.dev/guide/rolldown)。落地内容：

1. 根 `package.json` 增加 pnpm override：`"vite": "npm:rolldown-vite@^7.3.1"`。
2. 增加 `oxc-minify` 依赖（rolldown 模式下 VitePress 要求）。
3. 修复主题插件兼容性（见下）。

### 必要的兼容性修复

主题 `@sugarat/theme` 的 `coverImgTransform` 插件在 `moduleParsed` 钩子中读取 `info.ast`，而该行原本位于 `try` 块**之外**。rolldown 不支持 `ModuleInfo#ast`，访问该 getter 会直接抛出 `UNSUPPORTED: ModuleInfo#ast` 导致构建失败。

修复方式：将 `const ast = info.ast` 移入 `try` 块（`packages/theme/src/utils/node/vitePlugins.ts`）。该函数本就内置了基于 `info.code` 的正则回退，抛错后会自动走回退，封面相对路径图片功能保持正常。

### 优化后耗时（rolldown-vite 7.3.1 / rolldownVersion 1.0.0-beta.53）

- `build complete in 18.02s`（`real 18.8s`）

| 阶段 | 基线 | rolldown-vite | 变化 |
|---|---|---|---|
| client 打包 | 10.9s | 8.5s | -22% |
| server 打包 | 6.1s | 2.9s | **-52%** |
| 打包合计 | 17.0s | 11.4s | **-33%** |
| 渲染页面 | 3.6s | 3.5s | 持平 |
| **总构建** | **23.3s** | **18.0s** | **约 -23%** |

## 后续可继续优化的方向（本次未实施）

1. **pagefind 索引按需化**（~2–3.5s，约 10%）：本地/预览构建可跳过中文搜索索引，仅正式发布构建执行。
2. **渲染并发 `buildConcurrency`**：4 核下渲染为 CPU 受限，收益有限。
3. **打包内容瘦身**：client 包是主成本来源（563 页 + 主题全量打包），可评估主题侧 `manualChunks` / `metaChunk` 策略，但侵入性较大、收益不确定，建议放在 rolldown 之后再评估。
