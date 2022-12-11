import { inspect } from 'util'
import { defineConfig } from 'vitepress'
import Pkg from './../package.json'
import { getConfigData } from './util'
const extraHead: any = process.env.NODE_ENV === 'production' ? [
    ['script', { charset: 'UTF-8', id: 'LA_COLLECT', src: '//sdk.51.la/js-sdk-pro.min.js' }],
    ['script', {}, 'LA.init({id: "Jgmg5avjAUvoyePS",ck: "Jgmg5avjAUvoyePS",hashMode: true})'],
] : []
const { pagesData, sidebar } = getConfigData()

export default defineConfig({
    title: '粥里有勺糖',
    description: '粥里有勺糖的个人博客，记录随笔与学习笔记，大前端相关的知识，高频面试题，个人面经等',
    head: [
        ['meta', { name: 'theme-color', content: '#ffffff' }],
        ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/png' }],
        ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
        ['meta', { name: 'author', content: '粥里有勺糖' }],
        ['link', { rel: 'mask-icon', href: '/favicon.ico', color: '#ffffff' }],
        ['link', { rel: 'apple-touch-icon', href: '/favicon.ico', sizes: '180x180' }],
        ...extraHead
    ],
    vite: {
        server: {
            port: 4000,
            host: '0.0.0.0'
        },
    },
    lastUpdated: true,
    themeConfig: {
        // @ts-ignore
        pagesData,
        // algolia :{
        //     appId:'GPX84VDH91',
        //     apiKey: '150dda0b943087c4e6a04d54af1d7391',
        //     indexName: 'sugarat',
        //     placeholder: '请输入要搜索的内容...',
        // },
        lastUpdatedText: '上次更新于',
        footer: {
            message: `<a target="_blank" href="https://beian.miit.gov.cn/">蜀ICP备19011724号</a>`,
            copyright: 'MIT Licensed | © 2018-present 粥里有勺糖',
        },
        logo: '/logo.png',
        editLink: {
            pattern: "https://github.com/ATQQ/easypicker2-client/edit/main/docs/:path",
            text: '去 GitHub 上编辑内容'
        },
        nav: [
            {
                text: '私有化部署',
                items: [
                    {
                        text: '本地启动',
                        link: '/deploy/local',
                    },
                    {
                        text: '线上部署',
                        link: '/deploy/online',
                    },
                    {
                        text: '接入七牛云OSS',
                        link: '/deploy/qiniu',
                    },
                    {
                        text: '常见问题❓',
                        link: '/deploy/faq',
                    },
                    {
                        text: '相关设计',
                        link: '/deploy/design/index',
                    }
                ],
                activeMatch: '/deploy/'
            },
            {
                text: `v${Pkg.version}`,
                items: [
                    { text: '⭐️ 需求墙', link: '/plan/wish' },
                    { text: '🥔 近期规划', link: '/plan/todo' },
                    { text: '📅 更新日志', link: '/plan/log' },
                ],
                activeMatch: '/plan/'
            },
            {
                text: '作者信息', link: '/author',
            },
            {
                text: '打赏', link: '/praise/index',
            },
            { text: '⭐️ 需求墙', link: '/plan/wish' },
        ],
        // sidebar,
        socialLinks: [
            { icon: 'github', link: 'https://github.com/ATQQ/easypicker2-client' },
        ],
    },
})