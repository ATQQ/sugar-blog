#!/usr/bin/env zx
import { createRequire } from 'module'
import { fs, glob } from 'zx'

const require = createRequire(import.meta.url)
const sass = require('sass')

const targetDir = './packages/theme/src/components'
const files = await glob(`${targetDir}/**/*.vue`)

console.log(`Scanning ${files.length} files in ${targetDir}...`)

let count = 0

for (const file of files) {
  let content = await fs.readFile(file, 'utf-8')

  // Regex to find style block with lang="scss"
  // Captures:
  // 1. Attributes before lang
  // 2. Attributes after lang
  // 3. Content
  const styleRegex = /<style([\s\S]*?)lang=["']scss["']([\s\S]*?)>([\s\S]*?)<\/style>/i

  let match
  let fileChanged = false

  // eslint-disable-next-line no-cond-assign
  while ((match = content.match(styleRegex))) {
    console.log(`Converting block in ${file}...`)
    const [fullMatch, attrs1, attrs2, scssContent] = match

    try {
      // Compile SCSS to CSS
      const result = sass.compileString(scssContent, {
        syntax: 'scss',
        url: new URL(`file://${file}`),
      })

      const css = result.css

      // Reconstruct attributes without lang="scss"
      // attrs1 and attrs2 might contain 'scoped' or other attributes.
      // We join them and clean up extra spaces.
      let newAttrs = (`${attrs1} ${attrs2}`).replace(/\s+/g, ' ').trim()

      // Add leading space if attributes exist
      if (newAttrs.length > 0) {
        newAttrs = ` ${newAttrs}`
      }

      const newStyleBlock = `<style${newAttrs}>
${css}
</style>`

      content = content.replace(fullMatch, newStyleBlock)
      fileChanged = true
    }
    catch (error) {
      console.log(`❌ Failed to compile ${file}: ${error.message}`)
      // Break loop to avoid infinite loop if regex keeps matching the same failing block
      break
    }
  }

  if (fileChanged) {
    await fs.writeFile(file, content)
    console.log(`✅ Converted ${file}`)
    count++
  }
}

console.log(`Done. Converted ${count} files.`)
