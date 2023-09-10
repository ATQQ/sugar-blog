import BlogTheme from '@sugarat/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import './theme.var.css'
import ChangeThemeDemo from './ChangeThemeDemo.vue'

export default {
  ...BlogTheme,
  enhanceApp(ctx: any) {
    BlogTheme?.enhanceApp?.(ctx)
    enhanceAppWithTabs(ctx.app)
    ctx.app.component('ChangeThemeDemo', ChangeThemeDemo)
  }
}
