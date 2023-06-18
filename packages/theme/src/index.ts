// override style
import './styles/index.scss'

// element-ui
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BlogApp from './components/BlogApp.vue'
import { withConfigProvider } from './composables/config/blog'

// page
import TimelinePage from './components/TimelinePage.vue'
import UserWorksPage from './components/UserWorks.vue'

export const BlogTheme: Theme = {
  ...DefaultTheme,
  Layout: withConfigProvider(BlogApp),
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    // @ts-ignore
    ctx.app.component('TimelinePage', TimelinePage)
    ctx.app.component('UserWorksPage', UserWorksPage)
  }
}

export * from './composables/config/index'

export default BlogTheme
