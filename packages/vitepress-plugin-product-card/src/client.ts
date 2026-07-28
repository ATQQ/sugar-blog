import type { App } from 'vue'
import ProductCard from './components/ProductCard.vue'

export { ProductCard }

export function registerProductCard(app: App, name = 'ProductCard') {
  app.component(name, ProductCard as any)
}
