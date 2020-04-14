const {NavSider} = require('./object')
function offerSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['p50', '面试题50:第一个只出现一次的字符'],
                ['p53-2', '面试题53II:0～n-1中缺失的数字'],
                ['p54', '面试题54:二叉搜索树的第k大节点'],
                ['p55', '面试题55:平衡二叉树'],
                ['p55-1', '面试题55:二叉树的深度'],
                ['p58', '面试题58:左旋转字符串']
            ]
        }
    ]
}
function osSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['process', '进程'],
                ['thread', '线程'],
                ['difprothr', '进程与线程的区别'],
                ['communicate', '进程和线程怎么通信']
            ]
        }
    ]
}
function internetSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['udp', 'UDP协议'],
                ['tcp', 'TCP协议'],
                ['tcp-udp', 'TCP与UDP的区别'],
                ['http', 'HTTP协议'],
                ['clength', 'Content-Length']
            ]
        }
    ]
}
function designSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['factory', '工厂模式'],
                ['abstractfactory', '抽象工厂模式'],
                ['single', '单例模式']
            ]
        }
    ]
}


const computerBase = new NavSider('computerBase')
computerBase.addChildSider('offer', offerSidebar('剑指Offer', '简介'))
computerBase.addChildSider('os', osSidebar('os', '操作系统'))
computerBase.addChildSider('Internet', internetSidebar('Internet', '计算机网络'))
computerBase.addChildSider('design', designSidebar('design Pattern', '设计模式'))

module.exports = computerBase.getSiders()