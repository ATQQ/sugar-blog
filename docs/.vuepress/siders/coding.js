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
                ['publicString', '字符串--最长公共子序列长度'],
                ['publicStringLen', '字符串--最长公共子串'],
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
                ['promiseAll', '简单-实现promiseAll'],
                ['myBind', '简单-实现bind'],
                ['myCall', '简单-实现call'],
                ['myApply', '简单-实现apply'],
                ['deepClone', '中等-实现深拷贝']
            ]
        }
    ]
}

const coding = new NavSider('coding')
coding.addChildSider('algorithm', algorithmSidebar('algorithm', '算法与数据结构'))
coding.addChildSider('js', jsSidebar('javscript', 'javscript代码题'))
coding.addChildSider('css', cssSidebar('css', 'css代码面试题'))
module.exports = coding.getSiders()