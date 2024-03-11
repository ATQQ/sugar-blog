import type { EnhanceAppContext } from 'vitepress'
import BlogTheme from '@sugarat/theme'

// 全局组件
import redirectBtn from './src/components/redirectBtn.vue'
import Solve from './src/components/solve.vue'

const inBrowser = typeof window !== 'undefined'

export default {
  ...BlogTheme,
  enhanceApp: (ctx: EnhanceAppContext) => {
    const { app } = ctx
    BlogTheme?.enhanceApp?.(ctx)
    app.component('redirectBtn', redirectBtn)
    app.component('solve', Solve)

    if (inBrowser) {
      //  添加重定向逻辑，兼容旧版博客的分类和标签逻辑
      ctx.router.onBeforeRouteChange = (to) => {
        const url = new URL(to, window.location.origin)
        const pattern = /(categories|tag)\/(.*)\/$/
        if (pattern.test(url.pathname)) {
          const tagName = url.pathname.match(pattern)?.[2]
          if (tagName) {
            window.location.replace(
              `${window.location.origin}${ctx.router.route.path}?tag=${tagName}`
            )
          }
        }
      }
    }
  }
}
