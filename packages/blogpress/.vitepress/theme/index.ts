import Theme from 'vitepress/theme'
// override style
import './index.scss'
// element-ui
import 'element-plus/dist/index.css'

import { h } from 'vue'
import Home from './src/components/home/index.vue'
import Comment from './src/components/comment.vue'

import { EnhanceAppContext } from 'vitepress'
import { injectKey as homeInjectKey } from './src/composables/home'

export default {
    ...Theme,
    Layout() {
        return h(Home, {});
    },
    enhanceApp: (ctx: EnhanceAppContext) => {
        ctx.app.provide(homeInjectKey, ctx.siteData.value.themeConfig.pagesData)
        ctx.app.component('comment', Comment)
    }
}