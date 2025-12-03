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

/**
 * URL 规范化函数，移除多余的斜杠（保留协议的双斜杠）
 * @param url - 待规范化的 URL
 * @returns 规范化后的 URL
 * @example
 * normalizeUrl('https://example.com/test//rss.xml') // 'https://example.com/test/rss.xml'
 */
export function normalizeUrl(url: string): string {
  return url.replace(/([^:]\/)\/+/g, '$1')
}
