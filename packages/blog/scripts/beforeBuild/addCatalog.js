const fs = require('fs')
const path = require('path')
const { readDir, readFile, getFileH1 } = require('../utils')

/**
 * 获取指定目录下的md文件目录
 * @param {string} dir 目标目录
 * @param {string[]} exclude 排除的文件名
 */
function getDirMdCatalog(dir, exclude = []) {
  let files = readDir(dir)
  files = files.filter((f) => !exclude.includes(f.name))
  const res = files
    .map((file) => {
      const { name } = file
      if (file.isFile()) {
        return `* [${getFileH1(path.join(dir, name))}](./${name})`
      }
      if (
        file.isDirectory() &&
        fs.existsSync(path.join(dir, name, 'README.md'))
      ) {
        return `* [${getFileH1(path.join(dir, name, 'README.md'))}](./${name}/)`
      }
      return ''
    })
    .filter((v) => !!v)
  return res
}
function addDirListToREADME(dirList, readmeFile) {
  const res = `\n\n## 目录\n${dirList.join('\n')}`
  let old = readFile(readmeFile)
  old = old.slice(0, old.indexOf('\n\n## 目录'))
  fs.writeFileSync(readmeFile, old)
  fs.appendFileSync(readmeFile, res)
}

/**
 * 对指定的根目录进行递归扫描，为README.md添加目录
 */
function scanDirectory(directory, include = []) {
  const dirs = readDir(directory)
    // 过滤出目录
    .filter((v) => v.isDirectory())
    // 只包含include中的目录
    // include为空则不过滤
    .filter((v) => !include.length || include.includes(v.name))
  for (const dir of dirs) {
    // 目录的绝对路径
    const absoluteDirPath = path.join(directory, dir.name)
    // 递归处理
    scanDirectory(absoluteDirPath)
    // 不包含README.md 不处理
    if (!readDir(absoluteDirPath).find((v) => v.name === 'README.md')) {
      continue
    }
    // 获取目录
    const catalog = getDirMdCatalog(absoluteDirPath, ['README.md'])
    // 添加目录
    addDirListToREADME(catalog, path.join(absoluteDirPath, 'README.md'))
  }
}

// 待扫描的根目录
const { sidebarList, docsDir } = require('../constants')

scanDirectory(docsDir, sidebarList)
