module.exports = {
    title: '粥里有勺糖',
    description: '粥里有勺糖的个人博客,个人随笔与学习笔记的记录',
    head: [
        // ['link', { ref: 'icon', href: '/test.jpg' }]
    ],
    base: "/",
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        lastUpdated: 'Last Updated',
        repo: 'ATQQ/sugar-blog',
        repoLabel: 'Github',
        editLinks: true,
        docsDir: 'docs',
        docsBranch: 'master',
        nav: [
            {
                text: '大前端',
                items: [
                    { text: 'javascript', link: '/js/' },
                    { text: 'css', link: '/css/' },
                    { text: 'regexp(正则)', 'link': '/regexp/' },
                    { text: 'es6 and more', link: '/es6+/' },
                    { text: 'node', link: '/node/' }]
            },
            {
                text: '面试',
                items: [
                    { text: 'javascript', link: '/interview/js/' },
                    { text: 'css', link: '/interview/css/' },
                    { text: 'vue', link: '/interview/vue/' },
                    { text: '性能优化', link: '/interview/performance/' },
                    { text: '网络', link: '/interview/internet/' },
                    { text: '操作系统', link: '/interview/os/' },
                    { text: '设计模式', link: '/interview/design/' },
                    { text: '综合问题', link: '/interview/other/' },
                    { text: '问解', link: '/interview/problem/' },
                    { text: '面经', link: '/interview/experience/' }
                ]
            }
        ],
        sidebar: {
            '/js/': getJsSidebar('javascript', '简介'),
            '/css/': getCssSidebar('css', '简介'),
            '/regexp/': getRegexpSidebar('regexp', '正则表达式'),
            '/node/': getNodeSidebar('node', 'NodeJS'),
            '/interview/js/': getInterviewJsSidebar('JsInterview', 'js面试题'),
            '/interview/css/': getInterviewCssSidebar('cssInterview', 'css面试'),
            '/interview/vue/': getInterviewVueSidebar('vueInterview', 'vue面试'),
            '/interview/other/': getInterviewOtherSidebar('otherInterview', '前端面试综合问题'),
            '/interview/internet/': getInterviewInternetSidebar('internetInterview', '网络'),
            '/interview/design/': getInterviewDesignSidebar('designPattern', '设计模式'),
            '/interview/performance/': getInterviewPerformanceSidebar('improvePF', '性能优化'),
            '/interview/experience/': getInterviewExperienceSidebar('experience', '面经整理'),
            '/interview/os/': getInterviewOsSidebar('os', '操作系统'),
            '/interview/problem/': getInterviewQASidebar('QA', '目录')
        },
        displayAllHeaders: false,
        sidebarDepth: 2,
    }
}

function getJsSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['problem/p0', '取巧之法'],
                ['problem/p1', '1.获取某年某月的天数'],
                ['problem/p2', '2.日期格式化'],
                ['problem/p3', '3.展开多级数组'],
                ['problem/p4', '4.判断常见变量类型'],
                ['problem/p5', '5.文件上传与下载']
            ]
        }
    ]
}

function getCssSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['problem/p1', '伪元素before与after'],
                ['problem/p2', '实现表格斑马纹']
            ]
        }
    ]
}

function getRegexpSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['problem/p1', '提取url()中的地址']
            ]
        }
    ]
}

function getNodeSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['problem/p1', '从控制台录入数据']
            ]
        }
    ]
}

function getInterviewJsSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
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
                ['symbol', 'Symbol的用法?'],
                ['arrowfun', '箭头函数?'],
                ['es6', 'ees6面试题']
            ]
        }
    ]
}

function getInterviewCssSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['reflow', '回流与重绘'],
                ['box', '盒模型'],
                ['flex', '弹性布局'],
                ['level', 'CSS层级关系'],
                ['display', 'display属性有哪些?作用分别是什么?'],
                ['position', 'position的值有哪些?'],
                ['bfc', 'BFC?'],
                ['ifc', 'IFC?']
            ]
        }
    ]
}

function getInterviewVueSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['bindData', '数据绑定'],
                ['hook', '生命周期钩子'],
                ['communicate', '组件通信'],
                ['extend', 'extend API'],
                ['mixin', 'mixin与mixins'],
                ['computed', 'computed与watch'],
                ['keep-alive', 'keep-alive'],
                ['showif', 'v-show 与 v-if']
            ]
        }
    ]
}

function getInterviewOtherSidebar(group, introduction) {
    let res = [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['engineering', '前端工程化'],
                ['inputurl', '输入URL到页面渲染的整个过程发生了什么?'],
                ['primitive', '原始类型有哪几种？null 是对象嘛？'],
                ['object', '对象类型和原始类型的不同之处？函数参数是对象会发生什么问题？'],
                ['judgeType', 'typeof 是否能正确判断类型？instanceof 能正确判断对象的原理是什么？'],
                ['typeConvert', '类型转换?'],
                ['this', '如何正确判断 this？箭头函数的 this 是什么？'],
                ['equal', '== 和 === 有什么区别？'],
                ['closure', '什么是闭包?'],
                ['copy', '什么是浅拷贝？如何实现浅拷贝？什么是深拷贝？如何实现深拷贝？'],
                ['prototype', '如何理解原型？如何理解原型链？'],
                ['promote', '什么是提升？什么是暂时性死区？var、let 及 const 区别？'],
                ['inherit', '原型如何实现继承？Class 如何实现继承？Class 本质是什么？'],
                ['module', '为什么要使用模块化？都有哪几种方式可以实现模块化，各有什么特点？'],
                ['promise', 'Promise 的特点是什么，分别有什么优缺点？什么是 Promise 链？Promise 构造函数执行和 then 函数执行有什么区别？'],
                ['asyncawait', 'async 及 await 的特点，它们的优点和缺点分别是什么？await 原理是什么？'],
                ['new', 'new 的原理是什么？通过 new 的方式创建对象和通过字面量创建有什么区别？'],
                ['v8garbage', 'V8 下的垃圾回收机制是怎么样的？'],
                ['event', '事件的触发过程是怎么样的？知道什么是事件代理嘛？'],
                ['cros', '什么是跨域？为什么浏览器要使用同源策略？你有几种方式可以解决跨域问题？了解预检请求嘛？']
            ]
        }
    ]
    addChildNums(res)
    return res;
}

function getInterviewInternetSidebar(group, introduction) {
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
                ['safe', '网络安全']
            ]
        }
    ]
}

function getInterviewDesignSidebar(group, introduction) {
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

function getInterviewPerformanceSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['cache', '浏览器缓存机制'],
                ['brorender', '浏览器渲染原理'],
                ['image', '图片优化'],
                ['dnsPre', 'DNS预解析'],
                ['throttling', '节流与防抖'],
                ['preLoad', '资源预加载'],
                ['preRender', '页面预渲染'],
                ['lazyLoad', '懒加载'],
                ['Internet', '网络层面优化'],
                ['storage', '本地存储'],
                ['cdn', 'CDN的缓存与回源机制'],
                ['ssr', '服务端渲染'],
                ['monitor', '监控']
            ]
        }
    ]
}

function getInterviewExperienceSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['tencent-video1', '腾讯视频一面']
            ]
        }
    ]
}

function getInterviewOsSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['process', '进程'],
                ['thread', '线程'],
                ['difprothr', '进程与线程的区别']
            ]
        }
    ]
}

function getInterviewQASidebar(group, introduction) {
    let res = [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['engineering', '怎样理解前端工程化?'],
                ['inputurl', '输入URL到页面渲染的整个过程发生了什么?'],
                ['primitive', '原始类型有哪几种？null 是对象嘛？'],
                ['zero', '为什么 0.1 + 0.2 != 0.3?'],
                ['objDfValue', '对象类型和原始类型的不同之处？'],
                ['objparam', '函数参数是对象会发生什么问题？'],
                ['typeof', 'typeof能否正常判断类型?'],
                ['instanceof', 'instanceof能正确判断对象的原因是什么?'],
                ['this', '如何正确判断this?箭头函数的this是什么?']
            ]
        }
    ]
    addChildNums(res)
    return res;
}

/**
 * 为侧边导航栏目加上序号
 * @param {Object} res 
 */
function addChildNums(res) {
    res[0].children.forEach((v, i) => {
        if (i > 0) {
            v[1] = `${i}.${v[1]}`
        }
    })
    return res;
}