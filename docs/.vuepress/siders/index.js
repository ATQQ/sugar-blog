const fs = require('fs')
const path = require('path')

function NavSider(baseSiderPath) {
    this.baseUrl = `/${baseSiderPath}`
    this.childSiders = []
}

NavSider.prototype.addChildSider = function (route, sider) {
    this.childSiders.push({ route: `${this.baseUrl}/${route}/`, sider })
}
NavSider.prototype.getSiders = function () {
    let routes = {}
    this.childSiders.forEach(curr => {
        routes[curr.route] = curr.sider
    })
    return routes
}

const defaultConfig = {
    collapsable: false,
    sidebarDepth: 2
}

function getChildren(p) {
    const files = fs.readdirSync(p, { withFileTypes: true })
    const children = files.filter(f => (f.isFile() && f.name !== 'README.md')).map(file => {
        const { name } = file
        const basename = path.basename(name, '.md')
        const title = fs.readFileSync(path.resolve(p, name), {
            encoding: 'utf-8'
        }).split('\n').find(str => {
            return str.startsWith('# ')
        }).slice(2).replace(/[\s]/g, '')
        return [basename, title]
    })
    return children
}

function loadConfig(cf) {
    const { root, children } = cf
    const navSidebar = new NavSider(root)
    children.forEach(child => {
        const [childSider, title, introduction, oldChildren] = child
        let children = getChildren(path.resolve(__dirname, `../../${root}`, childSider))

        // 去重(剔除出已经配置的)
        if (Array.isArray(oldChildren)) {
            children = oldChildren.concat(children.filter(c => {
                return oldChildren.findIndex(v => {
                    return v[0] === c[0]
                }) === -1
            }))
        }
        children.unshift(['', introduction])
        navSidebar.addChildSider(childSider, [
            {
                ...defaultConfig,
                title,
                children
            }
        ])
    })
    return navSidebar
}

function mergeSider(...siders) {
    let sider = {}
    siders.forEach((cuur) => {
        Object.assign(sider, cuur)
    })
    return sider
}

const files = fs.readdirSync(__dirname, { withFileTypes: true })
const childSiderbar = files.filter(f => f.isFile() && f.name !== 'index.js').map(v => {
    const config = require(`./${v.name}`)
    return loadConfig(config).getSiders()
})
const siderbar = mergeSider.apply(this, childSiderbar)

module.exports = siderbar