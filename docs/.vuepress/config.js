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
        repo:'ATQQ/sugar-blog',
        repoLabel:'Github',
        editLinks: true,
        docsDir: 'docs',
        docsBranch: 'master',
        nav: [
            {
                text: '大前端',
                items: [
                { text: 'javascript', link: '/js/' },
                { text: 'css',link: '/css/'},
                { text: 'es6 and more', link: '/es6+/' }]
            }
        ],
        sidebar: {
            '/js/': getJsSidebar('javascript', '简介'),
            '/css/': getCssSidebar('css','简介')
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