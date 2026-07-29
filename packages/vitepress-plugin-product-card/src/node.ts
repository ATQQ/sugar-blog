import type MarkdownIt from 'markdown-it'

interface CardItem {
  icon?: string
  iconColor?: string
  title?: string
  link?: string
  github?: string
  tags?: string[]
  desc?: string
  descHtml?: string
  showCreated?: boolean
  showUpdated?: boolean
}

export interface CardContainerDefaults {
  showCreated?: boolean
  showUpdated?: boolean
  componentName?: string
}

const OPEN_RE = /^:::\s*card(\s+.*)?$/
const CLOSE_RE = /^:::\s*$/
const SPLIT_RE = /^----+\s*$/
const KV_RE = /^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/
const ALLOWED_KEYS = new Set([
  'icon',
  'iconColor',
  'title',
  'link',
  'github',
  'tags',
  'desc',
  'showCreated',
  'showUpdated'
])
const BOOL_KEYS = new Set(['showCreated', 'showUpdated'])

function parseArrayValue(raw: string): string[] {
  const inner = raw.slice(1, -1)
  const result: string[] = []
  let i = 0
  const n = inner.length
  while (i < n) {
    while (i < n && /\s/.test(inner[i])) {
      i++
    }
    if (i >= n) {
      break
    }
    if (inner[i] === ',') {
      i++
      continue
    }
    if (inner[i] === '"') {
      let j = i + 1
      let buf = ''
      while (j < n) {
        const ch = inner[j]
        if (ch === '\\' && j + 1 < n) {
          buf += inner[j + 1]
          j += 2
          continue
        }
        if (ch === '"') {
          break
        }
        buf += ch
        j++
      }
      result.push(buf)
      i = j + 1
    }
    else {
      let j = i
      let buf = ''
      while (j < n && inner[j] !== ',') {
        buf += inner[j]
        j++
      }
      const trimmed = buf.trim()
      if (trimmed.length > 0) {
        result.push(trimmed)
      }
      i = j
    }
  }
  return result
}

function parseScalarValue(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    const inner = trimmed.slice(1, -1)
    let out = ''
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i]
      if (ch === '\\' && i + 1 < inner.length) {
        out += inner[i + 1]
        i++
      }
      else {
        out += ch
      }
    }
    return out
  }
  return trimmed
}

function assignField(item: CardItem, key: string, rawValue: string): void {
  if (!ALLOWED_KEYS.has(key)) {
    return
  }
  const value = rawValue.trim()
  if (key === 'tags') {
    if (value.startsWith('[') && value.endsWith(']')) {
      item.tags = parseArrayValue(value)
    }
    else {
      const scalar = parseScalarValue(value)
      item.tags = scalar.length > 0 ? [scalar] : []
    }
    return
  }
  if (BOOL_KEYS.has(key)) {
    const scalar = parseScalarValue(value).toLowerCase()
    if (scalar === 'true') {
      ;(item as any)[key] = true
    }
    else if (scalar === 'false') {
      ;(item as any)[key] = false
    }
    return
  }
  const scalar = parseScalarValue(value)
  ;(item as any)[key] = scalar
}

function parseSegment(segment: string): CardItem[] {
  const lines = segment.split(/\r?\n/)
  const items: CardItem[] = []
  let current: CardItem | null = null
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '')
    if (line.trim().length === 0) {
      continue
    }
    if (line.trim().startsWith('#')) {
      continue
    }
    let content = line
    let startsNew = false
    const dashMatch = /^(\s*)-\s+(.*)$/.exec(line)
    if (dashMatch) {
      startsNew = true
      content = dashMatch[2]
    }
    const kv = KV_RE.exec(content.trim())
    if (!kv) {
      continue
    }
    if (startsNew || current === null) {
      current = {}
      items.push(current)
    }
    assignField(current, kv[1], kv[2])
  }
  return items
}

function htmlAttrEscape(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function productCardMarkdownPlugin(md: MarkdownIt, defaults: CardContainerDefaults = {}): void {
  const defaultShowCreated = defaults.showCreated !== false
  const defaultShowUpdated = defaults.showUpdated !== false
  const componentName = defaults.componentName || 'ProductCard'

  function tokenize(state: any, startLine: number, endLine: number, silent: boolean): boolean {
    try {
      const startPos = state.bMarks[startLine] + state.tShift[startLine]
      const maxPos = state.eMarks[startLine]
      const firstLine = state.src.slice(startPos, maxPos)
      const openMatch = OPEN_RE.exec(firstLine)
      if (!openMatch) {
        return false
      }
      if (silent) {
        return true
      }

      let nextLine = startLine + 1
      let closeLine = -1
      while (nextLine < endLine) {
        const lineStart = state.bMarks[nextLine] + state.tShift[nextLine]
        const lineEnd = state.eMarks[nextLine]
        const lineText = state.src.slice(lineStart, lineEnd)
        if (CLOSE_RE.test(lineText)) {
          closeLine = nextLine
          break
        }
        nextLine++
      }
      if (closeLine === -1) {
        return false
      }

      const title = (openMatch[1] || '').trim()
      const contentLines: string[] = []
      for (let i = startLine + 1; i < closeLine; i++) {
        const s = state.bMarks[i] + state.tShift[i]
        const e = state.eMarks[i]
        contentLines.push(state.src.slice(s, e))
      }

      const segments: string[] = []
      let buf: string[] = []
      for (const l of contentLines) {
        if (SPLIT_RE.test(l)) {
          segments.push(buf.join('\n'))
          buf = []
        }
        else {
          buf.push(l)
        }
      }
      segments.push(buf.join('\n'))

      const items: CardItem[] = []
      for (const seg of segments) {
        if (seg.trim().length === 0) {
          continue
        }
        const parsed = parseSegment(seg)
        for (const it of parsed) {
          if (it.desc && it.desc.length > 0) {
            it.descHtml = md.renderInline(it.desc)
            delete it.desc
          }
          if (it.showCreated === undefined) {
            it.showCreated = defaultShowCreated
          }
          if (it.showUpdated === undefined) {
            it.showUpdated = defaultShowUpdated
          }
          items.push(it)
        }
      }

      const titleJson = title.length > 0 ? JSON.stringify(title) : 'null'
      const itemsJson = JSON.stringify(items)
      const titleAttr = htmlAttrEscape(titleJson)
      const itemsAttr = htmlAttrEscape(itemsJson)

      const token = state.push('html_block', '', 0)
      token.content = `<${componentName} :title="${titleAttr}" :items="${itemsAttr}"></${componentName}>\n`
      token.map = [startLine, closeLine + 1]

      state.line = closeLine + 1
      return true
    }
    catch {
      return false
    }
  }

  md.block.ruler.before('fence', 'card_container', tokenize, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  })
}

// Alias for backward compatibility with @sugarat/theme internal usage.
export const cardContainerPlugin = productCardMarkdownPlugin
