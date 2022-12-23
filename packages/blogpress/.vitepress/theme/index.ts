import Theme from 'vitepress/theme'
// override style
import './index.scss'

// element-ui
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { h, ref } from 'vue'
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
    const { app } = ctx
    app.provide(homeInjectKey, {
      docs: ctx.siteData.value.themeConfig.pagesData,
      activeTag: ref({
        label: '',
        type: ''
      })
    })
    app.component('comment', Comment)

  }
}
