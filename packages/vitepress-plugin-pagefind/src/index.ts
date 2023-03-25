import { Plugin } from 'vite'

export function pagefindPlugin(): Plugin {
  //   const virtualModuleId = 'virtual:pagefind'
  //   const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    name: 'vite-plugin-search',
    enforce: 'pre',
    config: () => ({
      resolve: {
        alias: {
          './VPNavBarSearch.vue': 'vitepress-plugin-pagefind/Search.vue'
        }
      }
    })

    // // eslint-disable-next-line consistent-return
    // async resolveId(id) {
    //   if (id === virtualModuleId) {
    //     return resolvedVirtualModuleId
    //   }
    // },
    // load(this, id) {
    //   if (id !== resolvedVirtualModuleId) return
    //   console.log(config)

    //   // eslint-disable-next-line consistent-return
    //   return `import('/_pagefind/pagefind.js')
    //   .then((module) => {
    //     window.__pagefind__ = module
    //   })
    //   .catch(() => {
    //     console.log('not load /_pagefind/pagefind.js')
    //   })`
    // }
  }
}
