export interface BackToTopPluginOptions {
  /**
   * 距离顶部多少距离出现
   * @default 450
   */
  top?: number

  /**
   * 设置展示图标，svg
   * @recommend https://iconbuddy.app/search?q=fire
   */
  icon?: string

  /**
   * 指定按钮距离屏幕下边缘的距离
   * @default 80
   */
  marginBottom?: number

  /**
   * 指定图标的大小
   * @default 20
   */
  iconSize?: number
}
