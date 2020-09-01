const { NavSider } = require('./object')
function jsSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['p0', '简单技巧'],
                ['p1', '获取某年某月的天数'],
                ['p2', '日期格式化'],
                ['p3', '展开多级数组'],
                ['p4', '判断常见变量类型'],
                ['p5', '文件上传与下载'],
                ['currying', '柯里化'],
                ['closure', '闭包'],
                ['delete', 'delete'],
                ['garbage', '垃圾回收'],
                ['throttling', '节流与防抖'],
                ['apply', 'apply,call,bind'],
                ['blob', 'blob与file'],
                ['eventloop', 'Event Loop'],
                ['promise', 'Promise'],
                ['clock', '定时器'],
                ['prototype', '原型与原型链'],
                ['scope', '作用域'],
                ['runStack', '执行上下文栈'],
                ['variableObject', '变量对象'],
                ['scopeLink', '作用域链'],
                ['ecmathis', 'ECMAScript规范解读this'],
                ['runcontext', '执行上下文'],
                ['valuePass', '参数按值传递'],
                ['likearray', '类数组与arguments'],
                ['float', '浮点数'],
                ['symbol', 'Symbol的用法'],
                ['arrowfun', '箭头函数'],
                ['typeConvert','类型转换'],
                ['es6+','ES6+的新语法糖和方法整理']
            ]
        }
    ]
}

function regexpSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['p1', '提取url()中的地址']
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
                ['p1', '伪元素before与after'],
                ['p2', '实现表格斑马纹'],
                ['reflow', '回流与重绘'],
                ['box', '盒模型'],
                ['flex', '弹性布局'],
                ['level', 'CSS层级关系'],
                ['bfc', 'BFC'],
                ['ifc', 'IFC']
            ]
        }
    ]
}


function nodeSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['p1', '从控制台录入数据']
            ]
        }
    ]
}

function vueSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['bindData', '数据绑定'],
                ['routing', '路由原理'],
                ['hook', '生命周期钩子'],
                ['communicate', '组件通信'],
                ['extend', 'extend API'],
                ['mixin', 'mixin与mixins'],
                ['computed', 'computed与watch'],
                ['keep-alive', 'keep-alive'],
                ['showif', 'v-show 与 v-if'],
                ['mechanism', '❤运行机制概述'],
                ['responsive', '❤响应式基本原理'],
                ['dep', '❤响应式系统的依赖收集追踪原理'],
                ['vnode', '❤VNode实现']
                // ['compile', '❤编译template的过程'],
                // ['diff', '❤数据状态更新时的差异 diff 及 patch 机制']
            ]
        }
    ]
}
function performanceSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['image', '图片优化'],
                ['dnsPre', 'DNS预解析'],
                ['throttling', '节流与防抖'],
                ['preLoad', '资源预加载'],
                ['preRender', '页面预渲染'],
                ['lazyLoad', '懒加载'],
                ['Internet', '网络层面优化'],
                ['cdn', 'CDN的缓存与回源机制'],
                ['ssr', '服务端渲染'],
                ['monitor', '监控']
            ]
        }
    ]
}
function browserSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['cache', '缓存机制'],
                ['brorender', '渲染原理'],
                ['storage', '本地存储'],
                ['safe', '安全问题']
            ]
        }
    ]
}
function htmlSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['semantic', '语义化标签']
            ]
        }
    ]
}
const bigWeb = new NavSider('bigWeb')
bigWeb.addChildSider('js', jsSidebar('javascript', '简介'))
bigWeb.addChildSider('html', htmlSidebar('HTML', '简介'))
bigWeb.addChildSider('regexp', regexpSidebar('regexp', '正则表达式'))
bigWeb.addChildSider('css', cssSidebar('css', '简介'))
bigWeb.addChildSider('node', nodeSidebar('node', 'NodeJS'))
bigWeb.addChildSider('vue', vueSidebar('vue', '简介'))
bigWeb.addChildSider('browser', browserSidebar('browser', '浏览器相关问题'))
bigWeb.addChildSider('performance', performanceSidebar('performance', '浏览器性能优化'))
module.exports = bigWeb.getSiders()