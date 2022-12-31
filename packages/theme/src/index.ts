// override style
import './styles/index.scss'

// element-ui
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { Theme } from 'vitepress'
import BlogApp from './components/BlogApp.vue'
import { withConfigProvider } from './composables/config/blog'

export const BlogTheme: Theme = {
  Layout: withConfigProvider(BlogApp)
}

export * from './composables/config/index'
