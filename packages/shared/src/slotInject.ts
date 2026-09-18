import { parse } from '@vue/compiler-sfc'

/**
 * VitePress 默认主题 Layout.vue 插槽注入工具
 *
 * 背景(#469)：旧实现通过精确匹配 `<script setup lang="ts">` 字符串插入 import，
 * VitePress 2.0.0-alpha.20+ 已改为 `<script setup>`（无 lang 属性），导致注入失效。
 * 此处改用 @vue/compiler-sfc 结构化解析定位 script setup 块与 slot 标签，
 * 不依赖 lang 属性与标签书写格式；解析失败时回退宽松正则保底。
 */

/** NodeTypes.ELEMENT */
const NODE_ELEMENT = 1
/** NodeTypes.ATTRIBUTE */
const NODE_ATTRIBUTE = 6

export interface SlotInjectOptions {
  /** 组件 import 路径，默认 `./${componentName}.vue` */
  importFrom?: string
  /** 组件包装器，如 ClientOnly（VitePress 已全局注册，无需额外 import） */
  wrapper?: string
  /** 警告回调，默认 console.warn */
  onWarn?: (msg: string) => void
}

export interface SlotInjectResult {
  code: string
  /** 是否发生了改动 */
  changed: boolean
  /** 成功注入的 slot 名列表 */
  injectedSlots: string[]
  /** 未在模板中找到的 slot 名列表 */
  missedSlots: string[]
  /** 是否走了正则回退路径 */
  fallbackUsed: boolean
}

interface Insertion {
  offset: number
  text: string
}

/** 深度遍历模板 AST（兼容 v-for/v-if 产生的 branches 结构） */
function walkTemplateAst(node: any, cb: (n: any) => void) {
  if (!node || typeof node !== 'object') return
  cb(node)
  if (Array.isArray(node.children)) {
    node.children.forEach((child: any) => walkTemplateAst(child, cb))
  }
  if (Array.isArray(node.branches)) {
    node.branches.forEach((branch: any) => walkTemplateAst(branch, cb))
  }
}

/** 取静态 slot 名（仅处理 `<slot name="xxx" />` 形式，动态 :name 不处理） */
function getSlotName(node: any): string | null {
  if (node?.type !== NODE_ELEMENT || node.tag !== 'slot') return null
  const nameProp = (node.props || []).find(
    (p: any) => p.type === NODE_ATTRIBUTE && p.name === 'name' && p.value
  )
  return nameProp ? nameProp.value.content : null
}

/**
 * 定位 script setup 块内容起始偏移（不含开标签）
 * compiler-sfc 的 block.loc.start 即内容起始；兼容指向开标签的场景
 */
function getScriptSetupContentStart(code: string, block: any): number {
  const locStart = block?.loc?.start?.offset
  if (typeof locStart !== 'number') return -1
  if (!code.startsWith('<script', locStart)) return locStart
  const tagEnd = code.indexOf('>', locStart)
  return tagEnd === -1 ? -1 : tagEnd + 1
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 向 VitePress Layout.vue 源码注入组件 import 与 slot 占位
 *
 * @param code Layout.vue 源码
 * @param componentName 注入的组件名
 * @param slots 目标插槽名列表
 * @param options 配置
 */
export function transformVitePressLayout(
  code: string,
  componentName: string,
  slots: string | string[],
  options: SlotInjectOptions = {}
): SlotInjectResult {
  const targetSlots = (Array.isArray(slots) ? slots : [slots]).filter(Boolean)
  const importFrom = options.importFrom || `./${componentName}.vue`
  const importStatement = `import ${componentName} from '${importFrom}'`
  const componentTag = options.wrapper
    ? `<${options.wrapper}><${componentName} /></${options.wrapper}>`
    : `<${componentName} />`
  const warn = options.onWarn || ((msg: string) => console.warn(msg))

  const result: SlotInjectResult = {
    code,
    changed: false,
    injectedSlots: [],
    missedSlots: [],
    fallbackUsed: false
  }

  // 幂等：已导入同名组件时不再处理（可能被多个插件实例重复 transform）
  if (new RegExp(`import\\s+${escapeRegExp(componentName)}\\b`).test(code)) {
    return result
  }

  const insertions: Insertion[] = []
  const foundSlots = new Set<string>()

  // 优先 compiler-sfc 结构化解析定位插入点
  try {
    const { descriptor } = parse(code, { filename: 'Layout.vue' })
    const scriptStart = getScriptSetupContentStart(code, descriptor.scriptSetup)
    if (scriptStart > -1 && descriptor.template?.ast) {
      insertions.push({ offset: scriptStart, text: `\n${importStatement}\n` })
      walkTemplateAst(descriptor.template.ast, (node) => {
        const slotName = getSlotName(node)
        if (slotName && targetSlots.includes(slotName)) {
          insertions.push({ offset: node.loc.end.offset, text: `\n${componentTag}` })
          foundSlots.add(slotName)
        }
      })
    }
  } catch {
    // 解析失败走正则回退
  }

  if (insertions.length) {
    result.injectedSlots = [...foundSlots]
    result.missedSlots = targetSlots.filter(slot => !foundSlots.has(slot))
    // 按 offset 降序插入，避免前面的插入使后面偏移失效
    insertions.sort((a, b) => b.offset - a.offset)
    let output = code
    for (const { offset, text } of insertions) {
      output = output.slice(0, offset) + text + output.slice(offset)
    }
    result.code = output
    result.changed = true
  } else {
    // 正则回退：开标签宽松匹配，不依赖 lang 属性
    result.fallbackUsed = true
    let output = code

    const scriptMatch = output.match(/<script setup[^>]*>/)
    if (scriptMatch && scriptMatch.index !== undefined) {
      const offset = scriptMatch.index + scriptMatch[0].length
      output = output.slice(0, offset) + `\n${importStatement}\n` + output.slice(offset)
      result.changed = true
    } else {
      warn(`[slot-inject] Layout.vue 中未找到 script setup 块，无法导入 ${componentName}`)
    }

    for (const slot of targetSlots) {
      const slotRe = new RegExp(`<slot\\s+name=["']${escapeRegExp(slot)}["']\\s*/?>`)
      const matched = output.match(slotRe)
      if (matched && matched.index !== undefined) {
        const offset = matched.index + matched[0].length
        output = output.slice(0, offset) + `\n${componentTag}` + output.slice(offset)
        result.injectedSlots.push(slot)
        result.changed = true
      } else {
        result.missedSlots.push(slot)
      }
    }
    result.code = output
  }

  for (const slot of result.missedSlots) {
    warn(`[slot-inject] Layout.vue 中未找到 slot "${slot}"，已跳过`)
  }

  return result
}

export interface SlotInjectPluginOptions extends SlotInjectOptions {
  /** vite 插件名，默认 vitepress-plugin-slot-inject */
  name?: string
}

/**
 * 生成用于注入 VitePress 默认主题 Layout.vue 的 vite 插件片段（含 transform 钩子），
 * 可直接展开合并进具体插件对象
 *
 * @example
 * ```ts
 * const plugin: PluginOption = {
 *   ...createSlotInjectPlugin('BackToTop', ['doc-after'], { wrapper: 'ClientOnly' }),
 *   name: 'vitepress-plugin-back2top',
 *   enforce: 'pre',
 *   config: () => ({ resolve: { alias: { /* ... *\/ } } })
 * }
 * ```
 */
export function createSlotInjectPlugin(
  componentName: string,
  slots: string | string[],
  options: SlotInjectPluginOptions = {}
) {
  const targetSlots = (Array.isArray(slots) ? slots : [slots]).filter(Boolean)
  const name = options.name || 'vitepress-plugin-slot-inject'
  return {
    name,
    enforce: 'pre' as const,
    transform(code: string, id: string): string | undefined {
      // 兼容 VitePress 1.x / 2.x 的默认主题 Layout 路径
      if (!id.endsWith('vitepress/dist/client/theme-default/Layout.vue')) return
      const { code: transformed } = transformVitePressLayout(
        code,
        componentName,
        targetSlots,
        options
      )
      return transformed
    }
  }
}
