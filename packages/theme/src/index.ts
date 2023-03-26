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

export const BlogTheme: Theme = {
  ...DefaultTheme,
  Layout: withConfigProvider(BlogApp),
  enhanceApp(ctx) {
    // TODO: 优化到自定义组件中注册
    ctx.app.component('TimelinePage', TimelinePage)
  }
}

export * from './composables/config/index'

export default BlogTheme
