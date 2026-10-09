import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// 固定命名的临时图片目录，会写入 .gitignore
const TEMP_DIR = '.img-temp'
// 默认扫描 markdown 的目标目录（可自定义：目录或单文件皆可）
const TARGET = process.argv[2] || path.join(ROOT, 'packages/blogpress')
// 匹配 markdown 图片语法: ![title](url) 或 ![title](url "optional")
const IMG_REG = /!\[[^\]]*\]\(([^()\s"]+)\)/gi

// 过滤出需要下载到本地的远程图片 URL
function collectRemoteUrlSrc(content) {
  const urls = new Set()
  for (const match of content.matchAll(IMG_REG)) {
    const url = match[1].replace(/^<|>$/g, '').trim()
    // 跳过本地相对/绝对路径图片
    if (/^(https?:)?\/\//i.test(url)) {
      urls.add(url)
    }
  }
  return [...urls]
}

// 根据图片 URL 生成一个相对安全的文件名，扩展名缺失时用 MIME 推断
const EXT_BY_MIME = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
}

async function fetchImage(url) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const ext = EXT_BY_MIME[res.headers.get('content-type')?.split(';')[0].trim()] || '.img'
  return { buf, ext }
}

function baselineName(url, index) {
  const clean = url.split('?')[0].split('/').filter(Boolean).pop() || `img-${index}`
  return clean.replace(/[^a-zA-Z0-9._-]/g, '-')
}

async function processMarkdown(filePath) {
  const content = await fs.readFile(filePath, 'utf-8')
  const urls = collectRemoteUrlSrc(content)
  if (urls.length === 0) {
    return { filePath, count: 0, files: [] }
  }

  const dir = path.join(path.dirname(filePath), TEMP_DIR)
  await fs.mkdir(dir, { recursive: true })

  // 按出现顺序补 0 的序号前缀，保证字典序与文中顺序一致
  const maxLen = String(urls.length).length
  const pad = n => String(n).padStart(maxLen, '0')

  const files = []
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    let base = `${pad(i + 1)}.${baselineName(url, i)}`
    const originalExt = base.match(/\.[a-zA-Z0-9]+$/)
    if (!originalExt) {
      base += `-${i}`
    }
    try {
      const { buf, ext } = await fetchImage(url)
      let name = `${base}${ext}`
      let n = 1
      while (files.includes(path.join(dir, name))) {
        name = `${base}-${n++}${ext}`
      }
      const dest = path.join(dir, name)
      await fs.writeFile(dest, buf)
      files.push(dest)
      console.log(`✓ ${path.relative(ROOT, dest)} <- ${url}`)
    }
    catch (e) {
      console.warn(`✗ 下载失败 ${url}: ${e.message}`)
    }
  }

  if (files.length > 0) {
    const relDir = path.relative(ROOT, dir).split(path.sep).join('/')
    await appendGitignore(relDir)
  }

  return { filePath, count: files.length, files }
}

async function appendGitignore(relDir) {
  const gitignore = path.join(ROOT, '.gitignore')
  let content = ''
  try {
    content = await fs.readFile(gitignore, 'utf-8')
  }
  catch {
    // .gitignore 不存在则新建
  }
  const rule = `/${relDir}/`
  if (content.split('\n').some(line => line.trim() === rule)) {
    return
  }
  await fs.appendFile(gitignore, `\n${rule}\n`)
}

async function walk(dir, results = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      // 跳过 node_modules 和 .git 等
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.vitepress') {
        continue
      }
      await walk(path.join(dir, entry.name), results)
    }
    else if (entry.name.endsWith('.md')) {
      results.push(path.join(dir, entry.name))
    }
  }
  return results
}

async function main() {
  const exists = await fs.stat(TARGET).then(() => true).catch(() => false)
  if (!exists) {
    console.error(`目标路径不存在: ${TARGET}`)
    process.exit(1)
  }

  const stat = await fs.stat(TARGET)
  let mdFiles
  if (stat.isDirectory()) {
    mdFiles = await walk(TARGET)
    console.log(`扫描到 ${mdFiles.length} 个 markdown 文件`)
  }
  else {
    mdFiles = [TARGET]
    console.log(`处理单个文件: ${TARGET}`)
  }

  let total = 0
  const failed = []
  for (const file of mdFiles) {
    const { count, filePath } = await processMarkdown(file)
    if (count > 0) {
      console.log(`\n${path.relative(ROOT, filePath)}: 提取 ${count} 张图片`)
    }
    total += count
  }

  console.log(`\n完成: 共提取 ${total} 张图片到 ${TEMP_DIR} 目录`)
  if (failed.length) {
    console.warn('失败列表:', failed)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
