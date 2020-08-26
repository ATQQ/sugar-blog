const { getDirFileByType } = require('./fileUtil')
const path = require('path')
const fs = require('fs')

const files = getDirFileByType(__dirname + '/../docs', 'md')

for (const filePath of files) {
    const data = fs.readFileSync(filePath, {
        encoding: 'utf-8'
    }).split('\n')
    const lastLine = data[data.length - 1].trim()
    // 最后一行为空则 直接替换加入tj
    if (lastLine.length === 0) {
        data.push('<tongji/>')
    } else if (lastLine !== '<tongji/>') {
        data.push('')
        data.push('<tongji/>')
    }
    fs.writeFileSync(filePath, data.join('\n'))
}