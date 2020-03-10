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
                    { text: '设计模式', link: '/interview/design/' },
                    { text: '综合问题', link: '/interview/other/' }
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
            '/interview/performance/': getInterviewPerformanceSidebar('improvePF', '性能优化')
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
                ['clock', '定时器']
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
                ['flex', '弹性布局']
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
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['engineering', '前端工程化'],
                ['inputurl', '输入URL到页面渲染的整个过程']
            ]
        }
    ]
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
                ['http', 'HTTP协议']
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
                ['ssr', '服务端渲染']
            ]
        }
    ]
}