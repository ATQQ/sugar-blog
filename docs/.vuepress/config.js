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
                    { text: 'css', link: '/interview/css/' }
                ]
            }
        ],
        sidebar: {
            '/js/': getJsSidebar('javascript', '简介'),
            '/css/': getCssSidebar('css', '简介'),
            '/regexp/': getRegexpSidebar('regexp', '正则表达式'),
            '/node/': getNodeSidebar('node', 'NodeJS'),
            '/interview/js/': getInterviewJsSidebar('JsInterview', 'js面试题'),
            '/interview/css/': getInterviewCssSidebar('cssInterview', 'css面试')
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
                ['delete','delete'],
                ['garbage','垃圾回收'],
                ['throttling','节流与防抖'],
                ['apply','apply,call,bind']
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
                ['reflow', '回流与重绘']
            ]
        }
    ]
}