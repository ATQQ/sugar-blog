/**
 * 生成对 Node 友好的 SSR 入口：dist/index.node.mjs
 *
 * 背景：0.5.28 起主题入口从 src/index.ts（源码）改为 dist/index.mjs（产物）。
 * 产物中的裸 CSS 导入（import './styles/index.css'）在 SSR 构建被 externalize 时，
 * 会在渲染阶段被 Node 原生加载，触发 ERR_UNKNOWN_FILE_EXTENSION ".css"。
 *
 * 本脚本从 dist/index.mjs 派生一份去掉裸 CSS 导入的 index.node.mjs，
 * 配合 package.json exports 的 "node" 条件，让 Node/SSR 侧解析到无 CSS 的入口；
 * 客户端构建不受影响，仍然通过 index.mjs 加载全部样式。
 *
 * 用法（cwd 为包根目录）：
 *   node ./scripts/strip-node-entry.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sourcePath = resolve(process.cwd(), 'dist/index.mjs')
const targetPath = resolve(process.cwd(), 'dist/index.node.mjs')

if (!existsSync(sourcePath)) {
  console.warn('[strip-node-entry] dist/index.mjs 不存在，跳过（请先执行 mkdist 构建）')
  process.exit(0)
}

const code = readFileSync(sourcePath, 'utf8')
// 仅剔除顶层的裸 CSS 导入（import './xxx.css'; / import "./xxx.css";）
const stripped = code.replace(
  /^[ \t]*import\s+["'][^"']+\.css["'];?[ \t]*\r?\n?/gm,
  ''
)

if (stripped === code) {
  console.warn('[strip-node-entry] 未发现需要剔除的 CSS 导入，仍生成副本以保持导出一致')
}

writeFileSync(targetPath, stripped)
console.log(`[strip-node-entry] 已生成 ${targetPath}`)
