#!/usr/bin/env node

/* eslint-disable no-console */
import fs from 'fs-extra'
import path from 'path'

function createThemeProject(destination) {
  const templatePath = path.join(__dirname, 'template')

  fs.copy(templatePath, destination, async (err) => {
    // 同步创建.gitignore文件和.npmrc文件
    await fs.copy(
      path.join(__dirname, 'move/gitignore'),
      path.join(destination, '.gitignore')
    )
    await fs.copy(
      path.join(__dirname, 'move/npmrc'),
      path.join(destination, '.npmrc')
    )
    if (err) {
      console.error('An error occurred while copying template files:', err)
    } else {
      console.log('🎉 🎉 created successfully!')
      console.log()

      console.log(`project in ${destination}`)

      console.log()

      const msg = `Done. Now run:

  ①  cd ${path.parse(projectName).name}
  ②  pnpm install
  ③  pnpm run dev`

      console.log(msg)
    }
  })
}

console.log('Creating @sugarat/theme project...')
console.log()

const projectName = process.argv[2] || 'my-blog'
createThemeProject(path.join(process.cwd(), projectName))
