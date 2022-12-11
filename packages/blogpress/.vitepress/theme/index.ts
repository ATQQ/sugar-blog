import Theme from 'vitepress/theme'
// override style
import './index.scss'
// element-ui
import 'element-plus/dist/index.css'

import { h } from 'vue'
import { EnhanceAppContext } from 'vitepress'
import Home from './src/components/home/index.vue'
import Comment from './src/components/comment.vue'

import { injectKey as homeInjectKey, useHomeData } from './src/composables/home'

export default {
  ...Theme,
  Layout() {
    return h(Home, {})
  },
  enhanceApp: (ctx: EnhanceAppContext) => {
    const { app, router } = ctx
    app.provide(homeInjectKey, ctx.siteData.value.themeConfig.pagesData)
    app.component('comment', Comment)

    router.onBeforeRouteChange = (to: string) => {
      const url = new URL(to)
      console.log(url.pathname)

      const isREADMERoute = ctx.siteData.value.themeConfig.pagesData?.find(
        (v) => {
          return `/${v.route}` === `${url.pathname}README`
        }
      )
      if (to.endsWith('/') && isREADMERoute) {
        location.replace(`/${isREADMERoute.route}`)
      }
    }
  }
}
