export interface ImagePreviewOptions {
  /**
   * Image selector
   * @default '.content-container .main img,.VPPage img'
   */
  selector?: string
  /**
   * Wrapper selector to attach event listener
   * @default '#VPContent'
   */
  wrapperId?: string

  /**
   * Slots to attach event listener
   * @default ['doc-before','page-top']
   */
  slots?: string | string[]

  /**
   * Show progress bar | 是否在预览图片时显示进度条
   * @default true
   */
  showProgress?: boolean

  /**
   * Infinite loop | 是否开启无限循环
   * @default false
   */
  infinite?: boolean

  /**
   * Zoom ratio | 缩放速率
   * @default 1.2
   */
  zoomRatio?: number

  /**
   * Hide modal on click | 点击 modal 时是否隐藏
   * @default false
   */
  hideOnClickModal?: boolean

  /**
   * Minimum scale | 最小缩放比例
   * @default 0.2
   */
  minScale?: number

  /**
   * Maximum scale | 最大缩放比例
   * @default 7
   */
  maxScale?: number

  /**
   * Toolbar | 工具栏
   * @default ['zoomOut', 'zoomIn','reset', 'rotateLeft', 'rotateRight', 'download']
   */
  toolbar?: string[]
}
