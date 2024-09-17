import { onMounted, onUnmounted, ref } from 'vue'

const listDelimiterRE = /;(?![^(]*\))/g
const propertyDelimiterRE = /:([^]+)/
const styleCommentRE = /\/\*[^]*?\*\//g

export function parseStringStyle(cssText: string) {
  const ret: Record<string, string | number> = {}
  cssText.replace(styleCommentRE, '').split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE)
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim())
    }
  })
  return ret
}

export function useDebounceFn<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: any
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export const inBrowser = typeof document !== 'undefined'

export function useWindowSize() {
  const width = ref(Number.POSITIVE_INFINITY)
  const height = ref(Number.POSITIVE_INFINITY)
  const updateSize = useDebounceFn(() => {
    if (inBrowser) {
      width.value = window.innerWidth
      height.value = window.innerHeight
    }
  }, 100)

  onMounted(() => {
    if (inBrowser) {
      window.addEventListener('resize', updateSize, { passive: true })
    }
  })

  onUnmounted(() => {
    if (inBrowser) {
      window.removeEventListener('resize', updateSize)
    }
  })

  updateSize()
  return { width, height }
}
