import glob from 'fast-glob'
import matter from "gray-matter";
import fs from 'fs'
import type { DefaultTheme } from 'vitepress';

export function getConfigData() {
    const files = glob.sync('./**/*.md', { ignore: ['node_modules'] })
    // readme.md => index.md
    for (const file of files) {
        if(file.endsWith('README.md')){
            fs.promises.rename(file, file.replace('README.md', 'index.md'))
        }
    }
    const data = files.map(v => {
        const route = v.replace('.md', '')
        const fileContent = fs.readFileSync(v, 'utf-8')
        const meta = matter(fileContent).data
        if (!meta.title) {
            meta.title = fileContent.match(`# (.+)`)?.[1]
        }

        // 处理tags和categories,兼容历史文章
        meta.tag = (meta.tag||[]).concat([...new Set([...(meta.categories || []), ...(meta.tags || [])])])

        // 获取摘要信息
        const wordCount = 100
        meta.description = meta.description || getTextSummary(fileContent, wordCount)

        // 获取封面图
        if (!meta.cover) {
            meta.cover = fileContent.match(/[!]\[.+?\]\((https:\/\/.+)\)/)?.[1]
        }
        return {
            route,
            meta
        }
    })

    return {
        pagesData: data,
        sidebar: getSidebarData(files.map(v => v.replace('.md', '')))
    }
}

export function getSidebarData(routes: string[]) {
    const sideBar = routes.reduce<DefaultTheme.Sidebar>((pre, route) => {
        const routesSplit = route.split('/')
        const text = fs.readFileSync(`${route}.md`, 'utf-8')
        if (!routesSplit.slice(2)?.length) {
            return pre
        }
        const prefix = routesSplit.slice(0, 2).join('/')

        pre[prefix] = pre[prefix] || []

        const categoryData = pre[prefix]
            .find(v => v?.items?.some(v => v.link.startsWith(`/${prefix}`))) || {}
        if (!pre[prefix].includes(categoryData)) {
            pre[prefix].push(categoryData)
        }
        if (!categoryData['text']) {
            categoryData.text = prefix.split('/')[1]
        }
        if (!categoryData.items) {
            categoryData['items'] = []
        }
        const title = text.match('# (.+)')?.[1]

        categoryData['items'].push({
            text: title,
            link: `/${route}`
        })
        return pre
    }, {})
    return sideBar
}
function getTextSummary(text: string, count = 100) {
    return text
        .match(/^# ([\s\S]+)/m)?.[1]
        ?.replace(/#/g, '')
        ?.split('\n')
        ?.filter(v => !!v)
        ?.slice(1)
        ?.join('\n')
        ?.replace(/>(.*)/, '')
        ?.slice(0, count)
}