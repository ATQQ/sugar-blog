import fs from 'fs'
import type { PluginOption } from 'vite'
import type { SiteConfig } from 'vitepress'
import { grayMatter } from '@sugarat/theme-shared'
import type { Theme } from '../../composables/config/index'
import { getArticleMeta } from './theme'
import { debounce, isEqual } from './index'

export function themeReloadPlugin() {
  let blogConfig: Theme.BlogConfig
  let vitepressConfig: SiteConfig
  let docsDir: string

  const generateRoute = (filepath: string) => {
    return filepath.replace(docsDir, '').replace('.md', '')
  }

  return {
    name: '@sugarat/theme-reload',
    apply: 'serve',
    configureServer(server) {
      const restart = debounce(() => {
        server.restart()
      }, 500)
      server.watcher.on('add', async (path) => {
        // TODO: rewrite 和 动态路由兼容
        const route = generateRoute(path)
        const meta = await getArticleMeta(path, route, blogConfig?.timeZone)
        blogConfig.pagesData.push({
          route,
          meta
        })
        restart()
      })

      server.watcher.on('change', async (path: string) => {
        const route = generateRoute(path)
        const fileContent = await fs.promises.readFile(path, 'utf-8')
        const { data: frontmatter } = grayMatter(fileContent, {
          excerpt: true,
        })
        const meta = await getArticleMeta(path, route, blogConfig?.timeZone)
        const matched = blogConfig.pagesData.find(v => v.route === route)

        // 自动生成的部分属性不参与比较，避免刷新频繁
        const excludeKeys = ['date', 'description'].filter(key => !frontmatter[key])
        // 主题不关心的属性不参与比较，避免刷新频繁
        const inlineKeys = [
          // vitepress 默认主题 https://vitepress.dev/zh/reference/frontmatter-config
          'lang',
          'outline',
          'head',
          'layout',
          'hero',
          'features',
          'navbar',
          'sidebar',
          'aside',
          'lastUpdated',
          'editLink',
          'footer',
          'pageClass',
          // 本主题扩展 https://theme.sugarat.top/config/frontmatter.html
          'hiddenCover',
          'readingTime',
          'buttonAfterArticle'
        ]
        if (matched && !isEqual(matched.meta, meta, inlineKeys.concat(excludeKeys))) {
          matched.meta = meta
          restart()
        }
      })

      server.watcher.on('unlink', (path) => {
        const route = generateRoute(path)
        const idx = blogConfig.pagesData.findIndex(v => v.route === route)
        if (idx >= 0) {
          blogConfig.pagesData.splice(idx, 1)
          restart()
        }
      })
    },
    configResolved(config: any) {
      vitepressConfig = config.vitepress
      docsDir = vitepressConfig.srcDir
      blogConfig = config.vitepress.site.themeConfig.blog
    },
  } as PluginOption
}
