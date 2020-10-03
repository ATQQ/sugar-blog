// const { NavSider } = require('./index')
// function algorithmSidebar(group, introduction) {
//     return [
//         {
//             title: group,
//             collapsable: false,
//             sidebarDepth: 2,
//             children: [
//                 ['', introduction],
//                 ['linkReserve', '链表--转置'],
//                 ['treeLevelTraverse', '二叉树--层序遍历'],
//                 ['judgeSymmetryTree', '二叉树--判断是否对称'],
//                 ['quickSort', '排序--快速排序'],
//                 // ['headSort', '排序--堆排序'],
//                 ['mergeSort', '排序--归并排序'],
//                 ['addString', '字符串--大数相加'],
//                 ['feibo1', '简单--斐波拉契数列1'],
//                 ['feibo2', '简单--斐波拉契数列2'],
//                 // ['publicString', '字符串--最长公共子序列长度'],
//                 // ['publicStringLen', '字符串--最长公共子串'],
//             ]
//         }
//     ]
// }
// function cssSidebar(group, introduction) {
//     return [
//         {
//             title: group,
//             collapsable: false,
//             sidebarDepth: 2,
//             children: [
//                 ['', introduction],
//             ]
//         }
//     ]
// }
// function jsSidebar(group, introduction) {
//     return [
//         {
//             title: group,
//             collapsable: false,
//             sidebarDepth: 2,
//             children: [
//                 ['', introduction],
//                 ['promiseAll', '简单-实现promiseAll'],
//                 ['myBind', '简单-实现bind'],
//                 ['myCall', '简单-实现call'],
//                 ['myApply', '简单-实现apply'],
//                 ['inherit', '简单-继承实现'],
//                 ['myNew', '简单-new实现'],
//                 ['equalA', '简单-a同时等于多个值'],
//                 ['deepClone', '中等-实现深拷贝']
//             ]
//         }
//     ]
// }

// const coding = new NavSider('coding')
// coding.addChildSider('algorithm', algorithmSidebar('algorithm', '算法与数据结构'))
// coding.addChildSider('js', jsSidebar('javscript', 'javscript代码题'))
// coding.addChildSider('css', cssSidebar('css', 'css代码面试题'))
// module.exports = coding.getSiders()
module.exports = {
    root: 'coding',
    children: [
        ['algorithm', 'Algorithm', '算法与数据结构'],
        ['js', 'Javascript', 'javscript代码题'],
        ['css', 'Css', 'css代码面试题']
    ],
}