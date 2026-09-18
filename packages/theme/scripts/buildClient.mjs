/**
 * 主题客户端 mkdist 构建。
 * esbuild.legalComments = inline，保留 index.ts 里的 replace 占位注释，
 * 供 vite 插件在下游注入 tabs / mermaid / timeline / group-icon。
 */
import { mkdist } from 'mkdist'

const { errors } = await mkdist({
  rootDir: process.cwd(),
  srcDir: 'src',
  distDir: 'dist',
  pattern: '**/*.{vue,ts,css,webp,png}',
  declaration: true,
  format: 'esm',
  esbuild: {
    legalComments: 'inline'
  },
  // 主题 CSS / 图片原样发布，不做 postcss 改写
  postcss: false
})

if (errors?.length) {
  for (const error of errors) {
    console.error(error)
  }
  process.exit(1)
}
