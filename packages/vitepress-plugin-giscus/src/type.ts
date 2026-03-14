export interface GiscusPluginOptions {
  repo: string
  repoId: string
  category?: string
  categoryId?: string
  mapping?: string
  inputPosition?: 'top' | 'bottom'
  lang?: string
  loading?: 'lazy' | 'eager'
  mobileMinify?: boolean
  label?: string
  icon?: string
  showCommentBtn?: boolean
  [key: string]: any
}
