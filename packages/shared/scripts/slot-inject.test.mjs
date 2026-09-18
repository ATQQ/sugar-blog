/**
 * transformVitePressLayout 自测脚本
 * 运行：node packages/shared/scripts/slot-inject.test.mjs（需先构建 shared）
 *
 * 验证场景（对应 T03.md Test Scenarios）：
 * A. alpha.17 真实 Layout.vue（<script setup lang="ts">）：注入 + 可编译
 * B. alpha.20+ 形态（<script setup> 无 lang）：注入 + 可编译
 * C. slot 不存在：跳过并告警，不报错
 * D. 已含同组件导入：幂等，不重复插入
 * E. 无 script setup 块：正则回退注入 slot
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc'
import { transformVitePressLayout } from '../dist/index.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const layoutPath = path.resolve(__dirname, '../node_modules/vitepress/dist/client/theme-default/Layout.vue')

let failed = 0
function assert(cond, msg) {
  if (cond) {
    console.log(`  ✅ ${msg}`)
  } else {
    failed++
    console.error(`  ❌ ${msg}`)
  }
}

/** 校验注入后的 SFC 能被 compiler-sfc 完整编译（script setup + template） */
function assertCompiles(sfc, label) {
  const { descriptor, errors } = parse(sfc, { filename: 'Layout.vue' })
  assert(errors.length === 0, `${label}: parse 无错误`)
  const scriptResult = compileScript(descriptor, { id: 'test-id' })
  assert(!!scriptResult, `${label}: compileScript 成功`)
  const tplResult = compileTemplate({
    source: descriptor.template.content,
    filename: 'Layout.vue',
    id: 'test-id'
  })
  assert(tplResult.errors.length === 0, `${label}: compileTemplate 成功`)
}

const alpha17Code = fs.readFileSync(layoutPath, 'utf-8')
const isAlpha17 = alpha17Code.includes('<script setup lang="ts">')
assert(isAlpha17, 'fixture: alpha.17 Layout.vue 含 <script setup lang="ts">')

// ========== A. alpha.17 真实 Layout.vue ==========
console.log('\n[A] alpha.17 Layout.vue（lang="ts"）+ back2top 配置')
{
  const warns = []
  const res = transformVitePressLayout(alpha17Code, 'BackToTop', ['doc-after'], {
    wrapper: 'ClientOnly',
    onWarn: msg => warns.push(msg)
  })
  assert(res.changed, 'changed = true')
  assert(res.fallbackUsed === false, '未走正则回退')
  assert(res.injectedSlots.join() === 'doc-after', `injectedSlots = [doc-after]，实际 [${res.injectedSlots}]`)
  assert(res.code.includes("import BackToTop from './BackToTop.vue'"), 'import 已插入')
  assert(res.code.includes('<ClientOnly><BackToTop /></ClientOnly>'), 'slot 后插入 ClientOnly 包装组件')
  assert((res.code.match(/import BackToTop/g) || []).length === 1, 'import 仅插入一次')
  assert(warns.length === 0, '无告警')
  assertCompiles(res.code, 'A')

  // ========== D. 幂等 ==========
  console.log('\n[D] 幂等：对 A 的结果二次 transform')
  const res2 = transformVitePressLayout(res.code, 'BackToTop', ['doc-after'], {
    wrapper: 'ClientOnly',
    onWarn: () => {}
  })
  assert(res2.changed === false, 'changed = false')
  assert(res2.code === res.code, 'code 不变')
}

// ========== B. alpha.20+ 形态（无 lang 属性） ==========
console.log('\n[B] alpha.20+ 形态（<script setup>）+ image-preview 配置')
{
  const alpha20Code = alpha17Code.replace('<script setup lang="ts">', '<script setup>')
  assert(alpha20Code.includes('<script setup>'), 'fixture: 已去除 lang="ts"')
  const warns = []
  const res = transformVitePressLayout(alpha20Code, 'ImagePreview', ['doc-before', 'page-top'], {
    wrapper: 'ClientOnly',
    onWarn: msg => warns.push(msg)
  })
  assert(res.changed, 'changed = true')
  assert(res.fallbackUsed === false, '未走正则回退')
  assert(res.injectedSlots.sort().join() === 'doc-before,page-top', `injectedSlots = [doc-before, page-top]，实际 [${res.injectedSlots}]`)
  assert(res.code.includes("import ImagePreview from './ImagePreview.vue'"), 'import 已插入')
  assert(res.code.includes('<ClientOnly><ImagePreview /></ClientOnly>'), 'slot 后插入包装组件')
  assert(warns.length === 0, '无告警')
  assertCompiles(res.code, 'B')
}

// ========== C. slot 不存在 ==========
console.log('\n[C] slot 不存在：跳过并告警')
{
  const warns = []
  const res = transformVitePressLayout(alpha17Code, 'Foo', ['doc-after', 'not-exist-slot'], {
    onWarn: msg => warns.push(msg)
  })
  assert(res.injectedSlots.join() === 'doc-after', '存在的 slot 正常注入')
  assert(res.missedSlots.join() === 'not-exist-slot', `missedSlots = [not-exist-slot]，实际 [${res.missedSlots}]`)
  assert(warns.some(msg => msg.includes('not-exist-slot')), '已告警缺失 slot')
  assertCompiles(res.code, 'C')
}

// ========== E. 无 script setup 块（正则回退） ==========
console.log('\n[E] 无 script setup 块：正则回退注入 slot')
{
  const synthetic = `<template>
  <div>
    <slot name="doc-after" />
    <main><slot name="doc-before" /></main>
  </div>
</template>
`
  const warns = []
  const res = transformVitePressLayout(synthetic, 'Bar', ['doc-after', 'doc-before'], {
    wrapper: 'ClientOnly',
    onWarn: msg => warns.push(msg)
  })
  assert(res.fallbackUsed, 'fallbackUsed = true')
  assert(res.injectedSlots.sort().join() === 'doc-after,doc-before', `slot 均注入，实际 [${res.injectedSlots}]`)
  assert(res.code.includes("import Bar from './Bar.vue'") === false, '无 script setup，未插 import')
  assert(warns.some(msg => msg.includes('script setup')), '已告警缺少 script setup')
  assert(res.code.includes('<main><slot name="doc-before" /></main>') === false, '嵌套 slot 也被注入')

  // 解析失败兜底：极端格式走正则回退
  const res2 = transformVitePressLayout('<template><slot name="doc-after" /></template>', 'Baz', ['doc-after'], {
    onWarn: () => {}
  })
  assert(res2.fallbackUsed, '极端格式 fallbackUsed = true')
  assert(res2.injectedSlots.join() === 'doc-after', '极端格式 slot 注入成功')
}

console.log(failed === 0 ? '\n🎉 全部通过' : `\n💥 ${failed} 项失败`)
process.exit(failed === 0 ? 0 : 1)
