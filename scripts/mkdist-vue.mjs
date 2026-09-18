/**
 * 仓库内 Vue 组件 mkdist 工具脚本。
 * 在包目录下调用；关闭 postcss/cssnano，避免压缩改写相对颜色、@supports、v-bind()。
 *
 * 用法（cwd 为包根目录）：
 *   node ../../scripts/mkdist-vue.mjs
 *   node ../../scripts/mkdist-vue.mjs --watch
 *   node ../../scripts/mkdist-vue.mjs --ext vue,ts,svg
 *   node ../../scripts/mkdist-vue.mjs --ext vue,ts,css,webp,png --legal-comments
 *   node ../../scripts/mkdist-vue.mjs --ignore index.ts
 *   node ../../scripts/mkdist-vue.mjs --ignore index.ts,client.ts,node.ts
 *
 * --ignore 的裸文件名只匹配 src 根目录，避免误伤 command-palette/index.ts 这类子入口。
 * 需要递归排除时写完整 glob（例如带前缀的 index.ts）。
 */
import { createRequire } from 'node:module'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)

function hasFlag(name) {
  return args.includes(`--${name}`)
}

function getFlag(name, fallback) {
  const index = args.indexOf(`--${name}`)
  if (index === -1 || !args[index + 1] || args[index + 1].startsWith('--')) {
    return fallback
  }
  return args[index + 1]
}

const watchMode = hasFlag('watch')
const legalComments = hasFlag('legal-comments')
const ext = getFlag('ext', 'vue,ts,css')
const ignore = getFlag('ignore', '')
  .split(',')
  .map(item => item.trim())
  .filter(Boolean)
const extList = ext.split(',').map(item => item.trim()).filter(Boolean)
const pattern = `**/*.{${extList.join(',')}}`
const watchGlobs = extList.map(item => `src/**/*.${item}`)

const pkgRequire = createRequire(`${process.cwd()}/package.json`)
const { mkdist } = await import(pathToFileURL(pkgRequire.resolve('mkdist')).href)

async function runOnce() {
  const { errors } = await mkdist({
    rootDir: process.cwd(),
    srcDir: 'src',
    distDir: 'dist',
    pattern,
    ...(ignore.length
      ? {
          globOptions: {
            ignore: ['**/node_modules', '**/coverage', '**/.git', ...ignore],
          },
        }
      : {}),
    declaration: true,
    format: 'esm',
    postcss: false,
    ...(legalComments
      ? { esbuild: { legalComments: 'inline' } }
      : {})
  })
  if (errors?.length) {
    for (const error of errors) {
      console.error(error)
    }
    throw new Error('mkdist failed')
  }
}

if (!watchMode) {
  await runOnce()
  process.exit(0)
}

const scriptRequire = createRequire(import.meta.url)
let chokidarPath
try {
  chokidarPath = scriptRequire.resolve('chokidar')
}
catch {
  chokidarPath = pkgRequire.resolve('chokidar')
}
const { watch } = await import(pathToFileURL(chokidarPath).href)

let running = false
let pending = false

async function runMkdist() {
  if (running) {
    pending = true
    return
  }
  running = true
  try {
    await runOnce()
    console.log('[mkdist-vue] done')
  }
  catch (error) {
    console.error('[mkdist-vue] failed:', error)
  }
  finally {
    running = false
    if (pending) {
      pending = false
      runMkdist()
    }
  }
}

await runMkdist()

watch(watchGlobs, {
  ignoreInitial: true,
  awaitWriteFinish: true
}).on('all', runMkdist)
