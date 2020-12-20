const fs = require('fs')
const path = require('path')
const outputDir = path.resolve(__dirname, '../dist')

const filepath = path.resolve(__dirname, '../', process.argv[2])
const filename = path.basename(filepath)

const fileContent = fs.readFileSync(filepath, { encoding: 'utf-8' })

const res = fileContent.split('\n').map(v => {
    if (v.startsWith('#')) {
        return v.replace('##', '#')
    }
    return v
})

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
}

fs.writeFileSync(path.resolve(outputDir, filename), res.join('\n'), { encoding: 'utf-8' })