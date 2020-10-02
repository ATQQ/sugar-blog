const fs = require('fs')
const path = require('path')
// 待扫描的根目录
const scanDirectory = ['technology', 'offer', 'interview', 'computerBase', 'coding', 'bigWeb']
const baseDir = path.resolve(__dirname, '../docs')

function getDirList(dir, dir2 = '') {
    let files = fs.readdirSync(path.resolve(dir, dir2))
    files = files.filter(v => v !== 'README.md')
    let res = files.map(file => {
        let text = fs.readFileSync(path.resolve(dir, dir2, file), { encoding: 'utf-8' })
        let title = text.split('\n')[0].replace(/#/g, '').trim()
        return `* [${title}](./${dir2 ? `${dir2}/` : ''}${file})`
    })
    return res;
}
function addDirListToREADME(dirList, readmefile) {
    let res = `\n\n## 目录\n${dirList.join("\n")}`
    let old = fs.readFileSync(readmefile, { encoding: 'utf-8' })
    old = old.slice(0, old.indexOf('\n\n## 目录'))
    fs.writeFileSync(readmefile, old)
    fs.appendFileSync(readmefile, res)
}

// 对指定的根目录进行扫描
scanDirectory.forEach(v => {
    console.log(`------start scan ${v}------`);
    let dirs = fs.readdirSync(path.resolve(baseDir, v), { withFileTypes: true })
    dirs.forEach(dir => {
        if (dir.isDirectory()) {
            let { name } = dir
            let list = getDirList(path.resolve(baseDir, v, name));
            addDirListToREADME(list, path.resolve(baseDir, v, name, 'README.md'))
            console.log(`success:${name}`)
        }
    })
    console.log(`------${v} add success------`);
})