import BlogTheme from '@sugarat/theme'
import './theme.var.css'
import { h } from 'vue'
import Documate from '@documate/vue'
import ChangeThemeDemo from './ChangeThemeDemo.vue'
import JoinGroup from './JoinGroup.vue'
import '@documate/vue/dist/style.css'

export default {
  ...BlogTheme,
  Layout: h(BlogTheme.Layout, undefined, {
    'doc-before': () => h(JoinGroup),
    'doc-after': () => h(JoinGroup, { showImg: true }),
    'nav-bar-content-before': () => h(Documate, {
      endpoint: 'https://sfueei2j1g.us.aircode.run/ask',
    }),
  }),
  enhanceApp(ctx: any) {
    BlogTheme?.enhanceApp?.(ctx)
    ctx.app.component('ChangeThemeDemo', ChangeThemeDemo)
  }
}
