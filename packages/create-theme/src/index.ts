#!/usr/bin/env node

import path from 'node:path'
import process from 'process'
import fs from 'fs-extra'

const argvs = process.argv.slice(2)
const stringFlag = argvs.filter(item => !item.startsWith('--'))

const projectName = stringFlag[stringFlag.length - 1] || 'my-blog'

const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

const isBun = pkgManager === 'bun'

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent)
    return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

function createThemeProject(destination) {
  const templatePath = path.join(__dirname, 'template')

  fs.copy(templatePath, destination, async (err) => {
    // 同步创建.gitignore文件和配置文件
    await fs.copy(
      path.join(__dirname, 'move/gitignore'),
      path.join(destination, '.gitignore')
    )

    const sourceRc = isBun ? 'bunfig.toml' : 'npmrc'
    const targetFile = isBun ? 'bunfig.toml' : '.npmrc'
    await fs.copy(
      path.join(__dirname, `move/${sourceRc}`),
      path.join(destination, targetFile)
    )
    // package.json build 指令添加 NODE_ENV=production
    // issue https://github.com/oven-sh/bun/issues/3791
    if (isBun) {
      const pkgPath = path.join(destination, 'package.json')
      const pkg = await fs.readJSON(pkgPath)
      pkg.scripts.build = `NODE_ENV=production ${pkg.scripts.build}`
      await fs.writeJSON(pkgPath, pkg, { spaces: 2 })
    }
    if (err) {
      console.error('An error occurred while copying template files:', err)
    }
    else {
      console.log('🎉 🎉 created successfully!')
      console.log()

      console.log(`project in ${destination}`)

      console.log()

      const msg = `Done. Now run:
      
  ①  cd ${path.parse(destination).name}
  ②  ${pkgManager} install
  ③  ${pkgManager} run ${isBun ? '--bun ' : ''}dev
  ④  ${pkgManager} run ${isBun ? '--bun ' : ''}build
  ⑤  ${pkgManager} run ${isBun ? '--bun ' : ''}serve`

      console.log(msg)
    }
  })
}

console.log('Creating @sugarat/theme project...')
console.log()

createThemeProject(path.join(process.cwd(), projectName))
