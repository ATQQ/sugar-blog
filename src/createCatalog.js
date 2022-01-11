const fs = require('fs')
const path = require('path')
// 待扫描的根目录
const scanDirectory = ['technology', 'offer', 'interview', 'computerBase', 'coding', 'bigWeb']
const baseDir = path.resolve(__dirname, '../docs')

/**
 * 获取指定目录下的md文件目录
 * @param {string} dir 目标目录
 * @param {string[]} exclude 排除的文件名
 */
function getDirMdCatalog(dir,exclude=[]) {
    let files = fs.readdirSync(dir,{withFileTypes:true})
    files = files.filter(f=>f.isFile() && !exclude.includes(f.name))
    let res = files.map(file => {
        const filename = file.name
        let title = fs.readFileSync(path.resolve(dir, filename), { encoding: 'utf-8' })
            .split('\n').find(str => {
                return str.startsWith('# ')
            }).slice(2).trim()
        return `* [${title}](./${filename})`
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
            let list = getDirMdCatalog(path.resolve(baseDir, v, name),['README.md']);
            addDirListToREADME(list, path.resolve(baseDir, v, name, 'README.md'))
            console.log(`success:${name}`)
        }
    })
    console.log(`------${v} add success------`);
})