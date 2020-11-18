const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

const { getDirFileByType } = require('./fileUtil')

Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function getFileBirthTime(url) {
    const infoStr = execSync(`git log --format=%aD ${url} | tail -1 `).toString('utf-8').trim()
    let date = new Date()
    if (infoStr) {
        date = new Date(infoStr)
    }
    return date.Format('yyyy-MM-dd')
}

function removeFileConfig(url) {
    const originData = fs.readFileSync(url, { encoding: 'utf-8' }).split('\n')
    const isHaveConfig = originData[0] === '---'
    const configEndIdx = originData.slice(1).findIndex(str => str === '---') + 1
    // 如果有才移除
    if (isHaveConfig) {
        fs.writeFileSync(url, originData.slice(configEndIdx + 1).join('\n'))
    }
}

const TagMap = {
    'bigweb': '大前端',
    'browser': '浏览器',
    'css': 'CSS',
    'es6': 'ES6',
    'html': 'html',
    'js': 'js',
    'node': 'node.js',
    'performance': '性能优化',
    'regexp': '正则表达式',
    'vue': 'vue',
    'coding': '手撕代码',
    'algorithm': '算法与数据结构',
    'computerBase': '计算机基础',
    'design': '设计模式',
    'internet': '计算机网络',
    'offer': '剑指offer',
    'os': '操作系统',
    'interview': '面试题',
    'code': '手撕代码',
    'mini': '小程序',
    'other': '未分类',
    'autumn20': '2020秋招',
    'campus': '校招考点',
    'experience': '面试经验',
    'spring20': '2020春招',
    'learn': '学习笔记',
    'theory': '学习笔记',
}
function getTags(url) {
    // Linux/mac
    const dirs = path.dirname(url).split('/')
    const tags = dirs.slice(dirs.length - 2).map(v => v.toLowerCase()).map(v => TagMap[v]).filter(v => v)
    return tags.length === 0 ? ['未分类'] : [...new Set(tags)]
}


const CategoryMap = {
    'browser': '浏览器',
    'css': 'CSS',
    'es6': 'JavaScript',
    'html': 'html',
    'js': 'JavaScript',
    'node': 'JavaScript',
    'performance': '性能优化',
    'regexp': '正则表达式',
    'vue': 'vue',
    'coding': '手撕代码',
    'algorithm': '算法与数据结构',
    'computerBase': '计算机基础',
    'design': '计算机基础',
    'internet': '计算机基础',
    'offer': '计算机基础',
    'os': '计算机基础',
    'interview': '面试',
    'code': '手撕代码',
    'mini': '小程序',
    'other': '未分类',
    'autumn20': '面试',
    'campus': '面试',
    'experience': '面试',
    'spring20': '面试',
    'learn': '学习笔记',
    'theory': '学习笔记',
}
function getCategory(url) {
    // Linux/mac
    const dirs = path.dirname(url).split('/')
    const categorys = dirs.slice(dirs.length - 2).map(v => v.toLowerCase()).map(v => CategoryMap[v] || '').filter(v => v)
    return categorys.length === 0 ? ['未分类'] : [...new Set(categorys)]
}

function getFileConfig(url) {
    const title = fs.readFileSync(url, { encoding: 'utf-8' }).split('\n').find(str => {
        return str.startsWith('# ')
    }).slice(2).replace(/[\sI]/g, '')
    const date = getFileBirthTime(url)
    const tags = getTags(url)
    const noCategoryKey = ['campus', 'show']
    if (noCategoryKey.filter(k => url.includes(k)).length !== 0) {
        return `---
title: ${title}
date: ${date}
tags: 
${tags.map(v => ` - ${v}`).join('\n')}
isTimeLine: true
---`
    }
    const categorys = getCategory(url)
    return `---
title: ${title}
date: ${date}
tags: 
${tags.map(v => ` - ${v}`).join('\n')}
categories:
${categorys.map(v => ` - ${v}`).join('\n')}
isTimeLine: true
---`
}

const files = getDirFileByType(__dirname + '/../docs', 'md').filter(v => !v.endsWith('README.md'))

for (const filepath of files) {
    // 移除旧的配置文件
    removeFileConfig(filepath)
    const config = getFileConfig(filepath)
    const originData = fs.readFileSync(filepath, { encoding: 'utf-8' })
    // 写入新的内容
    fs.writeFileSync(filepath, config + '\n' + originData)
}
