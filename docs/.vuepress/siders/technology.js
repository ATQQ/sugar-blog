const { NavSider } = require('./object')
const path = require('path')
const fs = require('fs')
const defaultConfig = {
    collapsable: false,
    sidebarDepth: 2
}
const config = {
    root: 'technology',
    children: [
        ['learn', 'devlearn', '开发教程']
    ],
}

function getChildren(p, introduction) {
    const files = fs.readdirSync(p, { withFileTypes: true })
    const children = files.filter(f => f.isFile()).map(file => {
        const { name } = file
        const basename = path.basename(name, '.md')
        const title = fs.readFileSync(path.resolve(p, name), {
            encoding: 'utf-8'
        }).split('\n')[0].slice(1).trim()
        if (basename === 'README') {
            return ['', introduction]
        } else {
            return [basename, title]
        }
    })
    return children
}

function loadConfig(cf) {
    const { root, children } = cf
    const navSidebar = new NavSider(root)
    children.forEach(child => {
        const [childSider, title, introduction] = child
        const children = getChildren(path.resolve(__dirname, `../../${root}`, childSider), introduction)
        navSidebar.addChildSider(childSider,[
            {
                ...defaultConfig,
                title,
                children
            }
        ])
    })
    return navSidebar
}
function learnSidebar(title, introduction) {
    return [
        {
            ...defaultConfig,
            title,
            children: [
                ['', introduction],
                ['eslint-plugin', 'eslint插件开发教程'],
                ['git-base', 'Git常用的一些基本操作'],
            ]
        }
    ]
}


const technology = new NavSider('technology')
technology.addChildSider('learn', learnSidebar('devlearn', '开发教程'))
module.exports = loadConfig(config).getSiders()