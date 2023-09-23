import BlogTheme from '@sugarat/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import './theme.var.css'
import { h } from 'vue'
import ChangeThemeDemo from './ChangeThemeDemo.vue'
import JoinGroup from './JoinGroup.vue'

export default {
  ...BlogTheme,
  Layout: h(BlogTheme.Layout, undefined, {
    'doc-before': h(JoinGroup),
    'doc-after': h(JoinGroup, { showImg: true })
  }),
  enhanceApp(ctx: any) {
    BlogTheme?.enhanceApp?.(ctx)
    enhanceAppWithTabs(ctx.app)
    ctx.app.component('ChangeThemeDemo', ChangeThemeDemo)
  }
}
