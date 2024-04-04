import type Artalk, { ArtalkConfig } from 'artalk'

declare global {
  interface Window {
    Artalk: {
      init(options: Partial<ArtalkConfig>): Artalk
    }
  }
}

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const comp: ComponentOptions
  export default comp
}
