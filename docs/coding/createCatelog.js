const fs = require('fs')
const path = require('path')

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

// let dirs = getDirList(__dirname, 'problem');

// addDirListToREADME(dirs, path.resolve(__dirname, 'README.md'))

let dirs = fs.readdirSync(__dirname, { withFileTypes: true })

dirs.forEach(dir => {
    if (dir.isDirectory()) {
        let { name } = dir
        let list = getDirList(path.resolve(__dirname, name));
        addDirListToREADME(list, path.resolve(path.resolve(__dirname, name), 'README.md'))
        console.log(`success:${name}`)
    }
})