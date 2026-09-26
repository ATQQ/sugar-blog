import type { EnhanceAppContext } from 'vitepress'
import BlogTheme from '@sugarat/theme'
import CopyOrDownloadAsMarkdownButtons from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue'

// 覆盖「复制 / 下载 Markdown」按钮的默认样式
import './styles/markdown-copy-buttons.css'

// 全局组件
import redirectBtn from './src/components/redirectBtn.vue'
import Solve from './src/components/solve.vue'
import WechatCoverMaker from './src/components/WechatCoverMaker.vue'

const inBrowser = typeof window !== 'undefined'

export default {
  ...BlogTheme,
  enhanceApp: (ctx: EnhanceAppContext) => {
    const { app } = ctx
    BlogTheme?.enhanceApp?.(ctx)
    app.component('redirectBtn', redirectBtn)
    app.component('solve', Solve)
    app.component('WechatCoverMaker', WechatCoverMaker)
    // 页面「复制/下载 Markdown」按钮
    app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons)

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
