import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function isESM() {
  return typeof __filename === 'undefined' || typeof __dirname === 'undefined'
}
export function getDirname() {
  return isESM() ? path.dirname(fileURLToPath(import.meta.url)) : __dirname
}
