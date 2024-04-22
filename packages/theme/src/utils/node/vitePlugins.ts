import path from 'node:path'
import { execSync, spawn } from 'node:child_process'
import process from 'node:process'
import fs, { existsSync, readFileSync } from 'node:fs'
import { Buffer } from 'node:buffer'
import type { Plugin, SiteConfig } from 'vitepress'

import {
  chineseSearchOptimize,
  pagefindPlugin
} from 'vitepress-plugin-pagefind'
import { RssPlugin } from 'vitepress-plugin-rss'
import type { Theme } from '../../composables/config/index'
import { _require } from './mdPlugins'
import { joinPath } from './index'

export function getVitePlugins(cfg?: Partial<Theme.BlogConfig>) {
  const plugins: any[] = []

  // Build完后运行的一系列列方法
  const buildEndFn: any[] = []
  // 执行自定义的 buildEnd 钩子
  plugins.push(inlineBuildEndPlugin(buildEndFn))
  // 处理cover image的路径（暂只支持自动识别的文章首图）
  plugins.push(coverImgTransform())
  // 处理新增md文档重启服务器
  plugins.push(observeMdfileAndRestartViteServer())
  // 内置简化版的pagefind
  if (cfg && cfg.search !== false) {
    const ops = cfg.search instanceof Object ? cfg.search : {}
    plugins.push(
      pagefindPlugin({
        ...ops,
        customSearchQuery: chineseSearchOptimize,
        filter(searchItem) {
          return searchItem.meta.publish !== false
        }
      })
    )
  }

  // 内置支持Mermaid
  if (cfg?.mermaid !== false) {
    const { MermaidPlugin } = _require('vitepress-plugin-mermaid')
    plugins.push(MermaidPlugin(cfg?.mermaid === true ? {} : (cfg?.mermaid ?? {})))
  }

  // 内置支持RSS
  if (cfg?.RSS) {
    plugins.push(RssPlugin(cfg.RSS))
  }
  // 未来移除使用
  // if (cfg && cfg.search !== undefined) {
  //   console.log(
  //     '已从内部移除 pagefind 支持，请单独安装 vitepress-plugin-pagefind 插件使用'
  //   )
  // }

  return plugins
}

export function registerVitePlugins(vpCfg: any, plugins: any[]) {
  vpCfg.vite = {
    plugins
  }
}

export function inlinePagefindPlugin(buildEndFn: any[]) {
  buildEndFn.push(() => {
    // 调用pagefind
    const ignore: string[] = [
      // 侧边栏内容
      'div.aside',
      // 标题锚点
      'a.header-anchor'
    ]
    const { log } = console
    log()
    log('=== pagefind: https://pagefind.app/ ===')
    const siteDir = path.join(
      process.argv.slice(2)?.[1] || '.',
      '.vitepress/dist'
    )
    let command = `npx pagefind --site ${siteDir} --output-subdir "_pagefind"`

    if (ignore.length) {
      command += ` --exclude-selectors "${ignore.join(', ')}"`
    }

    log(command)
    log()
    execSync(command, {
      stdio: 'inherit'
    })
  })
  return {
    name: '@sugarar/theme-plugin-pagefind',
    enforce: 'pre',
    // 添加检索的内容标识
    transform(code: string, id: string) {
      if (id.endsWith('theme-default/Layout.vue')) {
        return code.replace('<VPContent>', '<VPContent data-pagefind-body>')
      }
      return code
    }
  }
}

export function inlineBuildEndPlugin(buildEndFn: any[]) {
  let rewrite = false
  return {
    name: '@sugarar/theme-plugin-build-end',
    enforce: 'pre',
    configResolved(config: any) {
      // 避免重复定义
      if (rewrite) {
        return
      }
      const vitepressConfig: SiteConfig = config.vitepress
      if (!vitepressConfig) {
        return
      }
      rewrite = true
      // 添加 自定义 vitepress build 的钩子
      const selfBuildEnd = vitepressConfig.buildEnd
      vitepressConfig.buildEnd = (siteCfg) => {
        selfBuildEnd?.(siteCfg)
        buildEndFn
          .filter(fn => typeof fn === 'function')
          .forEach(fn => fn(siteCfg))
      }
    }
  }
}

// TODO: 支持frontmatter中的相对路径图片自动处理
export function coverImgTransform() {
  let blogConfig: Theme.BlogConfig
  let vitepressConfig: SiteConfig
  let assetsDir: string
  return {
    name: '@sugarat/theme-plugin-cover-transform',
    apply: 'build',
    enforce: 'pre',
    configResolved(config: any) {
      vitepressConfig = config.vitepress
      assetsDir = vitepressConfig.assetsDir
      blogConfig = config.vitepress.site.themeConfig.blog
    },
    async generateBundle(_: any, bundle: Record<string, any>) {
      const assetsMap = Object.entries(bundle).filter(([key]) => {
        return key.startsWith(assetsDir)
      }).map(([_, value]) => {
        return value
      })
      for (const page of blogConfig.pagesData) {
        const { cover } = page.meta
        // 是否相对路径引用
        if (!cover?.startsWith?.('/')) {
          continue
        }
        try {
          // 寻找构建后的
          const realPath = path.join(vitepressConfig.root, cover)
          if (!existsSync(realPath)) {
            continue
          }
          const fileBuffer = readFileSync(realPath)
          const matchAsset = assetsMap.find(v => Buffer.compare(fileBuffer, v.source) === 0)
          if (matchAsset) {
            page.meta.cover = joinPath('/', matchAsset.fileName)
          }
        }
        catch (e: any) {
          vitepressConfig.logger.warn(e?.message)
        }
      }
    }
  }
}

export function observeMdfileAndRestartViteServer(): Plugin {
  return {
    name: 'observe-md-and-restart-server',
    configureServer(server) {
      const folderPath = path.join(__dirname, '/docs')
      watchFolder(folderPath)
    }
  }
}

function watchFolder(folderPath: string) {
  fs.watch(folderPath, (eventType: string, filename: string | null) => {
    if (eventType === 'rename') {
      if (filename) {
        const filePath = path.join(folderPath, filename)
        if (isMarkdownfile(filePath)) {
          watchFile(filePath)
        }
      }
    }
  })
}

// 判断是否为markdown文件
function isMarkdownfile(filePath: string) {
  const extname = path.extname(filePath)
  return extname === '.md' || extname === '.markdown'
}

function watchFile(filePath: string) {
  fs.watchFile(filePath, (curr, prev) => {
    // 判断文件是否发生修改
    if (curr.mtime !== prev.mtime) {
      console.log(`文件内容发生了修改: ${filePath}`)
      readFile(filePath)
    }
  })
}

function readFile(filePath: string) {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(data)

    const hasTitle = /---\ntitle : .*\n---/.test(data)
    const hasHeading = /^# .*/.test(data)

    if (hasTitle) {
      console.log('文件包含 ---title---')
      restartViteServer()
    }
    else {
      console.log('文件不包含 ---title---')
    }

    if (hasHeading) {
      console.log('文件包含标题 #')
      restartViteServer()
    }
    else {
      console.log('文件不包含标题 #')
    }
  })
}

function restartViteServer() {
  const restartProcess = spawn('pnpm', ['run', 'dev'])

  restartProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  restartProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  restartProcess.on('close', (code) => {
    console.log(`服务启动发生错误，退出码： ${code}`)
  })
}
