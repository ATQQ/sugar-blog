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

module.exports = {
    NavSider
}