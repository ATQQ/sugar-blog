const path = require('path')

// 自动生成侧边栏的目录
const sidebarList = ['technology', 'offer', 'interview', 'computerBase', 'coding', 'bigWeb']
const docsDir = path.join(__dirname, '../../docs')

module.exports = {
    sidebarList,
    docsDir
}