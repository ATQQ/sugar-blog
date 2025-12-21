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
}
