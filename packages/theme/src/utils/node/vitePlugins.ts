import type { SiteConfig } from 'vitepress'
import path from 'path'
import { execSync } from 'child_process'
import type { Theme } from '../../composables/config/index'
import { genFeed } from './genFeed'

export function getVitePlugins(cfg?: Partial<Theme.BlogConfig>) {
  const plugins: any[] = []

  // Build完后运行的一系列列方法
  const buildEndFn: any[] = []
  // 执行自定义的 buildEnd 钩子
  plugins.push(inlineBuildEndPlugin(buildEndFn))

  // 内置简化版的pagefind
  if (
    cfg?.search === 'pagefind' ||
    (cfg?.search instanceof Object && cfg.search.mode === 'pagefind')
  ) {
    plugins.push(inlinePagefindPlugin(buildEndFn))
  }

  buildEndFn.push(genFeed)
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
    let command = `npx pagefind --source ${path.join(
      process.argv.slice(2)?.[1] || '.',
      '.vitepress/dist'
    )}`

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
          .filter((fn) => typeof fn === 'function')
          .forEach((fn) => fn(siteCfg))
      }
    }
  }
}
