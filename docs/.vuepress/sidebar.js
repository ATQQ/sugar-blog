const { writeFileSync } = require('fs')
const path = require('path')
const { join } = require('path')
const { sidebarList, docsDir } = require('./../../src/constants')
const { readFile, readDir, getFileH1, getFileMatterData } = require('./../../src/util')

const sidebar = {}

const defaultConfig = {
    collapsable: false,
    sidebarDepth: 2
}

for (const sideDirname of sidebarList) {
    // docs/sideDirname
    const sideDirPath = join(docsDir, sideDirname)
    const sideChildren = readDir(sideDirPath)
        .filter(v => v.isDirectory())
        .map(v => v.name)

    for (const sideChildName of sideChildren) {
        const route = join('/', sideDirname, sideChildName, '/')
        sidebar[route] = [getDirSide(route, { ...defaultConfig, isRoot: true })]
    }
}

const matterExample = {
    groupTitle: '',
    sidebarTitle: '',
    collapsable: false
}

function getTitle(filepath) {
    // 文章配置
    const { groupTitle, sidebarTitle } = getFileMatterData(filepath)
    return groupTitle || sidebarTitle || getFileH1(filepath)
}

function isCollapsable(filepath) {
    return !!getFileMatterData(filepath).collapsable
}
function getDirSide(dirRoute, ops = {}) {
    const { isRoot, ...otherOps } = ops
    const children = []

    const READMEFile = join(docsDir, dirRoute, 'README.md')
    const config = {
        title: getTitle(READMEFile),
        ...otherOps,
        collapsable: !!isCollapsable(READMEFile)
    }

    // 非最外层
    if (!isRoot) {
        config.path = dirRoute
    }

    // 有子项
    const files = readDir(join(docsDir, dirRoute))
    if (files.length !== 0) {
        config.children = children
    }
    for (const file of files) {
        const { name } = file
        if (file.isFile()) {
            const title = getTitle(join(docsDir, dirRoute, name))
            const isREADME = name === 'README.md'
            // 特殊处理README
            let p = isREADME ? dirRoute : join(dirRoute, path.parse(name).name)
            // 根目录直接放，否则不放README
            if (isRoot || !isREADME) {
                children[isREADME ? 'unshift' : 'push']({
                    title,
                    path: p
                })
            }
        } else if (file.isDirectory()) {
            children.push(getDirSide(join(dirRoute, name, '/'), defaultConfig))
        }
    }
    return config
}

writeFileSync(join(__dirname, 'test.json'), JSON.stringify(sidebar, null, 2))
module.exports = sidebar