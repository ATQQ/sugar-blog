const { NavSider } = require('./object')
function algorithmSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['linkReserve', '链表--转置'],
                ['treeLevelTraverse', '二叉树--层序遍历'],
                ['judgeSymmetryTree', '二叉树--判断是否对称'],
                ['quickSort', '排序--快速排序'],
                ['headSort', '排序--堆排序'],
                ['mergeSort', '排序--归并排序'],
            ]
        }
    ]
}
function cssSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
            ]
        }
    ]
}
function jsSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
            ]
        }
    ]
}

const coding = new NavSider('coding')
coding.addChildSider('algorithm', algorithmSidebar('algorithm', '算法与数据结构'))
coding.addChildSider('js', jsSidebar('javscript', 'javscript代码题'))
coding.addChildSider('css', cssSidebar('css', 'css代码面试题'))
module.exports = coding.getSiders()