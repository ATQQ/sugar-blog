const { getDirFileByType } = require('../utils')
const fs = require('fs')

const files = getDirFileByType(__dirname + '/../../docs', 'md')

// 加入页面统计
for (const filePath of files) {
    const data = fs.readFileSync(filePath, {
        encoding: 'utf-8'
    }).split('\n')
    const lastLine = data[data.length - 1].trim()
    // 最后一行为空则 直接替换加入tj
    if (lastLine.length === 0) {
        data.push('<tongji/>')
        fs.writeFileSync(filePath, data.join('\n'))
    } else if (lastLine !== '<tongji/>') {
        data.push('')
        data.push('<tongji/>')
        fs.writeFileSync(filePath, data.join('\n'))
    }
}

// 加入页面评论
for (const filePath of files) {
    // 不在README中添加
    if (filePath.endsWith('README.md')) {
        continue
    }

    const data = fs.readFileSync(filePath, {
        encoding: 'utf-8'
    }).split('\n')

    // 如有comment标签则不处理
    if (data.findIndex(v => v.trim() === '<comment/>') !== -1) {
        continue
    }
    // 没有则添加
    data.splice(data.length - 1, 0, '<comment/>')
    fs.writeFileSync(filePath, data.join('\n'))
}