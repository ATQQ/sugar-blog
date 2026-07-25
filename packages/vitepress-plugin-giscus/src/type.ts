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
  /**
   * 指定按钮距离屏幕下边缘的距离
   * @default 40
   */
  marginBottom?: number
  /**
   * 指定图标的大小
   * @default 20
   */
  iconSize?: number
  [key: string]: any
}
