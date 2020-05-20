const { NavSider } = require('./object')
function learnSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['eslint-plugin', 'eslint插件开发教程'],
            ]
        }
    ]
}


const technology = new NavSider('technology')
technology.addChildSider('learn', learnSidebar('devlearn', '开发教程'))
module.exports = technology.getSiders()