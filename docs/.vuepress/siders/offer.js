const { NavSider } = require('./object')
function autumn21Sidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['Internet', '前端备战秋招之计算机网络'],
            ]
        }
    ]
}

const offer = new NavSider('offer')
offer.addChildSider('autumn21', autumn21Sidebar('2021 autumn offer', '21届秋招'))
module.exports = offer.getSiders()