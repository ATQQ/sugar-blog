import { execSync } from 'node:child_process'
import { withBase } from '@sugarat/theme-shared'
import type { SiteConfig } from 'vitepress'
import type { PagefindOption } from './type'

// 需要忽略检索的内容
const ignoreSelectors: string[] = [
  // 侧边栏内容
  'div.aside',
  // 标题锚点
  'a.header-anchor'
]

export async function buildEnd(pagefindOps: PagefindOption, siteConfig: SiteConfig) {
  const ignore = [
    ...new Set(ignoreSelectors.concat(pagefindOps?.excludeSelector || []))
  ]
  const { log } = console
  log()
  log('=== pagefind: https://pagefind.app/ ===')

  let command = `npx pagefind --site "${siteConfig.outDir}"`

  if (ignore.length) {
    command += ` --exclude-selectors "${ignore.join(', ')}"`
  }

  if (typeof pagefindOps.forceLanguage === 'string') {
    command += ` --force-language ${pagefindOps.forceLanguage}`
  }
  // 用户自定义指令
  if (pagefindOps.indexingCommand) {
    command = pagefindOps.indexingCommand
  }
  log(command)
  log()
  execSync(command, {
    stdio: 'inherit'
  })
}

export function getPagefindHead(base: string) {
  return [
    [
      'script',
      {},
      `import('${withBase(base || '', '/pagefind/pagefind.js')}')
  .then((module) => {
    window.__pagefind__ = module
    module.init()
  })
  .catch(() => {
    // console.log('not load /pagefind/pagefind.js')
  })`
    ]
  ]
}
export function chineseSearchOptimize(input: string) {
  return input
    .replace(/[\u4E00-\u9FA5]/g, ' $& ')
    .replace(/\s+/g, ' ')
    .trim()
}
