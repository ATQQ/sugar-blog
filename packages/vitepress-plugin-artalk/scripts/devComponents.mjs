/**
 * 组件开发模式：mkdist 增量构建（watch）
 * 旧 watchAndCopy.mjs 只是原样复制 ts 版 .vue，已由 mkdist 转换（ts -> js + d.ts）替代
 */
import { watch } from 'chokidar'
import { mkdist } from 'mkdist'

let running = false
let pending = false

async function runMkdist() {
  if (running) {
    pending = true
    return
  }
  running = true
  try {
    await mkdist({
      cwd: process.cwd(),
      src: 'src',
      dist: 'dist',
      pattern: '**/*.{vue,ts,css}',
      declaration: true,
      format: 'esm'
    })
    console.log('[dev:component] mkdist done')
  } catch (error) {
    console.error('[dev:component] mkdist failed:', error)
  } finally {
    running = false
    if (pending) {
      pending = false
      runMkdist()
    }
  }
}

runMkdist()

watch(['src/**/*.vue', 'src/**/*.ts', 'src/**/*.css'], {
  ignoreInitial: true,
  awaitWriteFinish: true
}).on('all', runMkdist)
