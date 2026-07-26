declare module 'virtual:pagefind' {
  export const searchConfig: import('../type').SearchConfig
}

declare interface Window {
  __pagefind__?: import('./pagefind').Pagefind
  PagefindUI?: typeof import('./pagefind').PagefindUI
  pagefindInitialized?: boolean
}
