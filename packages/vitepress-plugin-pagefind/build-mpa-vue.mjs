// @ts-check
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import ts from 'typescript'

const mpaVues = ['SearchMPA', 'SearchMPADefault']

for (const mpaVue of mpaVues) {
  const srcPath = resolve(import.meta.dirname, `./src/${mpaVue}.vue`)
  const distPath = resolve(import.meta.dirname, `./dist/${mpaVue}.vue`)
  let vueContent = await readFile(srcPath, 'utf-8')
  vueContent = vueContent.replace(/<script client.*?>(.*?)<\/script>/gs, (_, tsSource) =>
    `<script client>\n${compileTypeScript(tsSource)}</script>`)
  vueContent = vueContent.replace(/import type .*\n/g, '')
  vueContent = vueContent.replace(/@import '(.*)'/g, (_, path) =>
    `@import '${relative(dirname(distPath), resolve(dirname(srcPath), path)).replaceAll('\\', '/')}'`)
  writeFile(distPath, vueContent, 'utf-8')
}

/**
 * @param {string} source
 * @param {keyof typeof ts.ScriptTarget} target
 */
function compileTypeScript(source, target = 'ESNext') {
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget[target],
      alwaysStrict: false,
    },
  }).outputText
}
