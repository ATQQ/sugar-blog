/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
const fs = require('fs')
const path = require('path')

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

function writeJSON(p, obj) {
  fs.writeFileSync(p, `${JSON.stringify(obj, null, 2)}\n`, 'utf-8')
}

function bumpPatch(v) {
  const parts = v.split('.')
  if (parts.length !== 3)
    throw new Error(`Invalid semver: ${v}`)
  const [maj, min, pat] = parts
  const next = `${maj}.${min}.${Number(pat) + 1}`
  return next
}

const themePkgPath = path.resolve(__dirname, '../../theme/package.json')
const createThemePkgPath = path.resolve(__dirname, '../package.json')
const templatePkgPath = path.resolve(__dirname, '../public/template/package.json')
const changelogPath = path.resolve(__dirname, '../CHANGELOG.md')

const themePkg = readJSON(themePkgPath)
const themeVersion = themePkg.version

const templatePkg = readJSON(templatePkgPath)
if (!templatePkg.dependencies)
  templatePkg.dependencies = {}
templatePkg.dependencies['@sugarat/theme'] = `^${themeVersion}`
writeJSON(templatePkgPath, templatePkg)

// const createThemePkg = readJSON(createThemePkgPath)
// const currentVersion = createThemePkg.version
// const nextVersion = bumpPatch(currentVersion)
// createThemePkg.version = nextVersion
// writeJSON(createThemePkgPath, createThemePkg)

// const changelog = fs.readFileSync(changelogPath, 'utf-8')
// if (!changelog.includes(`## ${nextVersion}`)) {
//   const header = `## ${nextVersion}\n### Patch Changes\n\n- @sugarat/theme@${themeVersion}\n\n`
//   const updated = changelog.replace(/^# @sugarat\/create-theme\n/, `# @sugarat/create-theme\n\n${header}`)
//   fs.writeFileSync(changelogPath, updated, 'utf-8')
// }

console.log(`Updated @sugarat/theme to ^${themeVersion}`)
// console.log(`Bumped @sugarat/create-theme to ${nextVersion}`)
// console.log('Changelog updated')
