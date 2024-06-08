import type { PluginOption } from 'vite'
import type { SiteConfig } from 'vitepress'
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
        const meta = await getArticleMeta(path, route, blogConfig?.timeZone)
        const matched = blogConfig.pagesData.find(v => v.route === route)

        if (matched && !isEqual(matched.meta, meta, ['date', 'description'])) {
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
