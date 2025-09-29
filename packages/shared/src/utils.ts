import { performance } from 'node:perf_hooks'
import process from 'node:process'

/**
 * process.env.DEBUG=true
 * @param flag
 */
export function debugTime(flag: string | number) {
  const start = performance.now()

  const end = () => {
    const result = performance.now() - start
    process.env.DEBUG && console.log(`[${flag}]`, result)
    return result
  }
  return end
}
